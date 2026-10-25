import assert from 'node:assert/strict';
import test from 'node:test';
import { NextRequest } from 'next/server';
import proxy from '../src/proxy';

test('localized responses forward a fresh nonce and retain locale redirects', () => {
  const first = proxy(
    new NextRequest('https://workout.alile.us/en', { headers: { 'x-nonce': 'untrusted' } }),
  );
  const second = proxy(new NextRequest('https://workout.alile.us/ar'));
  const policy = first.headers.get('content-security-policy')!;
  const nonce = policy.match(/'nonce-([^']+)'/)![1];
  assert.notEqual(nonce, 'untrusted');
  assert.equal(first.headers.get('x-middleware-request-x-nonce'), nonce);
  assert.equal(first.headers.get('x-middleware-request-content-security-policy'), policy);
  assert.notEqual(policy, second.headers.get('content-security-policy'));
  assert.match(first.headers.get('cache-control')!, /no-store/);
  const redirect = proxy(new NextRequest('https://workout.alile.us/'));
  assert.equal(redirect.headers.get('location'), 'https://workout.alile.us/en');
});
