import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import type { Express } from 'express';
let replica: MongoMemoryReplSet;
let app: Express;
let token = '';
let id = '';
const proxy = 'test-admin-proxy-secret-12345678901234567890';
const email = 'admin@example.com';
const password = 'Test-only-password-1806';
const draft = {
  title: 'A useful website launch checklist',
  slug: 'useful-website-launch-checklist',
  excerpt: 'A practical original article to help businesses prepare their websites for launch.',
  author: 'Test Editorial',
  category: 'Web',
  tags: ['Planning'],
  featuredImage: '/brand/mark.svg',
  seoTitle: 'Website Launch Checklist',
  metaDescription:
    'A practical checklist for preparing a business website, reviewing content and checking the enquiry journey before launch.',
  service: 'web-development',
  sections: [
    {
      heading: 'Check the customer journey',
      paragraphs: [
        'Review every part of the enquiry flow and make sure your customer can find the details they need.',
      ],
    },
  ],
};
const api = () => request(app);
const auth = (method: 'get' | 'post' | 'put' | 'patch', path: string) =>
  api()
    [method](`/api/admin/${path}`)
    .set('x-api-proxy-secret', proxy)
    .set('x-admin-session', token)
    .set('x-client-ip', '192.0.2.20');
before(async () => {
  replica = await MongoMemoryReplSet.create({ replSet: { count: 1 } });
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = replica.getUri();
  process.env.API_PROXY_SECRET = proxy;
  process.env.RATE_LIMIT_SALT = 'test-admin-rate-salt-12345678901234567890';
  process.env.ADMIN_EMAIL = email;
  process.env.ADMIN_PASSWORD = password;
  process.env.ADMIN_SESSION_SECRET = 'test-admin-session-secret-12345678901234567890';
  app = (await import('../src/app')).default;
  await (await import('../src/config/database')).connectDatabase();
  const { AdminAuditLog, AdminSession } = await import('../src/models/admin');
  const { BlogPost, CaseStudy, ContactLead } = await import('../src/models/index');
  await Promise.all([
    AdminAuditLog.createIndexes(),
    AdminSession.createIndexes(),
    BlogPost.createIndexes(),
    CaseStudy.createIndexes(),
    ContactLead.createIndexes(),
  ]);
});
after(async () => {
  await mongoose.disconnect();
  await replica?.stop();
});
test('admin rejects unauthenticated requests and generic invalid credentials', async () => {
  await api().get('/api/admin/leads').expect(401);
  await auth('get', 'dashboard').expect(401);
  await auth('post', 'login').send({ email, password: 'wrong-password' }).expect(401);
});
test('login creates an opaque hashed server session without logging credentials', async () => {
  const response = await auth('post', 'login').send({ email, password }).expect(200);
  token = response.body.token;
  assert.match(token, /^[a-f0-9]{64}$/);
  const { AdminSession, AdminAuditLog } = await import('../src/models/admin');
  const session = await AdminSession.findOne().lean();
  assert.notEqual(session?.tokenHash, token);
  const logs = JSON.stringify(await AdminAuditLog.find().lean());
  assert.ok(!logs.includes(password) && !logs.includes(token));
  await auth('get', 'session').expect(200);
});
test('private draft cannot leak into public content', async () => {
  const created = await auth('post', 'content/blog').send({ draft }).expect(201);
  id = created.body.id;
  const response = await api()
    .get('/api/published/blog')
    .set('x-api-proxy-secret', proxy)
    .expect(200);
  assert.equal(response.body.items.length, 0);
  await api().get('/api/published/blog').expect(401);
});
test('publish exposes server content; saving a new draft preserves live version', async () => {
  await auth('post', `content/blog/${id}/publish`).send({ revision: 1 }).expect(200);
  await auth('put', `content/blog/${id}`)
    .send({ revision: 2, draft: { ...draft, title: 'Edited but still private' } })
    .expect(200);
  const response = await api().get('/api/published/blog').set('x-api-proxy-secret', proxy);
  assert.equal(response.body.items[0].title, draft.title);
  assert.equal(response.body.items[0].canonicalPath, `/blog/${draft.slug}`);
});
test('stale edits and published slug changes are rejected', async () => {
  await auth('put', `content/blog/${id}`).send({ revision: 1, draft }).expect(409);
  await auth('put', `content/blog/${id}`)
    .send({ revision: 3, draft: { ...draft, slug: 'different-url' } })
    .expect(422);
});
test('HTML injection and duplicate slugs are rejected', async () => {
  await auth('post', 'content/blog')
    .send({ draft: { ...draft, title: '<script>alert(1)</script>' } })
    .expect(422);
  await auth('post', 'content/blog').send({ draft }).expect(409);
});
test('archive removes content; restore remains private until republished', async () => {
  await auth('post', `content/blog/${id}/archive`).send({ revision: 3 }).expect(200);
  assert.equal(
    (await api().get('/api/published/blog').set('x-api-proxy-secret', proxy)).body.items.length,
    0,
  );
  await auth('post', `content/blog/${id}/restore`).send({ revision: 4 }).expect(200);
  assert.equal(
    (await api().get('/api/published/blog').set('x-api-proxy-secret', proxy)).body.items.length,
    0,
  );
  await auth('post', `content/blog/${id}/publish`).send({ revision: 5 }).expect(200);
});
test('enquiry status and audit event commit together with conflict checks', async () => {
  const { ContactLead } = await import('../src/models/index');
  const lead = await ContactLead.create({
    name: 'Test Lead',
    email: 'lead@example.com',
    service: 'seo',
    budget: 'discuss',
    description: 'An isolated test enquiry.',
    consent: true,
  });
  await auth('patch', `leads/${lead._id}`)
    .send({ previousStatus: 'new', status: 'contacted' })
    .expect(200);
  await auth('patch', `leads/${lead._id}`)
    .send({ previousStatus: 'new', status: 'closed' })
    .expect(409);
  const { AdminAuditLog } = await import('../src/models/admin');
  assert.equal(await AdminAuditLog.countDocuments({ action: 'lead_status' }), 1);
  assert.equal((await ContactLead.findById(lead._id))?.status, 'contacted');
});
test('pagination and query operator injection are bounded', async () => {
  await auth('get', 'leads?page=-1').expect(400);
  await auth('get', 'leads?status[$ne]=new').expect(400);
  await auth('get', 'logs?page=1').expect(200);
});
test('login brute force is limited across persisted buckets', async () => {
  for (let i = 0; i < 5; i++)
    await api()
      .post('/api/admin/login')
      .set('x-api-proxy-secret', proxy)
      .set('x-client-ip', '192.0.2.99')
      .send({ email, password: 'wrong' })
      .expect(401);
  await api()
    .post('/api/admin/login')
    .set('x-api-proxy-secret', proxy)
    .set('x-client-ip', '192.0.2.99')
    .send({ email, password })
    .expect(429);
});
test('idle expiry, absolute expiry and logout invalidate sessions', async () => {
  const { AdminSession } = await import('../src/models/admin');
  const { digest } = await import('../src/services/admin-auth');
  await AdminSession.updateOne(
    { tokenHash: digest(token) },
    { lastSeenAt: new Date(Date.now() - 31 * 60000) },
  );
  await auth('get', 'dashboard').expect(401);
  await AdminSession.updateOne(
    { tokenHash: digest(token) },
    { lastSeenAt: new Date(), expiresAt: new Date(Date.now() - 1000) },
  );
  await auth('get', 'dashboard').expect(401);
  const login = await api()
    .post('/api/admin/login')
    .set('x-api-proxy-secret', proxy)
    .set('x-client-ip', '192.0.2.21')
    .send({ email, password });
  token = login.body.token;
  await auth('post', 'logout').send({}).expect(200);
  await auth('get', 'session').expect(401);
});
