import { Router } from 'express';
import { z } from 'zod';
import { authenticateProxy } from '../middleware/security.js';
import { connectDatabase } from '../config/database.js';
import { VisitorLog } from '../models/index.js';
import { parseUserAgent, isBot } from '../utils/user-agent.js';

export const analyticsRouter = Router();

const visitSchema = z.object({
  visitorId: z.string().trim().min(1).max(100),
  sessionId: z.string().trim().max(100).optional().default(''),
  path: z.string().trim().min(1).max(500),
  referrer: z.string().trim().max(1000).optional().default(''),
});

analyticsRouter.post('/visit', authenticateProxy, async (req, res) => {
  const ua = (req.get('user-agent') || '').slice(0, 500);

  // Skip search bots & crawlers so they don't pollute analytics
  if (isBot(ua)) {
    return res.json({ ok: true, skipped: 'bot' });
  }

  const parseResult = visitSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ ok: false, message: 'Invalid payload.' });
  }

  const { visitorId, sessionId, path, referrer } = parseResult.data;
  const ip = req.get('x-client-ip') || '';
  const { os, browser, device } = parseUserAgent(ua);

  try {
    await connectDatabase();
    await VisitorLog.findOneAndUpdate(
      { visitorId },
      {
        $setOnInsert: { visitorId, ip, os, browser, device, firstSeenAt: new Date() },
        $set: {
          lastSeenAt: new Date(),
          ...(sessionId ? { sessionId } : {}),
        },
        $push: {
          pages: {
            $each: [{ path, referrer, timestamp: new Date() }],
            $slice: -30, // Cap at last 30 pages to prevent document bloat
          },
        },
      },
      { upsert: true }
    );
    return res.json({ ok: true });
  } catch (err) {
    console.warn('[Analytics] Failed to record visit:', err instanceof Error ? err.message : err);
    // Return 200 OK so visitor UX is never broken
    return res.json({ ok: false, error: 'Database unavailable' });
  }
});
