/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed typescript: { ignoreBuildErrors: true } to ensure builds fail on type errors
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
    buildActivity: false,
  },
  async headers() {
    return [
      {
        // Apply these headers to all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "X-DNS-Prefetch-Control",
            value: "off",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains",
          }
        ],
      },
      {
        // Prevent indexing of admin pages
        source: "/admin/:path*",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, nosnippet",
          },
        ],
      }
    ];
  },
}

export default nextConfig
