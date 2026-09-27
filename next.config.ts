import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/og': ['./public/anatomy/*.svg'],
  },
  async headers() {
    return process.env.VERCEL_ENV === 'production'
      ? []
      : [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }];
  },
};

export default createNextIntlPlugin()(nextConfig);
