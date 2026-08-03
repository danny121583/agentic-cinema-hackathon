import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // In production the FastAPI backend is served from the same origin — the
    // root vercel.json routes /api/* and /health to backend/app/main.py — so
    // nothing needs proxying and NEXT_PUBLIC_API_URL stays empty.
    if (process.env.NODE_ENV === "production") {
      return [];
    }
    const backend = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
    return [
      {
        source: '/api/:path*',
        destination: `${backend}/api/:path*`,
      },
      {
        source: '/health',
        destination: `${backend}/health`,
      },
    ];
  },
};

export default nextConfig;
