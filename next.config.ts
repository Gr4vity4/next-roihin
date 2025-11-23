import type { NextConfig } from 'next'
import type { RemotePattern } from 'next/dist/shared/lib/image-config'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const resolveOrigin = (input?: string | null): string | null => {
  if (!input) return null
  try {
    const parsed = new URL(input)
    return parsed.origin
  } catch {
    return null
  }
}

const laravelApiOrigin =
  resolveOrigin(process.env.NEXT_PUBLIC_LARAVEL_API_URL) ??
  resolveOrigin(process.env.LARAVEL_API_URL) ??
  'http://localhost:8000'

const wordpressOrigin =
  resolveOrigin(process.env.NEXT_PUBLIC_WORDPRESS_API_URL) ??
  resolveOrigin(process.env.WORDPRESS_API_URL)

const additionalConnectOrigins = [laravelApiOrigin, wordpressOrigin, 'https://api.stripe.com', 'https://js.stripe.com']
  .filter((origin): origin is string => Boolean(origin))

const connectSrcDirective = `connect-src 'self' ${additionalConnectOrigins.join(' ')}`

const toRemotePattern = (origin: string): RemotePattern => {
  const url = new URL(origin)
  return {
    protocol: url.protocol.replace(':', '') as RemotePattern['protocol'],
    hostname: url.hostname,
    port: url.port && url.port !== '80' && url.port !== '443' ? url.port : undefined,
    pathname: '/**',
  }
}

const remotePatterns = [
  toRemotePattern(laravelApiOrigin),
  {
    protocol: 'https',
    hostname: 'images.unsplash.com',
    pathname: '/**',
  },
  {
    protocol: 'https',
    hostname: 'static.wixstatic.com',
    pathname: '/**',
  },
] satisfies NonNullable<NextConfig['images']>['remotePatterns']

if (wordpressOrigin) {
  remotePatterns.push(toRemotePattern(wordpressOrigin))
}

const nextConfig: NextConfig = {
  /* config options here */
  // TODO: Enable typedRoutes after fixing Navigation component types
  // experimental: {
  //   typedRoutes: true,
  // },
  images: {
    remotePatterns,
    unoptimized: true,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.google.com https://www.gstatic.com",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com",
              connectSrcDirective,
              "media-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          }
        ]
      }
    ]
  }
};

export default withNextIntl(nextConfig);
