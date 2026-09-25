import { Router } from 'express';
import { authenticateProxy } from '../middleware/security.js';
import { connectDatabase } from '../config/database.js';
import { BlogPost, PortfolioItem } from '../models/index.js';

export const publishedRouter = Router();
publishedRouter.use(authenticateProxy);

publishedRouter.get('/:kind', async (req, res) => {
  if (!['blog', 'portfolio'].includes(req.params.kind))
    return res.status(404).json({ ok: false });
  await connectDatabase();
  const Model = req.params.kind === 'blog' ? BlogPost : PortfolioItem;
  const items = await Model.find({
    status: 'published',
  })
    .sort({ createdAt: -1 })
    .lean();
  const publishedItems = items
    .map((item: any) => item.published || item)
    .filter((item: any) => item && (item.slug || item.title));
  res.json({ ok: true, items: publishedItems });
});
