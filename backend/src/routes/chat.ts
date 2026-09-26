import { Router } from 'express';
import { z } from 'zod';
import { randomUUID } from 'node:crypto';
import { rateLimit } from 'express-rate-limit';
import { authenticateProxy } from '../middleware/security.js';
import { connectDatabase } from '../config/database.js';
import { ChatSession, VisitorLog, type IChatSession, type IChatMessage } from '../models/index.js';
import { preFilterQuery } from '../ai/filter.js';
import { generateChatReply } from '../services/gemini-chat.js';
import { parseUserAgent } from '../utils/user-agent.js';

export const chatRouter = Router();

// Chatbot-specific rate limit (30 requests per minute per client IP)
const chatLimiter = rateLimit({
  windowMs: 60_000,
  limit: 30,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  validate: { xForwardedForHeader: false },
  message: {
    ok: false,
    message: 'You are sending messages too quickly. Please wait a moment before sending another message.',
  },
});

const chatRequestSchema = z.object({
  message: z
    .string()
    .trim()
    .min(1, 'Message cannot be empty.')
    .max(500, 'Message cannot exceed 500 characters.'),
  sessionId: z.string().trim().max(100).optional(),
  history: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().trim().min(1).max(1000),
      })
    )
    .max(6)
    .optional()
    .default([]),
  clientOs: z.string().trim().max(100).optional(),
  clientBrowser: z.string().trim().max(100).optional(),
  clientDevice: z.string().trim().max(50).optional(),
});

// GET /api/chat/history?sessionId=... (fetch history for returning visitor)
chatRouter.get('/history', authenticateProxy, async (req, res) => {
  const sessionId = String(req.query.sessionId || '').trim();
  if (!sessionId || sessionId.length > 100) {
    return res.json({ ok: true, messages: [] });
  }

  try {
    await connectDatabase();
    const session = (await ChatSession.findOne({ sessionId }).lean()) as IChatSession | null;
    if (!session || !Array.isArray(session.messages)) {
      return res.json({ ok: true, messages: [] });
    }

    const safeMessages = session.messages.map((m: IChatMessage) => ({
      role: m.role,
      content: m.content,
      timestamp: m.timestamp,
    }));

    return res.json({ ok: true, messages: safeMessages });
  } catch (err) {
    console.warn('[ChatRouter] Failed to fetch session history:', err instanceof Error ? err.message : err);
    return res.json({ ok: true, messages: [] });
  }
});

// POST /api/chat (send message & persist conversation)
chatRouter.post('/', authenticateProxy, chatLimiter, async (req, res) => {
  const parseResult = chatRequestSchema.safeParse(req.body);
  if (!parseResult.success) {
    const issue = parseResult.error.issues[0]?.message || 'Invalid request.';
    return res.status(400).json({ ok: false, message: issue });
  }

  const { message, history } = parseResult.data;
  const sessionId = parseResult.data.sessionId?.trim() || randomUUID();

  // 1. Application-level pre-filter for instant rejection of obviously unrelated prompts
  const filter = preFilterQuery(message);
  let reply = '';

  if (filter.rejected && filter.reply) {
    reply = filter.reply;
  } else {
    // 2. Query Gemini with retrieved website knowledge
    try {
      reply = await generateChatReply(message, history);
    } catch (error) {
      console.error('[ChatRouter] Unhandled error during chat processing:', error instanceof Error ? error.message : error);
      return res.status(500).json({
        ok: false,
        message: 'Sorry, I am having trouble responding right now. Please try again in a moment.',
      });
    }
  }

  // 3. Asynchronously persist conversation in MongoDB
  try {
    await connectDatabase();
    const ip = req.get('x-client-ip') || '';
    const userAgent = (req.get('user-agent') || '').slice(0, 500);
    const platformVer = (req.get('sec-ch-ua-platform-version') || '').slice(0, 50);
    const clientOs = (req.get('x-client-os') || parseResult.data.clientOs || '').slice(0, 50);
    const clientBrowser = (req.get('x-client-browser') || parseResult.data.clientBrowser || '').slice(0, 50);
    const clientDevice = (req.get('x-client-device') || parseResult.data.clientDevice || '').slice(0, 50);

    const { os, browser, device } = parseUserAgent(userAgent, platformVer, {
      os: clientOs,
      browser: clientBrowser,
      device: clientDevice,
    });

    const now = new Date();
    const userMsg = { role: 'user' as const, content: message, timestamp: now };
    const botMsg = { role: 'assistant' as const, content: reply, timestamp: new Date(now.getTime() + 100) };

    await ChatSession.findOneAndUpdate(
      { sessionId },
      {
        $setOnInsert: {
          sessionId,
          createdAt: now,
        },
        $set: {
          lastActiveAt: now,
          ip: ip || 'Unknown',
          userAgent: userAgent || '',
          os: os && os !== 'Unknown OS' ? os : 'Unknown OS',
          browser: browser && browser !== 'Unknown Browser' ? browser : 'Unknown Browser',
          device: device || 'Desktop',
        },
        $push: {
          messages: {
            $each: [userMsg, botMsg],
            $slice: -50, // Keep last 50 messages per session
          },
        },
      },
      { upsert: true, new: true }
    );

    // Link session to any recent visitor log with matching IP if not already linked
    if (ip) {
      await VisitorLog.updateOne(
        { ip, sessionId: { $in: ['', null] } },
        { $set: { sessionId } }
      ).catch(() => {});
    }
  } catch (dbErr) {
    console.error('[ChatRouter] Failed to persist chat session:', dbErr instanceof Error ? dbErr.stack || dbErr.message : dbErr);
  }

  return res.json({ ok: true, reply, sessionId });
});
