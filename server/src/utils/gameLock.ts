// Per-game async mutex: serialises read-modify-write cycles so concurrent
// events (double-clicks, replayed submissions) cannot interleave on one game.
const tails = new Map<string, Promise<unknown>>();

export function withGameLock<T>(gameId: string, fn: () => Promise<T>): Promise<T> {
  const prev = tails.get(gameId) ?? Promise.resolve();
  const run = prev.then(fn, fn);
  const tail = run.catch(() => undefined);
  tails.set(gameId, tail);
  tail.then(() => {
    if (tails.get(gameId) === tail) tails.delete(gameId);
  });
  return run;
}
