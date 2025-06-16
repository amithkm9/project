// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove the deprecated experimental.appDir option
  // App Router is now stable and enabled by default in Next.js 13+
  
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
  
  // Image optimization settings
  images: {
    domains: [
      'images.unsplash.com',
      'images.pexels.com',
      'via.placeholder.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  
  // Suppress specific warnings during build
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  
  // Environment variables
  env: {
    CUSTOM_KEY: 'value',
  },
  
  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;