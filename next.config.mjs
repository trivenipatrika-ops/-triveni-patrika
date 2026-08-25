/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "i.ytimg.com" }
    ]
  },
  serverExternalPackages: ["@sparticuz/chromium", "puppeteer-core"]
};

export default nextConfig;
