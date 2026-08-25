/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  outputFileTracingIncludes: {
    "/api/cron/generate-epaper": ["./node_modules/pdfkit/js/standard-fonts/**/*"]
  }
};

export default nextConfig;
