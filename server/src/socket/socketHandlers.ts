import { randomInt } from 'node:crypto';
import { Server, Socket } from 'socket.io';
import mongoose from 'mongoose';
import { Game } from '../models/Game.js';
import { findGameById, updateGame, deleteGame, getAllGames } from '../utils/memoryStore.js';
import { getRandomChanceCard, getRandomCommunityChestCard, type DebuggingCard } from '../utils/debuggingCards.js';
import { recordGameResult, recordTurnCompleted } from '../routes/authRoutes.js';
import { challengeForTier, publicChallenge } from '../code/problems.js';
import { withGameLock } from '../utils/gameLock.js';
import { publicPlayers, tokenMatches } from '../utils/playerAuth.js';

const GAME_DURATION_MS = (Number(process.env.GAME_DURATION_MINUTES) || 45) * 60 * 1000;
// Indirection so tests can force specific rolls.
export const dice = { roll: () => randomInt(1, 7) };

const JAIL_POSITION = 10;
const JAIL_FINE = 50;
const MAX_JAIL_TURNS = 3;

function useMongoDB() {
  return mongoose.connection.readyState === 1;
}

function isValidObjectId(id: string): boolean {
  return mongoose.Types.ObjectId.isValid(id) && /^[0-9a-fA-F]{24}$/.test(id);
}

export async function getGameById(gameId: string) {
  if (useMongoDB() && isValidObjectId(gameId)) {
    return await Game.findById(gameId);
  } else {
    return findGameById(gameId);
  }
}

export async function saveGameState(gameId: string, game: any) {
  game.lastActivity = new Date();
  if (useMongoDB() && typeof game.save === 'function') {
    return await game.save();
  } else {
    return updateGame(gameId, game);
  }
}

export function serializeGameState(game: any) {
  const plain = typeof game.toObject === 'function' ? game.toObject() : { ...game };
  return {
    ...plain,
    _id: game._id ? String(game._id) : game.id,
    boardState: plain.boardState || [],
    players: publicPlayers(game.players),
  };
}

// Mongoose does not track in-place edits of Mixed fields; without this the
// change is silently dropped on save().
function touchMixed(game: any) {
  if (typeof game.markModified === 'function') {
    game.markModified('pendingChallenges');
    game.markModified('rentDue');
  }
}

const idOf = (game: any): string => (game._id ? String(game._id) : game.id);
const activePlayers = (game: any) => game.players.filter((p: any) => !p.bankrupt);

function netWorth(game: any, player: any): number {
  const owned = (game.boardState || []).filter((p: any) => p.ownerId === player.id);
  return (player.money || 0) + owned.reduce((sum: number, p: any) => sum + (p.price || 0) + (p.houses || 0) * (p.houseCost || 0), 0);
}

function computeWinnerName(game: any): string {
  const pool = activePlayers(game).length ? activePlayers(game) : game.players;
  if (!pool.length) return '';
  return pool.reduce((best: any, p: any) => (netWorth(game, p) > netWorth(game, best) ? p : best)).name;
}

function declareBankrupt(game: any, player: any, creditor?: any) {
  player.bankrupt = true;
  player.money = 0;
  for (const prop of game.boardState) {
    if (prop.ownerId !== player.id) continue;
    if (creditor) {
      prop.ownerId = creditor.id;
      creditor.properties = creditor.properties || [];
      creditor.properties.push(prop.id);
    } else {
      prop.ownerId = undefined;
      prop.houses = 0;
    }
  }
  player.properties = [];
}

// Debits a player (to the bank or to a creditor). Never leaves negative money:
// a player who cannot cover the debt pays what they have and goes bankrupt.
function charge(game: any, player: any, amount: number, creditor?: any) {
  const due = Math.max(0, Math.round(amount));
  if (player.money >= due) {
    player.money -= due;
    if (creditor) creditor.money += due;
    return { paid: due, bankrupt: false };
  }
  const paid = Math.max(0, player.money);
  if (creditor) creditor.money += paid;
  declareBankrupt(game, player, creditor);
  return { paid, bankrupt: true };
}

// Idempotent: results are recorded exactly once.
export async function finishGame(game: any, gameId: string, io: Server) {
  if (game.status === 'finished') return;
  game.status = 'finished';
  game.winnerName = computeWinnerName(game);
  game.rentDue = null;
  game.pendingChallenges = {};
  touchMixed(game);
  await saveGameState(gameId, game);
  await recordGameResult(game.players, game.winnerName);
  io.to(gameId).emit('game-over', { gameId, winnerName: game.winnerName });
  io.to(gameId).emit('game-state', serializeGameState(game));
}

function clockExpired(game: any): boolean {
  return game.status === 'in-progress' && !!game.endsAt && Date.now() >= new Date(game.endsAt).getTime();
}

export async function endPlayerTurn(game: any, gameId: string, io: Server) {
  if (!game || !game.players || game.players.length === 0) {
    console.error('❌ Cannot end turn: Invalid game or no players');
    return;
  }
  if (game.status === 'finished') return;

  const currentIndex = game.players.findIndex((p: any) => p.id === game.currentTurn);
  if (currentIndex === -1 && activePlayers(game).length) {
    game.currentTurn = activePlayers(game)[0].id;
  }

  if (activePlayers(game).length <= 1 || clockExpired(game)) {
    await finishGame(game, gameId, io);
    return;
  }

  const previous = game.players[Math.max(currentIndex, 0)];
  let nextIndex = currentIndex;
  do {
    nextIndex = (nextIndex + 1) % game.players.length;
  } while (game.players[nextIndex].bankrupt);

  recordTurnCompleted(previous.name).catch(err => console.error('Error updating turn stat:', err));

  if (game.pendingChallenges) delete game.pendingChallenges[previous.id];
  game.rentDue = null;
  game.hasRolled = false;
  touchMixed(game);
  game.currentTurn = game.players[nextIndex].id;
  game.turnNumber += 1;

  await saveGameState(gameId, game);

  io.to(gameId).emit('turn-ended', {
    nextPlayerId: game.currentTurn,
    nextPlayerName: game.players[nextIndex].name,
    turnNumber: game.turnNumber,
  });
  io.to(gameId).emit('game-state', serializeGameState(game));
}

// Called on a timer: ends games whose clock has run out.
export async function expireOverdueGames(io: Server) {
  const candidates: any[] = useMongoDB()
    ? await Game.find({ status: 'in-progress', endsAt: { $lt: new Date() } })
    : getAllGames().filter(clockExpired);
  for (const c of candidates) {
    const id = idOf(c);
    await withGameLock(id, async () => {
      const game: any = await getGameById(id);
      if (game && clockExpired(game)) await finishGame(game, id, io);
    });
  }
}

type Ctx = { game: any; player: any; gameId: string; playerId: string };

export function setupSocketHandlers(io: Server, socket: Socket) {
  // Every post-join event is bound to the identity proven at join time; any
  // playerId/gameId in the payload is ignored.
  function onGame(event: string, fn: (ctx: Ctx, payload: any) => Promise<void>) {
    socket.on(event, async (payload: any = {}) => {
      const gameId: string | undefined = socket.data.gameId;
      const playerId: string | undefined = socket.data.playerId;
      if (!gameId || !playerId) {
        socket.emit('error', { message: 'Join the game first' });
        return;
      }
      try {
        await withGameLock(gameId, async () => {
          const game: any = await getGameById(gameId);
          if (!game) return void socket.emit('error', { message: 'Game not found' });
          const player = game.players.find((p: any) => p.id === playerId);
          if (!player) return void socket.emit('error', { message: 'Player not found' });
          await fn({ game, player, gameId, playerId }, payload || {});
        });
      } catch (error) {
        console.error(`Error handling ${event}:`, error);
        socket.emit('error', { message: `Failed to process ${event}` });
      }
    });
  }

  socket.on('join-game', async ({ gameId, playerId, token } = {} as any) => {
    try {
      if (typeof gameId !== 'string' || typeof playerId !== 'string') {
        socket.emit('error', { message: 'Invalid join request' });
        return;
      }
      await withGameLock(gameId, async () => {
        const game: any = await getGameById(gameId);
        if (!game) return void socket.emit('error', { message: 'Game not found' });

        const player = game.players.find((p: any) => p.id === playerId);
        if (!player || !tokenMatches(player.token, token)) {
          return void socket.emit('error', { message: 'Not authorised to join this game' });
        }

        if (socket.data.gameId && socket.data.gameId !== gameId) socket.leave(socket.data.gameId);
        socket.data.gameId = gameId;
        socket.data.playerId = playerId;
        player.socketId = socket.id;
        await saveGameState(gameId, game);

        socket.join(gameId);
        socket.emit('joined-game', { gameId, playerId });
        const gameState = serializeGameState(game);
        socket.to(gameId).emit('player-joined', { playerId, playerName: player.name, playerAvatar: player.avatar });
        io.to(gameId).emit('game-state', gameState);
      });
    } catch (error) {
      console.error('Error joining game:', error);
      socket.emit('error', { message: 'Failed to join game' });
    }
  });

  onGame('leave-game', async ({ game, player, gameId, playerId }) => {
    const index = game.players.findIndex((p: any) => p.id === playerId);
    socket.leave(gameId);
    socket.data.gameId = undefined;
    socket.data.playerId = undefined;

    if (game.status === 'waiting') {
      if (index === 0 || game.players.length <= 1) {
        if (useMongoDB() && isValidObjectId(gameId)) await Game.findByIdAndDelete(gameId);
        else deleteGame(gameId);
        io.to(gameId).emit('game-cancelled', { message: 'Host cancelled or closed the lobby' });
        return;
      }
      game.players.splice(index, 1);
      await saveGameState(gameId, game);
    } else if (game.status === 'in-progress' && !player.bankrupt) {
      // Leaving mid-game forfeits: assets return to the bank and the turn moves on.
      const wasTurn = game.currentTurn === playerId;
      declareBankrupt(game, player);
      if (wasTurn) await endPlayerTurn(game, gameId, io);
      else if (activePlayers(game).length <= 1) await finishGame(game, gameId, io);
      else await saveGameState(gameId, game);
    }

    io.to(gameId).emit('player-left', { playerId, playerName: player.name });
    io.to(gameId).emit('game-state', serializeGameState(game));
  });

  onGame('delete-game', async ({ game, gameId, playerId }) => {
    if (game.players[0]?.id !== playerId || game.status !== 'waiting') {
      return void socket.emit('error', { message: 'Only the host can close a lobby that has not started' });
    }
    if (useMongoDB() && isValidObjectId(gameId)) await Game.findByIdAndDelete(gameId);
    else deleteGame(gameId);
    io.to(gameId).emit('game-deleted', { gameId });
  });

  onGame('roll-dice', async ({ game, player, gameId, playerId }) => {
    if (game.status === 'finished') return void socket.emit('error', { message: 'Game is over' });
    if (player.bankrupt) return void socket.emit('error', { message: 'You are bankrupt' });
    if (game.currentTurn !== playerId) return void socket.emit('error', { message: 'Not your turn' });
    if (game.hasRolled) return void socket.emit('error', { message: 'You already rolled this turn' });

    if (game.status === 'waiting') {
      if (game.players.length < 2) return void socket.emit('error', { message: 'Need at least 2 players to start' });
      game.status = 'in-progress';
      game.startTime = new Date();
      game.endsAt = new Date(Date.now() + GAME_DURATION_MS);
    }
    if (clockExpired(game)) return void (await finishGame(game, gameId, io));

    const dice1 = dice.roll();
    const dice2 = dice.roll();
    const total = dice1 + dice2;
    game.hasRolled = true;

    if (player.inJail) {
      if (dice1 === dice2) {
        player.inJail = false;
        player.jailTurns = 0;
      } else {
        player.jailTurns = (player.jailTurns || 0) + 1;
        if (player.jailTurns < MAX_JAIL_TURNS) {
          await saveGameState(gameId, game);
          io.to(gameId).emit('dice-rolled', { playerId, dice: [dice1, dice2], total, newPosition: player.position, passedGo: false });
          return void (await endPlayerTurn(game, gameId, io));
        }
        // Third failed attempt: pay the fine and move.
        player.inJail = false;
        player.jailTurns = 0;
        if (charge(game, player, JAIL_FINE).bankrupt) {
          await saveGameState(gameId, game);
          io.to(gameId).emit('dice-rolled', { playerId, dice: [dice1, dice2], total, newPosition: player.position, passedGo: false });
          return void (await endPlayerTurn(game, gameId, io));
        }
      }
    }

    const passedGo = player.position + total >= 40;
    player.position = (player.position + total) % 40;
    if (passedGo) player.money += 200;
    const newPosition = player.position;
    const events: Array<() => void> = [];
    events.push(() => io.to(gameId).emit('dice-rolled', { playerId, dice: [dice1, dice2], total, newPosition, passedGo }));

    const endAfter = await resolveLanding(game, player, gameId, events, false);
    await saveGameState(gameId, game);
    events.forEach(emit => emit());
    if (endAfter || player.bankrupt) await endPlayerTurn(game, gameId, io);
  });

  // Resolves the square the player is standing on. Returns true when the turn
  // must end immediately (bankruptcy or jail). Queues socket emissions so they
  // fire only after the new state is saved.
  async function resolveLanding(game: any, player: any, gameId: string, events: Array<() => void>, fromCard: boolean): Promise<boolean> {
    const space = game.boardState.find((p: any) => p.position === player.position);
    if (!space) return false;
    const playerId = player.id;
    const landed = (extra: Record<string, unknown> = {}) =>
      events.push(() => io.to(gameId).emit('landed-on-space', { playerId, property: space, canBuy: false, mustPayRent: false, ...extra }));

    switch (space.specialType) {
      case 'chance':
      case 'community-chest': {
        if (fromCard) return false;
        const card = space.specialType === 'chance' ? getRandomChanceCard() : getRandomCommunityChestCard();
        events.push(() => socket.emit('debugging-card-drawn', { card, playerId, property: space.name }));
        return await applyCardEffect(game, player, card, gameId, events);
      }
      case 'tax': {
        const result = charge(game, player, space.rent || 0);
        landed();
        events.push(() => io.to(gameId).emit('card-effect', { playerId, message: `${player.name} paid $${result.paid} in ${space.name}`, moneyChange: -result.paid }));
        return result.bankrupt;
      }
      case 'go-to-jail': {
        player.position = JAIL_POSITION;
        player.inJail = true;
        player.jailTurns = 0;
        landed();
        return true;
      }
      case 'go':
      case 'jail':
      case 'free-parking':
        landed();
        return false;
    }

    if (!(space.price > 0)) {
      landed();
      return false;
    }

    if (!space.ownerId) {
      const canBuy = player.money >= space.price;
      let challenge;
      if (canBuy) {
        const selected = challengeForTier(space.color || 'brown');
        game.pendingChallenges = game.pendingChallenges || {};
        game.pendingChallenges[playerId] = { challengeId: selected.id, propertyId: space.id };
        touchMixed(game);
        challenge = publicChallenge(selected);
      }
      landed({ canBuy, challenge });
      return false;
    }

    if (space.ownerId !== playerId) {
      const owner = game.players.find((p: any) => p.id === space.ownerId);
      if (owner && !owner.bankrupt) {
        game.rentDue = { playerId, propertyId: space.id };
        touchMixed(game);
        landed({ mustPayRent: true });
        return false;
      }
    }
    landed();
    return false;
  }

  // Legacy client-authoritative purchase path is intentionally disabled.
  socket.on('buy-property', () => {
    socket.emit('error', { message: 'Solve and submit the server challenge before purchasing.' });
  });

  // Code duels are not implemented server-side yet. They previously awarded wins
  // without running any code, so they are disabled rather than exploitable.
  for (const event of ['challenge-duel', 'submit-duel-code', 'duel-code-update']) {
    socket.on(event, () => socket.emit('error', { message: 'Code duels are not available yet.' }));
  }

  onGame('end-turn', async ({ game, gameId, playerId }) => {
    if (game.status === 'finished') return void socket.emit('error', { message: 'Game is over' });
    if (game.currentTurn !== playerId) return void socket.emit('error', { message: 'Not your turn' });
    if (game.rentDue?.playerId === playerId) return void socket.emit('error', { message: 'Pay your rent before ending the turn' });
    await endPlayerTurn(game, gameId, io);
  });

  onGame('pay-rent', async ({ game, player, gameId, playerId }) => {
    const due = game.rentDue;
    if (game.status !== 'in-progress' || game.currentTurn !== playerId || !due || due.playerId !== playerId) {
      return void socket.emit('error', { message: 'No rent is due' });
    }
    const property = game.boardState.find((p: any) => p.id === due.propertyId);
    const owner = property && game.players.find((p: any) => p.id === property.ownerId);
    if (!property || !owner || owner.id === playerId || player.position !== property.position) {
      game.rentDue = null;
      touchMixed(game);
      await saveGameState(gameId, game);
      return void socket.emit('error', { message: 'Invalid rent request' });
    }

    const { paid, bankrupt } = charge(game, player, calculateRent(property), owner);
    game.rentDue = null;
    touchMixed(game);
    await saveGameState(gameId, game);
    io.to(gameId).emit('rent-paid', { playerId, ownerId: owner.id, propertyId: property.id, amount: paid });
    if (bankrupt) io.to(gameId).emit('card-effect', { playerId, message: `${player.name} went bankrupt!`, moneyChange: -paid });
    await endPlayerTurn(game, gameId, io);
  });

  onGame('upgrade-property', async ({ game, player, gameId, playerId }, { propertyId }) => {
    const property = game.boardState.find((p: any) => p.id === propertyId);
    if (game.status !== 'in-progress' || player.bankrupt || !property || property.ownerId !== playerId || (property.houses || 0) >= 5) {
      return void socket.emit('error', { message: 'Cannot upgrade this property' });
    }
    const houseCost = property.houseCost || 50;
    if (player.money < houseCost) return void socket.emit('error', { message: 'Not enough money' });

    property.houses = (property.houses || 0) + 1;
    player.money -= houseCost;
    await saveGameState(gameId, game);
    io.to(gameId).emit('property-upgraded', { playerId, propertyId, houses: property.houses });
  });

  // The clock is server-authoritative; this only nudges an immediate check.
  onGame('game-time-up', async ({ game, gameId }) => {
    if (clockExpired(game)) await finishGame(game, gameId, io);
  });

  onGame('get-game-state', async ({ game }) => {
    socket.emit('game-state', serializeGameState(game));
  });

  async function applyCardEffect(game: any, player: any, card: DebuggingCard, gameId: string, events: Array<() => void>): Promise<boolean> {
    const message = `${player.name} ${card.message}`;
    if (card.effect.money) {
      const amount = card.effect.money;
      let moneyChange = amount;
      if (amount > 0) player.money += amount;
      else {
        const result = charge(game, player, -amount);
        moneyChange = -result.paid;
        if (result.bankrupt) {
          events.push(() => io.to(gameId).emit('card-effect', { playerId: player.id, message, moneyChange }));
          return true;
        }
      }
      events.push(() => io.to(gameId).emit('card-effect', { playerId: player.id, message, moneyChange }));
    }

    if (card.effect.move) {
      const raw = player.position + card.effect.move;
      if (raw >= 40) player.money += 200;
      player.position = ((raw % 40) + 40) % 40;
      const newPosition = player.position;
      events.push(() => io.to(gameId).emit('card-effect', { playerId: player.id, message, newPosition }));
      return await resolveLanding(game, player, gameId, events, true);
    }
    return false;
  }
}

function calculateRent(property: any): number {
  const baseRent = property.rent || 0;
  const numSolutions = property.houses || 0;

  let difficultyMultiplier = 1.0;
  if (property.price > 200) {
    difficultyMultiplier = 2.0;
  } else if (property.price > 100) {
    difficultyMultiplier = 1.5;
  }

  const rent = baseRent * (1 + (numSolutions * difficultyMultiplier));

  if (property.rentWithHouse && property.rentWithHouse.length > 0) {
    if (numSolutions === 0) {
      return baseRent;
    } else if (numSolutions >= 4) {
      return property.rentWithHotel || rent;
    } else {
      return property.rentWithHouse[numSolutions - 1] || rent;
    }
  }

  return Math.round(rent);
}
