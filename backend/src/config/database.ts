import mongoose from 'mongoose';
import { env } from './env.js';
import { defaultPortfolioSeed } from '../models/seed-data.js';

let connection: Promise<typeof mongoose> | null = null;

async function seedInitialPortfolio() {
  try {
    const { PortfolioItem } = await import('../models/index.js');
    const db = mongoose.connection.db;
    if (db) {
      try {
        const collections = await db.listCollections({ name: 'casestudies' }).toArray();
        if (collections.length > 0) {
          const legacyDocs = await db.collection('casestudies').find({}).toArray();
          for (const doc of legacyDocs) {
            const exists = await PortfolioItem.findOne({ slug: doc.slug });
            if (!exists) {
              await PortfolioItem.create({
                slug: doc.slug,
                projectName: doc.title || doc.projectName,
                title: doc.title || doc.projectName,
                client: doc.client,
                industry: doc.industry,
                demo: doc.demo,
                status: doc.status || 'published',
                draft: doc.draft || doc,
                published: doc.published || doc,
                everPublished: true,
                revision: doc.revision || 1,
              });
              console.log(`[DB] Migrated project to portfolio: ${doc.slug}`);
            }
          }
        }
      } catch {
        // Ignore legacy migration error if not found
      }
    }

    for (const item of defaultPortfolioSeed) {
      const existing = await PortfolioItem.findOne({ slug: item.slug });
      if (!existing) {
        await PortfolioItem.create({
          slug: item.slug,
          projectName: item.title,
          title: item.title,
          client: item.client,
          industry: item.industry,
          demo: item.demo,
          status: 'published',
          draft: item,
          published: { ...item, updatedAt: '2026-09-21' },
          everPublished: true,
          revision: 1,
        });
        console.log(`[DB] Verified/Seeded project into portfolio: ${item.slug}`);
      }
    }
  } catch (err) {
    console.warn('[DB] Portfolio seed check deferred:', (err as Error).message);
  }
}

async function ensure60DayRetention() {
  try {
    const db = mongoose.connection.db;
    if (!db) return;
    const cutoff = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);

    // 1. Visitor logs
    try {
      await db.collection('visitor_logs').deleteMany({ lastSeenAt: { $lt: cutoff } });
      const visitorIndexes = await db.collection('visitor_logs').indexes();
      const oldVisitorTTL = visitorIndexes.find((idx) => idx.name === 'lastSeenAt_1');
      if (oldVisitorTTL && oldVisitorTTL.expireAfterSeconds !== 60 * 24 * 60 * 60) {
        await db.collection('visitor_logs').dropIndex('lastSeenAt_1');
        console.log('[DB] Dropped old visitor index lastSeenAt_1');
      }
      await db.collection('visitor_logs').createIndex(
        { lastSeenAt: 1 },
        { expireAfterSeconds: 60 * 24 * 60 * 60, background: true }
      );
    } catch (e) {
      console.warn('[DB] Visitor index update error:', (e as Error).message);
    }

    // 2. Chat sessions
    try {
      await db.collection('chat_sessions').deleteMany({ lastActiveAt: { $lt: cutoff } });
      const chatIndexes = await db.collection('chat_sessions').indexes();
      const oldChat = chatIndexes.find((idx) => idx.name === 'lastActiveAt_1');
      if (oldChat && oldChat.expireAfterSeconds !== 60 * 24 * 60 * 60) {
        await db.collection('chat_sessions').dropIndex('lastActiveAt_1');
        console.log('[DB] Dropped old chat index lastActiveAt_1');
      }
      await db.collection('chat_sessions').createIndex(
        { lastActiveAt: 1 },
        { expireAfterSeconds: 60 * 24 * 60 * 60, background: true }
      );
    } catch (e) {
      console.warn('[DB] Chat index update error:', (e as Error).message);
    }

    // 3. Activity / Audit logs
    try {
      const collections = await db.listCollections().toArray();
      const auditCol = collections.find((c) => c.name.toLowerCase().includes('audit'));
      if (auditCol) {
        await db.collection(auditCol.name).deleteMany({ createdAt: { $lt: cutoff } });
      }
    } catch {
      // ignore
    }
  } catch (err) {
    console.warn('[DB] 60-day retention check deferred:', (err as Error).message);
  }
}

export async function connectDatabase() {
  if (!env.MONGODB_URI)
    throw Object.assign(
      new Error('Enquiries are temporarily unavailable. Please try again later.'),
      { status: 503 },
    );
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connection)
    connection = mongoose
      .connect(env.MONGODB_URI, {
        maxPoolSize: 5,
        serverSelectionTimeoutMS: 20000,
        connectTimeoutMS: 20000,
        autoIndex: env.NODE_ENV !== 'production',
      })
      .then(async (m) => {
        await seedInitialPortfolio();
        await ensure60DayRetention();
        return m;
      })
      .catch((error) => {
        connection = null;
        throw error;
      });
  return connection;
}

export function warmDatabase(): void {
  if (mongoose.connection.readyState === 1 || connection) return;
  connectDatabase().catch((err) => {
    console.warn('[DB] Pre-warm connection attempt deferred:', (err as Error).message);
  });
}
