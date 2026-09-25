import { connectDatabase } from '../config/database.js';
import { ContactLead, BlogPost, PortfolioItem, RateBucket, ChatSession, VisitorLog } from '../models/index.js';
import mongoose from 'mongoose';
import { AdminSession, AdminAuditLog } from '../models/admin.js';

await connectDatabase();
await Promise.all([
  ContactLead.createIndexes(),
  BlogPost.createIndexes(),
  PortfolioItem.createIndexes(),
  RateBucket.createIndexes(),
  ChatSession.createIndexes(),
  VisitorLog.createIndexes(),
  AdminSession.createIndexes(),
  AdminAuditLog.createIndexes(),
]);
console.log('Required indexes created.');
await mongoose.disconnect();
