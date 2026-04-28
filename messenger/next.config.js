/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  output: 'standalone',
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb'
    },
    // ЯВНО ВКЛЮЧАЕМ App Router
    appDir: true
  },
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.yandex.net',
      },
      {
        protocol: 'https',
        hostname: 'avatars.yandex.net',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/manifest.json',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=86400',
          },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
