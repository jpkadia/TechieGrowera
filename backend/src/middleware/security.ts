import type { Request, Response, NextFunction } from 'express';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { isIP } from 'node:net';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { RateBucket } from '../models/index.js';
export function authenticateProxy(req: Request, res: Response, next: NextFunction) {
  const given = req.get('x-api-proxy-secret') || '';
  if (!env.API_PROXY_SECRET)
    return res
      .status(503)
      .json({
        ok: false,
        message: 'Enquiries are temporarily unavailable. Please try again later.',
      });
  const a = Buffer.from(given);
  const b = Buffer.from(env.API_PROXY_SECRET);
  if (a.length !== b.length || !timingSafeEqual(a, b))
    return res.status(401).json({ ok: false, message: 'Unauthorized request.' });
  next();
}
export async function persistentRateLimit(req: Request, res: Response, next: NextFunction) {
  try {
    const ip = req.get('x-client-ip') || '';
    if (!isIP(ip))
      return res.status(400).json({ ok: false, message: 'Unable to validate this request.' });
    if (env.RATE_LIMIT_SALT.length < 32)
      return res.status(503).json({ ok: false, message: 'Enquiries are temporarily unavailable.' });
    await connectDatabase();
    const windowMs = 15 * 60 * 1000;
    const bucket = Math.floor(Date.now() / windowMs);
    const digest = createHmac('sha256', env.RATE_LIMIT_SALT).update(ip).digest('hex');
    const key = `${digest}:${bucket}`;
    // An upsert race can only hit the unique _id; retry that increment once.
    let entry;
    try {
      entry = await RateBucket.findOneAndUpdate(
        { _id: key },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * windowMs) } },
        { upsert: true, new: true },
      );
    } catch (error) {
      if ((error as { code?: number }).code !== 11000) throw error;
      entry = await RateBucket.findOneAndUpdate(
        { _id: key },
        { $inc: { count: 1 } },
        { new: true },
      );
    }
    if (!entry || entry.count > 5) {
      res.set('Retry-After', String(Math.ceil(((bucket + 1) * windowMs - Date.now()) / 1000)));
      return res
        .status(429)
        .json({ ok: false, message: 'Too many enquiries. Please try again in 15 minutes.' });
    }
    next();
  } catch (error) {
    next(error);
  }
}
