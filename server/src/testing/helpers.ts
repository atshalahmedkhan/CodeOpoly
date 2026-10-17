import express from 'express';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { io as connect, type Socket as ClientSocket } from 'socket.io-client';
import gameRoutes from '../routes/gameRoutes.js';
import { createCodeRoutes } from '../routes/codeRoutes.js';
import type { Executor } from '../code/executor.js';
import { setupSocketHandlers } from '../socket/socketHandlers.js';

export async function withServer(fn: (ctx: { base: string; url: string; io: Server }) => Promise<void>, executor?: Executor) {
  const app = express();
  app.use(express.json());
  app.use('/api', gameRoutes);
  const http = createServer(app);
  const io = new Server(http);
  app.use('/api/code', createCodeRoutes(io, executor));
  io.on('connection', socket => setupSocketHandlers(io, socket));
  await new Promise<void>(r => http.listen(0, '127.0.0.1', r));
  const port = (http.address() as any).port;
  const clients: ClientSocket[] = [];
  (globalThis as any).__clients = clients;
  try {
    await fn({ base: `http://127.0.0.1:${port}/api`, url: `http://127.0.0.1:${port}`, io });
  } finally {
    clients.forEach(c => c.close());
    io.close();
    await new Promise<void>(r => http.close(() => r()));
  }
}

export const post = (url: string, body: unknown) =>
  fetch(url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).then(r => r.json() as Promise<any>);

export function once<T = any>(socket: ClientSocket, event: string, ms = 1500): Promise<T> {
  return new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout waiting for ${event}`)), ms);
    socket.once(event, (data: T) => { clearTimeout(t); resolve(data); });
  });
}
export const quiet = (socket: ClientSocket, event: string, ms = 150) =>
  new Promise<boolean>(resolve => {
    const t = setTimeout(() => resolve(true), ms);
    socket.once(event, () => { clearTimeout(t); resolve(false); });
  });

export async function setup(url: string, base: string) {
  const host = await post(`${base}/games/create`, { playerName: 'Host' });
  const guest = await post(`${base}/games/join`, { roomCode: host.roomCode, playerName: 'Guest' });
  const open = async (who: any) => {
    const s = connect(url, { transports: ['websocket'] });
    (globalThis as any).__clients.push(s);
    await once(s, 'connect');
    const joined = once(s, 'joined-game');
    s.emit('join-game', { gameId: who.gameId, playerId: who.playerId, token: who.token });
    await joined;
    return s;
  };
  return { host, guest, hs: await open(host), gs: await open(guest), gameId: host.gameId as string };
}

