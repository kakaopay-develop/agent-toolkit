/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@kakaopay-develop/agent-toolkit'],
  },
};

module.exports = nextConfig;
