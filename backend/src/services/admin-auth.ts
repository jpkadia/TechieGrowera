import { createHash, createHmac, randomBytes, scrypt, timingSafeEqual } from 'node:crypto';
import type { Request, Response, NextFunction } from 'express';
import { isIP } from 'node:net';
import { env } from '../config/env.js';
import { connectDatabase } from '../config/database.js';
import { AdminAuditLog, AdminSession } from '../models/admin.js';
import { RateBucket } from '../models/index.js';
export const digest = (value: string) => createHash('sha256').update(value).digest('hex');
export const configured = () =>
  !!env.ADMIN_EMAIL && env.ADMIN_PASSWORD.length >= 12 && env.ADMIN_SESSION_SECRET.length >= 32;
export const credentialVersion = () =>
  createHmac('sha256', env.ADMIN_SESSION_SECRET)
    .update(`${env.ADMIN_EMAIL}\0${env.ADMIN_PASSWORD}`)
    .digest('hex');
const derive = (password: string) => new Promise<Buffer>((resolve,reject) => scrypt(password,env.ADMIN_SESSION_SECRET,64,(error,key) => error ? reject(error) : resolve(key)));
let expectedHash: Promise<Buffer> | undefined;
export async function credentialsMatch(email: string, password: string) {
  expectedHash ||= derive(env.ADMIN_PASSWORD);
  const [expected,submitted] = await Promise.all([expectedHash,derive(password)]);
  const emailMatch = timingSafeEqual(
    Buffer.from(digest(email.toLowerCase())),
    Buffer.from(digest(env.ADMIN_EMAIL.toLowerCase())),
  );
  return timingSafeEqual(expected, submitted) && emailMatch;
}
export function ipHash(req: Request) {
  return createHmac('sha256', env.RATE_LIMIT_SALT)
    .update(req.get('x-client-ip') || 'unknown')
    .digest('hex');
}
export async function audit(
  req: Request,
  action: string,
  target: string,
  outcome: 'success' | 'failure' = 'success',
  detail = '',
) {
  return AdminAuditLog.create({
    actor: outcome === 'failure' && action === 'login' ? 'unverified' : env.ADMIN_EMAIL,
    action,
    target,
    outcome,
    ipHash: ipHash(req),
    detail,
    expiresAt: new Date(Date.now() + 180 * 86400000),
  });
}
export async function loginLimit(req: Request, res: Response, next: NextFunction) {
  try {
    if (!configured())
      return res.status(503).json({ ok: false, message: 'Admin login is not configured.' });
    if (!isIP(req.get('x-client-ip') || ''))
      return res.status(400).json({ ok: false, message: 'Invalid request.' });
    await connectDatabase();
    const window = 15 * 60000;
    const bucket = Math.floor(Date.now() / window);
    const id = `admin-login:${ipHash(req)}:${bucket}`;
    let entry;
    try {
      entry = await RateBucket.findOneAndUpdate(
        { _id: id },
        { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * window) } },
        { upsert: true, new: true },
      );
    } catch (error) {
      if ((error as { code?: number }).code !== 11000) throw error;
      entry = await RateBucket.findOneAndUpdate({ _id: id }, { $inc: { count: 1 } }, { new: true });
    }
    if (!entry || entry.count > 5) {
      res.set('Retry-After', String(Math.ceil(((bucket + 1) * window - Date.now()) / 1000)));
      return res
        .status(429)
        .json({ ok: false, message: 'Too many login attempts. Try again in 15 minutes.' });
    }
    next();
  } catch (error) {
    next(error);
  }
}
export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    if (!configured())
      return res.status(503).json({ ok: false, message: 'Admin login is not configured.' });
    const token = req.get('x-admin-session') || '';
    if (!/^[a-f0-9]{64}$/.test(token))
      return res.status(401).json({ ok: false, message: 'Please sign in to continue.' });
    await connectDatabase();
    const session = await AdminSession.findOneAndUpdate(
      {
        tokenHash: digest(token),
        credentialVersion: credentialVersion(),
        expiresAt: { $gt: new Date() },
        lastSeenAt: { $gt: new Date(Date.now() - 30 * 60000) },
      },
      { $set: { lastSeenAt: new Date() } },
      { new: true },
    );
    if (!session)
      return res
        .status(401)
        .json({ ok: false, message: 'Your session expired. Please sign in again.' });
    res.locals.adminSessionId = session._id;
    next();
  } catch (error) {
    next(error);
  }
}
export async function createSession() {
  const token = randomBytes(32).toString('hex');
  await AdminSession.create({
    tokenHash: digest(token),
    email: env.ADMIN_EMAIL,
    credentialVersion: credentialVersion(),
    expiresAt: new Date(Date.now() + 8 * 3600000),
    lastSeenAt: new Date(),
  });
  return token;
}
