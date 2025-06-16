// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  webpack: (config, { isServer }) => {
    // Fix for Supabase realtime dependency issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "encoding": false,
      };
    }
    
    // Ignore specific warnings
    config.ignoreWarnings = [
      { module: /node_modules\/@supabase\/realtime-js/ },
      { file: /node_modules\/@supabase\/realtime-js/ },
    ];

    return config;
  },
  // Suppress specific warnings during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
};

module.exports = nextConfig;