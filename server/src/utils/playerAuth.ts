import { randomBytes, randomUUID, timingSafeEqual } from 'node:crypto';

export const newPlayerId = () => `player-${randomUUID()}`;
export const newPlayerToken = () => randomBytes(24).toString('hex');

export function tokenMatches(expected: unknown, provided: unknown): boolean {
  if (typeof expected !== 'string' || typeof provided !== 'string' || !expected) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(provided);
  return a.length === b.length && timingSafeEqual(a, b);
}

// Players carry a secret token and socket id that must never leave the server.
export function publicPlayers(players: any[] = []) {
  return players.map((p) => {
    const plain = typeof p?.toObject === 'function' ? p.toObject() : { ...p };
    delete plain.token;
    delete plain.socketId;
    return plain;
  });
}
