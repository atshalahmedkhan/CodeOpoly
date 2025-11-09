/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Exclude client and server folders from Next.js build
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/client/**', '**/server/**', '**/node_modules/**'],
    };
    return config;
  },
  // Exclude client and server from TypeScript checking
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig

