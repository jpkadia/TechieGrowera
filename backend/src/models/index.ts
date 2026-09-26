import mongoose, { Schema } from 'mongoose';
const contactSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    businessName: { type: String, maxlength: 150 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, required: true, maxlength: 25 },
    service: { type: String, required: true },
    budget: { type: String, default: 'discuss' },
    description: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, default: true },
    privacyVersion: { type: String, default: '2026-09-07' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    ip: { type: String, default: '' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
  },
  { timestamps: true, strict: 'throw' },
);
contactSchema.index({ createdAt: -1 });
const sectionSchema = new Schema(
  { heading: { type: String, required: true }, paragraphs: { type: [String], required: true } },
  { _id: false },
);
const seoSchema = new Schema(
  { title: String, description: String, canonicalPath: String, ogImage: String },
  { _id: false },
);
const blogSchema = new Schema(
  {
    title: { type: String, required: true },
    shortTitle: String,
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    excerpt: String,
    content: [sectionSchema],
    author: String,
    category: String,
    tags: [String],
    featuredImage: String,
    publishedAt: Date,
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    draft: Schema.Types.Mixed,
    published: Schema.Types.Mixed,
    revision: { type: Number, default: 1 },
    everPublished: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true },
);
blogSchema.index({ status: 1, publishedAt: -1 });
const portfolioSchema = new Schema(
  {
    projectName: String,
    title: String,
    client: String,
    industry: String,
    problem: String,
    solution: String,
    services: [String],
    technologies: [String],
    results: String,
    images: [String],
    demo: { type: Boolean, default: false },
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'published' },
    draft: Schema.Types.Mixed,
    published: Schema.Types.Mixed,
    revision: { type: Number, default: 1 },
    everPublished: { type: Boolean, default: true },
    seo: seoSchema,
  },
  { timestamps: true, collection: 'portfolio', strict: false },
);
const bucketSchema = new Schema(
  {
    _id: String,
    count: { type: Number, required: true },
    expiresAt: { type: Date, required: true },
  },
  { versionKey: false },
);
bucketSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
export const ContactLead =
  mongoose.models.ContactLead || mongoose.model('ContactLead', contactSchema);
export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', blogSchema);
export const PortfolioItem =
  mongoose.models.PortfolioItem ||
  mongoose.model('PortfolioItem', portfolioSchema, 'portfolio');
export const PortfolioProject = PortfolioItem;
export const RateBucket = mongoose.models.RateBucket || mongoose.model('RateBucket', bucketSchema);

const chatMessageSchema = new Schema(
  {
    role: { type: String, enum: ['user', 'assistant'], required: true },
    content: { type: String, required: true, maxlength: 4000 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const chatSessionSchema = new Schema(
  {
    sessionId: { type: String, required: true, unique: true },
    messages: [chatMessageSchema],
    ip: { type: String, default: '' },
    userAgent: { type: String, default: '' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
    lastActiveAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'chat_sessions' },
);
chatSessionSchema.index({ lastActiveAt: -1 });
chatSessionSchema.index({ lastActiveAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

const pageViewSchema = new Schema(
  {
    path: { type: String, required: true, maxlength: 500 },
    referrer: { type: String, default: '', maxlength: 1000 },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false },
);

const visitorLogSchema = new Schema(
  {
    visitorId: { type: String, required: true, index: true },
    sessionId: { type: String, default: '', index: true },
    ip: { type: String, default: '' },
    os: { type: String, default: 'Unknown' },
    browser: { type: String, default: 'Unknown' },
    device: { type: String, default: 'Desktop' },
    pages: [pageViewSchema],
    firstSeenAt: { type: Date, default: Date.now },
    lastSeenAt: { type: Date, default: Date.now },
  },
  { timestamps: true, collection: 'visitor_logs' },
);
visitorLogSchema.index({ lastSeenAt: -1 });
visitorLogSchema.index({ lastSeenAt: 1 }, { expireAfterSeconds: 60 * 24 * 60 * 60 });

export interface IChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChatSession {
  _id: mongoose.Types.ObjectId;
  sessionId: string;
  messages: IChatMessage[];
  ip?: string;
  userAgent?: string;
  os?: string;
  browser?: string;
  device?: string;
  lastActiveAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPageView {
  path: string;
  referrer?: string;
  timestamp: Date;
}

export interface IVisitorLog {
  _id: mongoose.Types.ObjectId;
  visitorId: string;
  sessionId?: string;
  ip?: string;
  os?: string;
  browser?: string;
  device?: string;
  pages: IPageView[];
  firstSeenAt: Date;
  lastSeenAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export const ChatSession =
  (mongoose.models.ChatSession as mongoose.Model<IChatSession>) ||
  mongoose.model<IChatSession>('ChatSession', chatSessionSchema);
export const VisitorLog =
  (mongoose.models.VisitorLog as mongoose.Model<IVisitorLog>) ||
  mongoose.model<IVisitorLog>('VisitorLog', visitorLogSchema);

