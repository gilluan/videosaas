/** @type {import('next').NextConfig} */
const nextConfig = {
  typedRoutes: true,
  images: {
    domains: ['lh3.googleusercontent.com'],
  },
  typescript: {
    // Ignore TypeScript errors during build
    ignoreBuildErrors: true,
  },
  // Exclude amplify directory from compilation
  webpack: (config, { isServer }) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/amplify/**', '**/node_modules/**'],
    }

    // Add resolve fallback to ignore amplify modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      '@aws-amplify/backend': false,
    }

    // Exclude amplify directory from being processed
    config.module.rules.push({
      test: /amplify\/.*\.(ts|tsx|js|jsx)$/,
      use: 'null-loader',
    })

    return config
  },
}

module.exports = nextConfig