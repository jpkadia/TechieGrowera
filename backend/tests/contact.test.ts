import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { MongoMemoryServer } from 'mongodb-memory-server';
import request from 'supertest';
import type { Express } from 'express';
import mongoose from 'mongoose';
let mongo: MongoMemoryServer;
let app: Express;
const secret = 'test-only-proxy-secret-12345678901234567890';
let ContactLead: typeof mongoose.Model;
let RateBucket: typeof mongoose.Model;
const valid = () => ({
  name: 'Test Person',
  businessName: 'Demo test',
  email: 'test@example.com',
  phone: '+91 9000000000',
  service: 'seo',
  budget: 'discuss',
  description: 'This is an isolated test enquiry for the website.',
  consent: true,
  website: '',
  startedAt: Date.now() - 10000,
});
const post = (ip = '192.0.2.1') =>
  request(app).post('/api/contact').set('x-api-proxy-secret', secret).set('x-client-ip', ip);
before(async () => {
  mongo = await MongoMemoryServer.create();
  process.env.NODE_ENV = 'test';
  process.env.MONGODB_URI = mongo.getUri();
  process.env.API_PROXY_SECRET = secret;
  process.env.RATE_LIMIT_SALT = 'test-only-rate-salt-12345678901234567890';
  app = (await import('../src/app.js')).default;
  const models = await import('../src/models/index.js');
  ContactLead = models.ContactLead;
  RateBucket = models.RateBucket;
  await (await import('../src/config/database.js')).connectDatabase();
  await Promise.all([
    ContactLead.createIndexes(),
    RateBucket.createIndexes(),
    models.BlogPost.createIndexes(),
    models.CaseStudy.createIndexes(),
  ]);
});
after(async () => {
  await mongoose.disconnect();
  await mongo?.stop();
});
test('health and unknown API routes return clean responses', async () => {
  await request(app).get('/api/health').expect(200);
  await request(app).get('/api/unknown').expect(404);
});
test('direct API calls without proxy authentication are rejected', async () => {
  await request(app).post('/api/contact').send(valid()).expect(401);
  assert.equal(await ContactLead.countDocuments(), 0);
});
test('legitimate enquiry is sanitized and saved once without request metadata', async () => {
  const response = await post()
    .send({ ...valid(), name: '  <b>Test Person</b>  ', email: ' TEST@example.com ' })
    .expect(201);
  assert.equal(response.body.ok, true);
  const lead = (await ContactLead.findOne({ email: 'test@example.com' }).lean()) as Record<
    string,
    unknown
  >;
  assert.equal(lead.name, 'Test Person');
  assert.equal(lead.website, undefined);
  assert.equal(lead.startedAt, undefined);
  assert.ok(lead.createdAt);
  assert.equal(lead.status, 'new');
});
test('invalid fields, operator injection and unexpected keys are rejected', async () => {
  for (const changes of [
    { email: 'invalid' },
    { name: { $ne: null } },
    { consent: false },
    { service: 'fake' },
    { admin: true },
  ]) {
    await post('192.0.2.2')
      .send({ ...valid(), ...changes })
      .expect(422);
  }
  assert.equal(await ContactLead.countDocuments(), 1);
});
test('honeypot and implausibly fast submissions are rejected', async () => {
  await post('192.0.2.3')
    .send({ ...valid(), website: 'spam' })
    .expect(422);
  await post('192.0.2.3')
    .send({ ...valid(), startedAt: Date.now() })
    .expect(422);
  assert.equal(await ContactLead.countDocuments(), 1);
});
test('durable per-IP limit rejects the sixth request and gives a retry interval', async () => {
  for (let i = 0; i < 5; i++)
    await post('192.0.2.4')
      .send({ ...valid(), email: `limit-${i}@example.com` })
      .expect(201);
  const blocked = await post('192.0.2.4').send(valid()).expect(429);
  assert.ok(Number(blocked.headers['retry-after']) > 0);
  assert.equal(await ContactLead.countDocuments(), 6);
  const buckets = await RateBucket.find().lean();
  assert.ok(buckets.length > 0);
  assert.ok(buckets.every((b) => !String(b._id).includes('192.0.2')));
});
test('malformed and oversized payloads do not expose internals', async () => {
  const bad = await post().set('Content-Type', 'application/json').send('{oops').expect(400);
  assert.equal(bad.body.stack, undefined);
  await post()
    .send({ ...valid(), description: 'x'.repeat(20000) })
    .expect(413);
});
test('CORS and security headers are configured', async () => {
  const response = await request(app)
    .get('/api/health')
    .set('Origin', 'http://localhost:3000')
    .expect(200);
  assert.equal(response.headers['access-control-allow-origin'], 'http://localhost:3000');
  assert.equal(response.headers['x-content-type-options'], 'nosniff');
  assert.equal(response.headers['x-powered-by'], undefined);
});

test('frontend proxy enforces origin and forwards a valid enquiry through to MongoDB', async () => {
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>((resolve) => server.once('listening', resolve));
  const address = server.address() as { port: number };
  process.env.API_BASE_URL = `http://127.0.0.1:${address.port}`;
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  try {
    const { NextRequest } = await import('next/server');
    const { POST } = await import('../../frontend/src/app/api/contact/route.ts');
    const makeRequest = (origin: string, body: string, type = 'application/json') =>
      new NextRequest('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { origin, 'content-type': type },
        body,
      });
    assert.equal(
      (await POST(makeRequest('https://untrusted.example', JSON.stringify(valid())))).status,
      403,
    );
    assert.equal(
      (await POST(makeRequest('http://localhost:3000', '{}', 'text/plain'))).status,
      415,
    );
    assert.equal((await POST(makeRequest('http://localhost:3000', '{invalid'))).status, 400);
    assert.equal(
      (
        await POST(
          makeRequest('http://localhost:3000', JSON.stringify({ description: 'x'.repeat(20000) })),
        )
      ).status,
      413,
    );
    const response = await POST(
      makeRequest(
        'http://localhost:3000',
        JSON.stringify({ ...valid(), email: 'proxy-test@example.com' }),
      ),
    );
    assert.equal(response.status, 201);
    assert.equal((await response.json()).ok, true);
    assert.equal(await ContactLead.countDocuments({ email: 'proxy-test@example.com' }), 1);
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
  }
});

test('frontend proxy reports upstream errors, invalid responses and timeout without false success', async () => {
  const { NextRequest } = await import('next/server');
  const { POST } = await import('../../frontend/src/app/api/contact/route.ts');
  const realFetch = globalThis.fetch;
  const previousApi = process.env.API_BASE_URL;
  process.env.API_BASE_URL = 'http://127.0.0.1:1';
  process.env.NEXT_PUBLIC_SITE_URL = 'http://localhost:3000';
  const count = await ContactLead.countDocuments();
  try {
    for (const mode of ['unavailable', 'invalid-json', 'timeout', 'network']) {
      let calls = 0;
      globalThis.fetch = async (input, init) => {
        calls++;
        assert.equal(String(input), 'http://127.0.0.1:1/api/contact');
        assert.equal(init?.method, 'POST');
        assert.ok(init?.signal, 'upstream timeout is bounded');
        assert.ok(String(init?.body).includes('test@example.com'));
        if (mode === 'timeout') throw new DOMException('Timed out', 'TimeoutError');
        if (mode === 'network') throw new TypeError('Network unavailable');
        if (mode === 'invalid-json') return new Response('upstream error', { status: 502 });
        return Response.json({ ok: false, message: 'Temporarily unavailable' }, { status: 503 });
      };
      const response = await POST(
        new NextRequest('http://localhost:3000/api/contact', {
          method: 'POST',
          headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
          body: JSON.stringify(valid()),
        }),
      );
      assert.equal(calls, 1, 'no automatic retry of a possibly saved enquiry');
      assert.equal(response.status, 503);
      assert.equal((await response.json()).ok, false);
    }
    assert.equal(await ContactLead.countDocuments(), count);
  } finally {
    globalThis.fetch = realFetch;
    process.env.API_BASE_URL = previousApi;
  }
});
