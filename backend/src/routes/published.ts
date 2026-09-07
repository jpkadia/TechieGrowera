import { Router } from 'express';
import { authenticateProxy } from '../middleware/security.js';
import { connectDatabase } from '../config/database.js';
import { BlogPost, CaseStudy } from '../models/index.js';
export const publishedRouter = Router();
publishedRouter.use(authenticateProxy);
publishedRouter.get('/:kind', async (req, res) => {
  if (!['blog', 'case-studies'].includes(req.params.kind))
    return res.status(404).json({ ok: false });
  await connectDatabase();
  const Model = req.params.kind === 'blog' ? BlogPost : CaseStudy;
  const items = await Model.find({ status: 'published', published: { $ne: null } })
    .select('published -_id')
    .sort({ createdAt: -1 })
    .lean();
  res.json({ ok: true, items: items.map((item) => item.published) });
});
