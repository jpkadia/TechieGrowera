import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { rateLimit } from 'express-rate-limit';
import { env } from './config/env.js';
import { contactRouter } from './routes/contact.js';
import { errorHandler } from './middleware/error.js';
import { adminRouter } from './routes/admin.js';
import { publishedRouter } from './routes/published.js';
const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'x-api-proxy-secret', 'x-client-ip'],
  }),
);
app.use('/api', (_req, res, next) => {
  res.set('Cache-Control', 'no-store');
  next();
});
// Secondary instance-local burst guard; durable per-visitor limits are enforced in MongoDB.
app.use(
  '/api/contact',
  rateLimit({
    windowMs: 60_000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    validate: { xForwardedForHeader: false },
    message: { ok: false, message: 'Too many requests. Please try again shortly.' },
  }),
);
app.use('/api/admin', express.json({ limit: '256kb', type: 'application/json' }), adminRouter);
app.use('/api/published', publishedRouter);
app.use(express.json({ limit: '16kb', type: 'application/json' }));
app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'techie-growera-api' }));
app.use('/api/contact', contactRouter);
app.use((_req, res) => res.status(404).json({ ok: false, message: 'Endpoint not found.' }));
app.use(errorHandler);
export default app;
