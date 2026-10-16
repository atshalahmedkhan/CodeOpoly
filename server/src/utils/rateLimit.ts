import type { NextFunction, Request, Response } from 'express';

// Minimal fixed-window limiter (single instance). Keyed by player token when
// present, otherwise by client IP.
export function rateLimit(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; resetAt: number }>();
  setInterval(() => {
    const now = Date.now();
    for (const [key, h] of hits) if (h.resetAt <= now) hits.delete(key);
  }, windowMs).unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const key = String(req.headers['x-player-token'] || req.ip || 'anon');
    const now = Date.now();
    const h = hits.get(key);
    if (!h || h.resetAt <= now) {
      hits.set(key, { count: 1, resetAt: now + windowMs });
      return next();
    }
    if (++h.count > max) {
      res.setHeader('Retry-After', Math.ceil((h.resetAt - now) / 1000));
      return res.status(429).json({ error: 'Too many requests. Slow down.' });
    }
    next();
  };
}
