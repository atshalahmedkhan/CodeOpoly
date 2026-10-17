import test from 'node:test';
import assert from 'node:assert/strict';
import { io as connect } from 'socket.io-client';
import { expireOverdueGames } from './socketHandlers.js';
import { findGameById } from '../utils/memoryStore.js';
import { withServer, post, once, quiet, setup } from '../testing/helpers.js';

test('join-game rejects a missing or wrong token', async () => {
  await withServer(async ({ base, url }) => {
    const host = await post(`${base}/games/create`, { playerName: 'Host' });
    const s = connect(url, { transports: ['websocket'] });
    (globalThis as any).__clients.push(s);
    await once(s, 'connect');
    const err = once(s, 'error');
    s.emit('join-game', { gameId: host.gameId, playerId: host.playerId, token: 'wrong' });
    assert.match((await err).message, /Not authorised/);
  });
});

test('game state never leaks player tokens; names cannot be re-claimed', async () => {
  await withServer(async ({ base, url }) => {
    const { host, gameId } = await setup(url, base);
    const res: any = await fetch(`${base}/games/${gameId}`).then(r => r.json());
    assert.ok(res.players.every((p: any) => p.token === undefined && p.socketId === undefined));
    const again = await fetch(`${base}/games/join`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ roomCode: host.roomCode, playerName: 'host' }) });
    assert.equal(again.status, 409);
  });
});

test('players cannot act as each other and cannot roll twice', async () => {
  await withServer(async ({ base, url }) => {
    const { host, gs, hs, gameId } = await setup(url, base);
    // Guest tries to roll using the host's id in the payload: it is ignored and rejected as not their turn.
    const err = once(gs, 'error');
    gs.emit('roll-dice', { gameId, playerId: host.playerId });
    assert.match((await err).message, /Not your turn/);

    const rolled = once(hs, 'dice-rolled');
    hs.emit('roll-dice', { gameId, playerId: host.playerId });
    await rolled;
    assert.equal(findGameById(gameId)?.status, 'in-progress');
    assert.ok(findGameById(gameId)?.endsAt);
    const err2 = once(hs, 'error');
    hs.emit('roll-dice', { gameId });
    assert.match((await err2).message, /already rolled/);
  });
});

test('rent is mandatory, charged once, and validated server-side', async () => {
  await withServer(async ({ base, url }) => {
    const { host, guest, hs, gs, gameId } = await setup(url, base);
    const game: any = findGameById(gameId)!;
    const prop = game.boardState.find((p: any) => p.price > 0 && !p.isRailroad && !p.isUtility);
    prop.ownerId = guest.playerId;
    const hostP = game.players[0];
    hostP.position = prop.position;
    game.status = 'in-progress';
    game.endsAt = new Date(Date.now() + 60_000);
    game.rentDue = { playerId: host.playerId, propertyId: prop.id };
    game.hasRolled = true;

    // Not the one who owes: rejected.
    const e1 = once(gs, 'error');
    gs.emit('pay-rent', { propertyId: prop.id });
    assert.match((await e1).message, /No rent is due/);
    // Cannot skip rent by ending the turn.
    const e2 = once(hs, 'error');
    hs.emit('end-turn', {});
    assert.match((await e2).message, /Pay your rent/);

    const before = [hostP.money, game.players[1].money];
    const paid = once(hs, 'rent-paid');
    hs.emit('pay-rent', { propertyId: prop.id });
    const { amount } = await paid;
    assert.ok(amount > 0);
    assert.equal(hostP.money, before[0] - amount);
    assert.equal(game.players[1].money, before[1] + amount);
    assert.equal(game.currentTurn, guest.playerId);
    assert.equal(game.rentDue, null);

    // Replaying pay-rent does nothing.
    const e3 = once(hs, 'error');
    hs.emit('pay-rent', { propertyId: prop.id });
    assert.match((await e3).message, /No rent is due/);
  });
});

test('bankruptcy ends the game once and records the result', async () => {
  await withServer(async ({ base, url }) => {
    const { host, guest, hs, gs, gameId } = await setup(url, base);
    const game: any = findGameById(gameId)!;
    const prop = game.boardState.find((p: any) => p.price > 0 && !p.isRailroad && !p.isUtility);
    prop.ownerId = guest.playerId;
    game.players[0].money = 1;
    game.players[0].position = prop.position;
    game.status = 'in-progress';
    game.endsAt = new Date(Date.now() + 60_000);
    game.rentDue = { playerId: host.playerId, propertyId: prop.id };

    const over = once(gs, 'game-over');
    hs.emit('pay-rent', { propertyId: prop.id });
    assert.equal((await over).winnerName, 'Guest');
    assert.equal(game.status, 'finished');
    assert.ok(game.players[0].money >= 0);
    // Further actions after the end are refused and don't re-record anything.
    const e = once(hs, 'error');
    hs.emit('roll-dice', {});
    assert.match((await e).message, /over|bankrupt/i);
    assert.ok(await quiet(gs, 'game-over'));
  });
});

test('the server clock ends games that run out of time', async () => {
  await withServer(async ({ base, url, io }) => {
    const { gs, gameId } = await setup(url, base);
    const game: any = findGameById(gameId)!;
    game.status = 'in-progress';
    game.endsAt = new Date(Date.now() - 1000);
    const over = once(gs, 'game-over');
    await expireOverdueGames(io);
    assert.ok((await over).winnerName);
    assert.equal(game.status, 'finished');
  });
});

test('leaving mid-game forfeits instead of freezing the game', async () => {
  await withServer(async ({ base, url }) => {
    const { hs, gs, gameId } = await setup(url, base);
    const game: any = findGameById(gameId)!;
    game.status = 'in-progress';
    game.endsAt = new Date(Date.now() + 60_000);
    const over = once(gs, 'game-over');
    hs.emit('leave-game', {}); // host leaves on their own turn
    assert.equal((await over).winnerName, 'Guest');
    assert.equal(game.status, 'finished');
  });
});
