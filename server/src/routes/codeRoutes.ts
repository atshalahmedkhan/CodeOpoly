import { Router } from 'express';
import type { Server } from 'socket.io';
import { challengeById, publicChallenge, type Language } from '../code/problems.js';
import { grade } from '../code/grader.js';
import { Judge0Executor, type Executor } from '../code/executor.js';
import { endPlayerTurn, getGameById, saveGameState } from '../socket/socketHandlers.js';
import { recordProblemSolved } from './authRoutes.js';
import { withGameLock } from '../utils/gameLock.js';
import { tokenMatches } from '../utils/playerAuth.js';
import { rateLimit } from '../utils/rateLimit.js';

const languages = new Set<Language>(['javascript','python','cpp','java']);

export function createCodeRoutes(io: Server, executor: Executor = new Judge0Executor()) {
  const router = Router();
  router.get('/challenges/:id', (req, res) => {
    const challenge = challengeById(req.params.id);
    if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
    res.json(publicChallenge(challenge));
  });

  const handler = (submit: boolean) => async (req: any, res: any) => {
    try {
      const { gameId, playerId, challengeId, language, sourceCode } = req.body || {};
      if (!gameId || !playerId || !challengeId || !languages.has(language) || typeof sourceCode !== 'string') return res.status(400).json({ error: 'Invalid code request.' });
      if (sourceCode.length < 1 || sourceCode.length > 50000) return res.status(400).json({ error: 'Source code must be between 1 and 50,000 characters.' });
      const challenge = challengeById(challengeId);
      if (!challenge) return res.status(404).json({ error: 'Challenge not found.' });
      const game: any = await getGameById(gameId);
      if (!game) return res.status(404).json({ error: 'Game not found.' });
      const player = game.players.find((p: any) => p.id === playerId);
      if (!player || !tokenMatches(player.token, req.headers['x-player-token'])) return res.status(401).json({ error: 'Not authorised for this player.' });
      const pending = game.pendingChallenges?.[playerId];
      if (!player || game.currentTurn !== playerId || !pending || pending.challengeId !== challengeId) return res.status(409).json({ error: 'This challenge is not active for the current turn.' });
      const property = game.boardState.find((p: any) => p.id === pending.propertyId);
      if (!property || player.position !== property.position || property.ownerId || property.price <= 0) return res.status(409).json({ error: 'The property interaction is no longer valid.' });
      const result = await grade(challenge, language, sourceCode, executor, submit);
      if (submit && result.allPassed) {
        // Re-read under the game lock after remote execution so concurrent or replayed
        // submissions cannot purchase twice.
        const outcome = await withGameLock(gameId, async () => {
          const fresh: any = await getGameById(gameId);
          const freshPlayer = fresh?.players.find((p: any) => p.id === playerId);
          const freshPending = fresh?.pendingChallenges?.[playerId];
          const freshProperty = fresh?.boardState.find((p: any) => p.id === freshPending?.propertyId);
          if (!freshPlayer || fresh.status === 'finished' || fresh.currentTurn !== playerId || freshPending?.challengeId !== challengeId || !freshProperty || freshProperty.ownerId || freshPlayer.position !== freshProperty.position) return { error: 'The property interaction was already resolved.' };
          if (freshPlayer.money < freshProperty.price) return { error: 'Not enough money to buy this property.' };
          freshProperty.ownerId = playerId; freshProperty.houses = 1; freshPlayer.money -= freshProperty.price;
          freshPlayer.properties = freshPlayer.properties || []; freshPlayer.properties.push(freshProperty.id);
          delete fresh.pendingChallenges[playerId];
          // Mixed fields are not change-tracked: without this the delete is lost in MongoDB.
          if (typeof fresh.markModified === 'function') fresh.markModified('pendingChallenges');
          await saveGameState(gameId, fresh);
          io.to(gameId).emit('property-bought', { playerId, playerName: freshPlayer.name || 'Player', propertyId: freshProperty.id, propertyName: freshProperty.name });
          await endPlayerTurn(fresh, gameId, io);
          return { name: freshPlayer.name as string | undefined };
        });
        if ('error' in outcome) return res.status(409).json({ error: outcome.error });
        if (outcome.name) recordProblemSolved(outcome.name).catch(() => {});
      }
      res.status(result.status === 'service_unavailable' ? 503 : 200).json(result);
    } catch {
      res.status(500).json({ error: 'Unable to judge this submission.' });
    }
  };
  const limiter = rateLimit(30, 60_000);
  router.post('/run', limiter, handler(false));
  router.post('/submit', limiter, handler(true));
  return router;
}

