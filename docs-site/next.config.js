import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: ['@balloo/core-ui', '@balloo/core-theme', '@balloo/core-brand'],
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.mdx?$/,
      use: [
        {
          loader: '@next/mdx',
          options: {
            extension: /\.mdx?$/,
          },
        },
      ],
    });
    return config;
  },
};

export default nextConfig;
