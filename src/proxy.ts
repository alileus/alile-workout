import createMiddleware from 'next-intl/middleware';
import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import { contentSecurityPolicy } from './lib/security';

const internationalize = createMiddleware(routing);
export default function proxy(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  const policy = contentSecurityPolicy(nonce);
  request.headers.set('x-nonce', nonce);
  request.headers.set('Content-Security-Policy', policy);
  const response = internationalize(request);
  response.headers.set('Content-Security-Policy', policy);
  response.headers.set('Cache-Control', 'private, no-store');
  return response;
}
export const config = { matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'] };
