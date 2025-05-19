/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ Moved optimizeFonts to the correct top-level position
  optimizeFonts: false, // Prevents Next.js from fetching Google Fonts at build time

  experimental: {
    // Removed optimizeFonts from here
  },

  images: {
    domains: ['stgs3yourpass.fra1.digitaloceanspaces.com', 's3-alpha-sig.figma.com', 'thumbs.dreamstime.com'],
  },

  reactStrictMode: true,

  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },

  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },

  trailingSlash: true,

  modularizeImports: {
    '@mui/material': {
      transform: '@mui/material/{{member}}',
    },
    '@mui/lab': {
      transform: '@mui/lab/{{member}}',
    },
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },

};

module.exports = nextConfig;
