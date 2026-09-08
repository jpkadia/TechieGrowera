import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { authenticateProxy } from '../middleware/security.js';
import { BlogPost, CaseStudy, ContactLead } from '../models/index.js';
import { AdminAuditLog, AdminSession } from '../models/admin.js';
import {
  audit,
  credentialsMatch,
  createSession,
  loginLimit,
  requireAdmin,
} from '../services/admin-auth.js';
import { revisionBody, saveBody } from '../utils/editorial-schema.js';
export const adminRouter = Router();
adminRouter.use(authenticateProxy);
adminRouter.post('/login', loginLimit, async (req, res) => {
  const parsed = z
    .object({ email: z.string().email().max(254), password: z.string().min(1).max(256) })
    .strict()
    .safeParse(req.body);
  if (!parsed.success || !(await credentialsMatch(parsed.data.email, parsed.data.password))) {
    await audit(req, 'login', 'admin', 'failure');
    return res.status(401).json({ ok: false, message: 'Email or password is incorrect.' });
  }
  await audit(req, 'login', 'admin');
  const previousToken = req.get('x-admin-session');
  if (previousToken) {
    const { digest } = await import('../services/admin-auth.js');
    await AdminSession.deleteOne({ tokenHash: digest(previousToken) });
  }
  const token = await createSession();
  return res.json({ ok: true, token, email: env.ADMIN_EMAIL });
});
adminRouter.use(requireAdmin);
adminRouter.get('/session', (_req, res) => res.json({ ok: true, email: env.ADMIN_EMAIL }));
adminRouter.post('/logout', async (req, res) => {
  await AdminSession.deleteOne({ _id: res.locals.adminSessionId });
  await audit(req, 'logout', 'session');
  res.json({ ok: true });
});
adminRouter.post('/sessions/revoke', async (req, res) => {
  await AdminSession.deleteMany({ email: env.ADMIN_EMAIL });
  await audit(req, 'revoke_sessions', 'all sessions');
  res.json({ ok: true });
});
adminRouter.get('/dashboard', async (_req, res) => {
  const [leads, newLeads, blog, cases, sessions, recent] = await Promise.all([
    ContactLead.countDocuments(),
    ContactLead.countDocuments({ status: 'new' }),
    BlogPost.countDocuments({ status: 'published' }),
    CaseStudy.countDocuments({ status: 'published' }),
    AdminSession.countDocuments({
      expiresAt: { $gt: new Date() },
      lastSeenAt: { $gt: new Date(Date.now() - 30 * 60000) },
    }),
    AdminAuditLog.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  res.json({ ok: true, leads, newLeads, blog, cases, sessions, recent });
});
function pagination(query: Record<string, unknown>) {
  return z
    .object({
      page: z.coerce.number().int().min(1).max(10000).default(1),
      status: z
        .enum(['all', 'new', 'contacted', 'closed', 'draft', 'published', 'archived'])
        .default('all'),
    })
    .strict()
    .safeParse(query);
}
adminRouter.get('/leads', async (req, res) => {
  const q = pagination(req.query);
  if (!q.success) return res.status(400).json({ ok: false, message: 'Invalid filters.' });
  const filter = q.data.status === 'all' ? {} : { status: q.data.status };
  const [items, total] = await Promise.all([
    ContactLead.find(filter)
      .sort({ createdAt: -1 })
      .skip((q.data.page - 1) * 20)
      .limit(20)
      .lean(),
    ContactLead.countDocuments(filter),
  ]);
  await audit(req, 'view_leads', `page ${q.data.page}`);
  res.json({ ok: true, items, total, page: q.data.page });
});
adminRouter.patch('/leads/:id', async (req, res) => {
  const body = z
    .object({
      status: z.enum(['new', 'contacted', 'closed']),
      previousStatus: z.enum(['new', 'contacted', 'closed']),
    })
    .strict()
    .safeParse(req.body);
  if (!body.success || !mongoose.isValidObjectId(req.params.id))
    return res.status(422).json({ ok: false, message: 'Invalid enquiry update.' });
  let updated = false;
  await mongoose.connection.transaction(async (session) => {
    const item = await ContactLead.findOneAndUpdate(
      { _id: req.params.id, status: body.data.previousStatus },
      { status: body.data.status },
      { new: true, session },
    );
    if (!item) return;
    await AdminAuditLog.create(
      [
        {
          actor: env.ADMIN_EMAIL,
          action: 'lead_status',
          target: String(item._id),
          outcome: 'success',
          detail: `${body.data.previousStatus} → ${body.data.status}`,
          expiresAt: new Date(Date.now() + 180 * 86400000),
        },
      ],
      { session },
    );
    updated = true;
  });
  return res.status(updated ? 200 : 409).json({
    ok: updated,
    message: updated ? 'Enquiry updated.' : 'This enquiry changed. Refresh and try again.',
  });
});
adminRouter.get('/logs', async (req, res) => {
  const q = pagination(req.query);
  if (!q.success) return res.status(400).json({ ok: false, message: 'Invalid page.' });
  const [items, total] = await Promise.all([
    AdminAuditLog.find()
      .sort({ createdAt: -1 })
      .skip((q.data.page - 1) * 30)
      .limit(30)
      .lean(),
    AdminAuditLog.countDocuments(),
  ]);
  res.json({ ok: true, items, total, page: q.data.page });
});
adminRouter.param('kind', (req, res, next, kind) => {
  if (!['blog', 'case-studies'].includes(kind))
    return res.status(404).json({ ok: false, message: 'Content type not found.' });
  next();
});
adminRouter.get('/content/:kind', async (req, res) => {
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  const q = pagination(req.query);
  if (!q.success) return res.status(400).json({ ok: false, message: 'Invalid filters.' });
  const filter = q.data.status === 'all' ? {} : { status: q.data.status };
  const [items, total] = await Promise.all([
    Model.find(filter)
      .select('slug status revision draft.title updatedAt everPublished')
      .sort({ updatedAt: -1 })
      .skip((q.data.page - 1) * 20)
      .limit(20)
      .lean(),
    Model.countDocuments(filter),
  ]);
  res.json({ ok: true, items, total, page: q.data.page });
});
adminRouter.get('/content/:kind/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ ok: false, message: 'Content not found.' });
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  const item = await Model.findById(req.params.id).lean();
  return res
    .status(item ? 200 : 404)
    .json({ ok: !!item, item, message: item ? undefined : 'Content not found.' });
});
adminRouter.post('/content/:kind', async (req, res) => {
  const body = saveBody(String(req.params.kind)).safeParse(req.body);
  if (!body.success)
    return res.status(422).json({
      ok: false,
      message: body.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    });
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  try {
    let id = '';
    await mongoose.connection.transaction(async (session) => {
      const [item] = await Model.create(
        [
          {
            slug: body.data.draft.slug,
            title: body.data.draft.title,
            projectName: body.data.draft.title,
            draft: body.data.draft,
            revision: 1,
            status: 'draft',
          },
        ],
        { session },
      );
      id = String(item._id);
      await AdminAuditLog.create(
        [
          {
            actor: env.ADMIN_EMAIL,
            action: 'create_draft',
            target: `${req.params.kind}/${id}`,
            outcome: 'success',
            expiresAt: new Date(Date.now() + 180 * 86400000),
          },
        ],
        { session },
      );
    });
    return res.status(201).json({ ok: true, id });
  } catch (error) {
    if ((error as { code?: number }).code === 11000)
      return res.status(409).json({ ok: false, message: 'That URL slug is already in use.' });
    throw error;
  }
});
adminRouter.put('/content/:kind/:id', async (req, res) => {
  const body = saveBody(String(req.params.kind)).safeParse(req.body);
  if (!body.success || !body.data.revision || !mongoose.isValidObjectId(req.params.id))
    return res.status(422).json({
      ok: false,
      message: body.success
        ? 'Invalid revision.'
        : body.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    });
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  try {
    let result: Record<string, unknown> | null = null;
    await mongoose.connection.transaction(async (session) => {
      const current = await Model.findById(req.params.id).session(session);
      if (!current || current.revision !== body.data.revision) return;
      if (current.everPublished && current.slug !== body.data.draft.slug)
        throw Object.assign(new Error('Published URLs are locked to preserve existing links.'), {
          status: 422,
          publicMessage: 'Published URLs are locked. Keep the existing slug.',
        });
      current.draft = body.data.draft;
      current.slug = body.data.draft.slug;
      current.revision += 1;
      await current.save({ session });
      await AdminAuditLog.create(
        [
          {
            actor: env.ADMIN_EMAIL,
            action: 'save_draft',
            target: `${req.params.kind}/${current._id}`,
            outcome: 'success',
            detail: `Revision ${current.revision}`,
            expiresAt: new Date(Date.now() + 180 * 86400000),
          },
        ],
        { session },
      );
      result = current.toObject();
    });
    return res.status(result ? 200 : 409).json({
      ok: !!result,
      item: result,
      message: result
        ? 'Draft saved. Live content is unchanged.'
        : 'Another edit was saved. Reload before editing.',
    });
  } catch (error) {
    if ((error as { code?: number }).code === 11000)
      return res.status(409).json({ ok: false, message: 'That URL slug is already in use.' });
    throw error;
  }
});
adminRouter.post('/content/:kind/:id/:action', async (req, res) => {
  if (!['publish', 'archive', 'restore'].includes(String(req.params.action)))
    return res.status(404).json({ ok: false, message: 'Action not found.' });
  const body = revisionBody.safeParse(req.body);
  if (!body.success || !mongoose.isValidObjectId(req.params.id))
    return res.status(422).json({ ok: false, message: 'Invalid revision.' });
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  let updated = false;
  await mongoose.connection.transaction(async (session) => {
    const item = await Model.findById(req.params.id).session(session);
    if (!item || item.revision !== body.data.revision) return;
    if (req.params.action === 'publish') {
      const validated = saveBody(String(req.params.kind)).safeParse({ draft: item.draft });
      if (!validated.success)
        throw Object.assign(new Error('Invalid draft'), {
          status: 422,
          publicMessage: 'Complete the required content and SEO fields before publishing.',
        });
      const date = new Date().toISOString().slice(0, 10);
      const base = `/${req.params.kind}/${item.slug}`;
      const unchanged =
        item.published &&
        Object.entries(validated.data.draft).every(
          ([key, value]) => JSON.stringify(value) === JSON.stringify(item.published[key]),
        );
      item.published = {
        ...validated.data.draft,
        updatedAt: unchanged ? item.published.updatedAt : date,
        ...(req.params.kind === 'blog'
          ? {
              publishedAt: item.published?.publishedAt || date,
              canonicalPath: base,
              ogImage: `${base}/opengraph-image`,
            }
          : {}),
      };
      item.status = 'published';
      item.everPublished = true;
    } else item.status = req.params.action === 'archive' ? 'archived' : 'draft';
    item.revision += 1;
    await item.save({ session });
    await AdminAuditLog.create(
      [
        {
          actor: env.ADMIN_EMAIL,
          action: String(req.params.action),
          target: `${req.params.kind}/${item._id}`,
          outcome: 'success',
          detail: `Revision ${item.revision}`,
          expiresAt: new Date(Date.now() + 180 * 86400000),
        },
      ],
      { session },
    );
    updated = true;
  });
  return res.status(updated ? 200 : 409).json({
    ok: updated,
    message: updated ? 'Content status updated.' : 'Content changed. Reload and try again.',
  });
});
