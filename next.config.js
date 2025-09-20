/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  // Exclude amplify directory from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/amplify/**', '**/node_modules/**'],
    }
    return config
  },
}

module.exports = nextConfig