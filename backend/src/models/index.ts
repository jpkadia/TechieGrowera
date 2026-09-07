import mongoose, { Schema } from 'mongoose';
const contactSchema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    businessName: { type: String, maxlength: 150 },
    email: { type: String, required: true, maxlength: 254 },
    phone: { type: String, maxlength: 25 },
    service: { type: String, required: true },
    budget: { type: String, required: true },
    description: { type: String, required: true, maxlength: 5000 },
    consent: { type: Boolean, required: true },
    privacyVersion: { type: String, default: '2026-09-07' },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
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
const caseSchema = new Schema(
  {
    projectName: { type: String, required: true },
    client: String,
    industry: String,
    problem: String,
    solution: String,
    services: [String],
    technologies: [String],
    results: String,
    images: [String],
    demo: { type: Boolean, default: true },
    slug: { type: String, required: true, unique: true, match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/ },
    status: { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    draft: Schema.Types.Mixed,
    published: Schema.Types.Mixed,
    revision: { type: Number, default: 1 },
    everPublished: { type: Boolean, default: false },
    seo: seoSchema,
  },
  { timestamps: true },
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
export const CaseStudy = mongoose.models.CaseStudy || mongoose.model('CaseStudy', caseSchema);
export const RateBucket = mongoose.models.RateBucket || mongoose.model('RateBucket', bucketSchema);
