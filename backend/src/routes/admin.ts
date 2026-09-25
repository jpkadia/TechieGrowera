import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { authenticateProxy } from '../middleware/security.js';
import { BlogPost, PortfolioItem, ContactLead, ChatSession, VisitorLog } from '../models/index.js';
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
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const [leads, newLeads, blog, portfolio, sessions, recent, chats, visitors] = await Promise.all([
    ContactLead.countDocuments(),
    ContactLead.countDocuments({ status: 'new' }),
    BlogPost.countDocuments({ status: 'published' }),
    PortfolioItem.countDocuments({ status: 'published' }),
    AdminSession.countDocuments({
      expiresAt: { $gt: new Date() },
      lastSeenAt: { $gt: new Date(Date.now() - 30 * 60000) },
    }),
    AdminAuditLog.find({ createdAt: { $gte: cutoff } }).sort({ createdAt: -1 }).limit(8).lean(),
    ChatSession.countDocuments({ lastActiveAt: { $gte: cutoff } }),
    VisitorLog.countDocuments({ lastSeenAt: { $gte: cutoff } }),
  ]);
  res.json({ ok: true, leads, newLeads, blog, portfolio, cases: portfolio, sessions, recent, chats, visitors });
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
      .skip((q.data.page - 1) * 10)
      .limit(10)
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
          expiresAt: new Date(Date.now() + 60 * 86400000),
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
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const filter = { createdAt: { $gte: cutoff } };
  const [items, total] = await Promise.all([
    AdminAuditLog.find(filter)
      .sort({ createdAt: -1 })
      .skip((q.data.page - 1) * 10)
      .limit(10)
      .lean(),
    AdminAuditLog.countDocuments(filter),
  ]);
  res.json({ ok: true, items, total, page: q.data.page });
});
adminRouter.param('kind', (req, res, next, kind) => {
  if (!['blog', 'portfolio'].includes(kind))
    return res.status(404).json({ ok: false, message: 'Content type not found.' });
  next();
});
adminRouter.get('/content/:kind', async (req, res) => {
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
  const q = pagination(req.query);
  if (!q.success) return res.status(400).json({ ok: false, message: 'Invalid filters.' });
  const filter = q.data.status === 'all' ? {} : { status: q.data.status };
  const [items, total] = await Promise.all([
    Model.find(filter)
      .select('slug status revision draft title projectName updatedAt everPublished published')
      .sort({ updatedAt: -1 })
      .skip((q.data.page - 1) * 10)
      .limit(10)
      .lean(),
    Model.countDocuments(filter),
  ]);
  const formattedItems = items.map((item: any) => ({
    ...item,
    draft: item.draft || {
      title: item.title || item.projectName || item.published?.title || item.slug,
      slug: item.slug,
    },
  }));
  res.json({ ok: true, items: formattedItems, total, page: q.data.page });
});
adminRouter.get('/content/:kind/:id', async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id))
    return res.status(404).json({ ok: false, message: 'Content not found.' });
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
  const item = await Model.findById(req.params.id).lean();
  if (!item) return res.status(404).json({ ok: false, message: 'Content not found.' });
  const normalizedItem = {
    ...item,
    draft: (item as any).draft || (item as any).published || item,
  };
  return res.status(200).json({ ok: true, item: normalizedItem });
});
adminRouter.post('/content/:kind', async (req, res) => {
  const body = saveBody(String(req.params.kind)).safeParse(req.body);
  if (!body.success)
    return res.status(422).json({
      ok: false,
      message: body.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '),
    });
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
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
            expiresAt: new Date(Date.now() + 60 * 86400000),
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
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
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
            expiresAt: new Date(Date.now() + 60 * 86400000),
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
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
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
          expiresAt: new Date(Date.now() + 60 * 86400000),
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

// Admin: List all chat sessions (filtered to 60 days, paginated to 10 per page)
adminRouter.get('/chats', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = 10;
  const skip = (page - 1) * limit;
  const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
  const filter = { lastActiveAt: { $gte: cutoff } };

  const [total, sessions] = await Promise.all([
    ChatSession.countDocuments(filter),
    ChatSession.find(filter)
      .sort({ lastActiveAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('_id sessionId ip os browser device lastActiveAt createdAt messages')
      .lean(),
  ]);

  const items = sessions.map((s) => ({
    _id: s._id,
    sessionId: s.sessionId,
    ip: s.ip || 'Unknown',
    os: s.os || 'Unknown',
    browser: s.browser || 'Unknown',
    device: s.device || 'Desktop',
    messageCount: s.messages?.length || 0,
    lastMessage: s.messages?.[s.messages.length - 1]?.content?.slice(0, 120) || '',
    lastActiveAt: s.lastActiveAt,
    createdAt: s.createdAt,
  }));

  res.json({
    ok: true,
    sessions: items,
    total,
    page,
    pages: Math.ceil(total / limit) || 1,
  });
});

// Admin: Get single chat session with full transcript
adminRouter.get('/chats/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ ok: false, message: 'Invalid ID.' });
  }
  const session = await ChatSession.findById(req.params.id).lean();
  if (!session) {
    return res.status(404).json({ ok: false, message: 'Conversation not found.' });
  }
  res.json({ ok: true, session });
});

// Admin: Delete chat session from database permanently
adminRouter.delete('/chats/:id', async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ ok: false, message: 'Invalid ID.' });
  }
  const deleted = await ChatSession.findByIdAndDelete(req.params.id);
  if (!deleted) {
    return res.status(404).json({ ok: false, message: 'Conversation not found.' });
  }
  await audit(req, 'delete_chat', `chat/${req.params.id}`);
  res.json({ ok: true, message: 'Conversation deleted successfully.' });
});

// Admin: Aggregated visitor traffic analytics (full 60-day retention with range filters)
adminRouter.get('/analytics', async (req, res) => {
  const page = Math.max(1, parseInt(String(req.query.page || '1'), 10));
  const limit = Math.min(100, Math.max(5, parseInt(String(req.query.limit || '15'), 10)));
  const range = String(req.query.range || 'all');
  const skip = (page - 1) * limit;

  // Base 60-day auto-retention policy cutoff
  const retentionCutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

  // Time range calculation
  let rangeCutoff = retentionCutoff;
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (range === 'today') {
    rangeCutoff = startOfToday;
  } else if (range === '7d') {
    rangeCutoff = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  } else if (range === '30d') {
    rangeCutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  }

  const filter = { lastSeenAt: { $gte: rangeCutoff } };
  const allTimeFilter = { lastSeenAt: { $gte: retentionCutoff } };
  const todayFilter = { lastSeenAt: { $gte: startOfToday } };

  const [
    totalVisitors,
    allTimeVisitors,
    todayVisitors,
    totalChats,
    allTimeChats,
    visitorsList,
    osStats,
    browserStats,
    deviceStats,
    pageviewsAgg,
  ] = await Promise.all([
    VisitorLog.countDocuments(filter),
    VisitorLog.countDocuments(allTimeFilter),
    VisitorLog.countDocuments(todayFilter),
    ChatSession.countDocuments({ lastActiveAt: { $gte: rangeCutoff } }),
    ChatSession.countDocuments({ lastActiveAt: { $gte: retentionCutoff } }),
    VisitorLog.find(filter).sort({ lastSeenAt: -1 }).skip(skip).limit(limit).lean(),
    VisitorLog.aggregate([
      { $match: filter },
      { $group: { _id: '$os', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    VisitorLog.aggregate([
      { $match: filter },
      { $group: { _id: '$browser', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    VisitorLog.aggregate([
      { $match: filter },
      { $group: { _id: '$device', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 6 },
    ]),
    VisitorLog.aggregate([
      { $match: filter },
      { $project: { pageCount: { $size: '$pages' } } },
      { $group: { _id: null, total: { $sum: '$pageCount' } } },
    ]),
  ]);

  const totalPageViews = pageviewsAgg[0]?.total || 0;

  const formattedVisitors = visitorsList.map((v) => ({
    _id: v._id,
    visitorId: v.visitorId,
    sessionId: v.sessionId || null,
    ip: v.ip || 'Unknown',
    os: v.os || 'Unknown',
    browser: v.browser || 'Unknown',
    device: v.device || 'Desktop',
    pagesVisited: v.pages?.map((p: { path: string }) => p.path) || [],
    pageCount: v.pages?.length || 0,
    firstSeenAt: v.firstSeenAt,
    lastSeenAt: v.lastSeenAt,
  }));

  res.json({
    ok: true,
    range,
    stats: {
      totalVisitors,
      allTimeVisitors,
      todayVisitors,
      totalPageViews,
      totalChats,
      allTimeChats,
      osBreakdown: osStats.map((item) => ({ name: item._id || 'Unknown', count: item.count })),
      browserBreakdown: browserStats.map((item) => ({ name: item._id || 'Unknown', count: item.count })),
      deviceBreakdown: deviceStats.map((item) => ({ name: item._id || 'Unknown', count: item.count })),
    },
    visitors: formattedVisitors,
    recentVisitors: formattedVisitors, // backward compatibility
    total: totalVisitors,
    page,
    pages: Math.ceil(totalVisitors / limit) || 1,
    limit,
  });
});

