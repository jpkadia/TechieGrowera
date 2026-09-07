import { connectDatabase } from '../config/database.js';
import { ContactLead, BlogPost, CaseStudy, RateBucket } from '../models/index.js';
import mongoose from 'mongoose';
import { AdminSession, AdminAuditLog } from '../models/admin.js';
await connectDatabase();
await Promise.all([
  ContactLead.createIndexes(),
  BlogPost.createIndexes(),
  CaseStudy.createIndexes(),
  RateBucket.createIndexes(),
  AdminSession.createIndexes(),
  AdminAuditLog.createIndexes(),
]);
console.log('Required indexes created.');
await mongoose.disconnect();
