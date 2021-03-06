/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = {fs: false, path: false, buffer: false}

    return config
  },
}

module.exports = nextConfig
