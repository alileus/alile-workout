import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';
import { securityHeaders } from './src/lib/security';

const nextConfig: NextConfig = {
  devIndicators: false,
  poweredByHeader: false,
  outputFileTracingIncludes: {
    '/api/og': ['./public/anatomy/*.svg'],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          ...securityHeaders,
          ...(process.env.VERCEL_ENV === 'production'
            ? []
            : [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }]),
        ],
      },
      // Social previews and public artwork are intentionally embeddable.
      {
        source: '/api/og',
        headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }],
      },
      {
        source: '/anatomy/:path*',
        headers: [{ key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' }],
      },
    ];
  },
};

export default createNextIntlPlugin()(nextConfig);
