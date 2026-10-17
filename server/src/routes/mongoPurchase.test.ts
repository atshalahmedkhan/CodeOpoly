import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import mongoose from 'mongoose';
import { Game } from '../models/Game.js';
import { dice } from '../socket/socketHandlers.js';
import type { Executor } from '../code/executor.js';
import { withServer, once, setup } from '../testing/helpers.js';

// Runs real JavaScript so the genuine grader passes on correct solutions.
const jsExecutor: Executor = {
  async execute(source) {
    const out: string[] = [];
    try { vm.runInNewContext(source, { console: { log: (x: unknown) => out.push(String(x)) } }, { timeout: 1000 }); }
    catch (e: any) { return { status: 'runtime_error', message: String(e?.message) }; }
    return { status: 'ok', stdout: out.join('\n') };
  },
};
const solutions: Record<string, string> = {
  'two-sum': 'function twoSum(n,t){for(let i=0;i<n.length;i++)for(let j=i+1;j<n.length;j++)if(n[i]+n[j]===t)return [i,j];return [];}',
  'reverse-string': 'function reverseString(s){return [...s].reverse();}',
};

const uri = process.env.MONGODB_TEST_URI || 'mongodb://127.0.0.1:27017/codeopoly_test';
let mongoUp = false;
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 1500 });
  mongoUp = true;
} catch { /* no MongoDB available: the test below is skipped */ }

test('MongoDB: a player can buy several properties in a row (Mixed field persistence)', { skip: !mongoUp && 'MongoDB not reachable' }, async () => {
  const realRoll = dice.roll;
  try {
    await withServer(async ({ base, url }) => {
      const { host, hs, gs, gameId } = await setup(url, base);
      const rolls: number[] = [];
      dice.roll = () => rolls.shift() ?? 1;

      const buy = async (diceValues: [number, number], expectedProperty: string) => {
        rolls.push(...diceValues);
        const landed = once(hs, 'landed-on-space');
        hs.emit('roll-dice', {});
        const { property, canBuy, challenge } = await landed;
        assert.equal(property.id, expectedProperty);
        assert.equal(canBuy, true);
        const res = await fetch(`${base}/code/submit`, {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-player-token': host.token },
          body: JSON.stringify({ gameId, playerId: host.playerId, challengeId: challenge.id, language: 'javascript', sourceCode: solutions[challenge.id] }),
        });
        assert.equal(res.status, 200, JSON.stringify(await res.clone().json()));
        assert.equal(((await res.json()) as any).allPassed, true);
      };

      await buy([1, 2], 'npm-street'); // purchase #1, turn passes to the guest
      rolls.push(2, 2); // guest lands on Income Tax and ends their turn
      const taxed = once(gs, 'landed-on-space');
      gs.emit('roll-dice', {});
      await taxed;
      const turn = once(hs, 'turn-ended');
      gs.emit('end-turn', {});
      await turn;

      await Game.updateOne({ _id: gameId, 'players.id': host.playerId }, { $set: { 'players.$.position': 39 } });
      await buy([1, 1], 'github-ave'); // purchase #2: previously failed with 409 in MongoDB

      const saved: any = await Game.findById(gameId).lean();
      assert.deepEqual(
        saved.boardState.filter((p: any) => p.ownerId === host.playerId).map((p: any) => p.id).sort(),
        ['github-ave', 'npm-street'],
      );
      assert.equal(Object.keys(saved.pendingChallenges ?? {}).length, 0);
    }, jsExecutor);
  } finally {
    dice.roll = realRoll;
    await Game.deleteMany({});
  }
});

test.after(async () => { if (mongoUp) await mongoose.disconnect(); });
