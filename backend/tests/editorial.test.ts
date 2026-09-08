import { test } from 'node:test';
import assert from 'node:assert/strict';
import { safeEditorialHref } from '../../frontend/src/components/editorial-paragraph';
import { postDraft } from '../src/utils/editorial-schema';

test('editorial links allow safe destinations and reject executable or ambiguous URLs', () => {
  for (const value of [
    'javascript:alert(1)',
    'data:text/html,test',
    '//evil.example',
    '/\\evil.example',
    'https://user:password@example.com',
    'https://example.com\n',
  ])
    assert.equal(safeEditorialHref(value), null, value);
  assert.equal(safeEditorialHref('/services/seo'), '/services/seo');
  assert.equal(
    safeEditorialHref('https://developers.google.com/search/'),
    'https://developers.google.com/search/',
  );
});
test('author type supports teams and people without allowing arbitrary schema types', () => {
  assert.equal(postDraft.shape.authorType.safeParse('Person').success, true);
  assert.equal(postDraft.shape.authorType.safeParse('Organization').success, true);
  assert.equal(postDraft.shape.authorType.safeParse(undefined).success, true);
  assert.equal(postDraft.shape.authorType.safeParse('Product').success, false);
});
