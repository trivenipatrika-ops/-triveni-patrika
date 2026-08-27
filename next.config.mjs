/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"],
  outputFileTracingIncludes: {
    "/api/cron/generate-epaper": ["./node_modules/@sparticuz/chromium/bin/**/*"],
    "/api/pwa-icon": ["./node_modules/@sparticuz/chromium/bin/**/*"]
  }
};

export default nextConfig;
