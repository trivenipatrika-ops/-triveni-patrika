import { groq } from "next-sanity";
import { client } from "@/sanity/client";

function escapeXml(text: string) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";
  const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();

  const posts: { slug: string; title: string; publishedAt: string }[] =
    await client.fetch(
      groq`*[_type == "post" && publishedAt >= $since]{ "slug": slug.current, title, publishedAt }`,
      { since: twoDaysAgo }
    );

  const urls = posts
    .map(
      (p) => `
  <url>
    <loc>${siteUrl}/news/${encodeURIComponent(p.slug)}</loc>
    <news:news>
      <news:publication>
        <news:name>त्रिवेणी पत्रिका</news:name>
        <news:language>hi</news:language>
      </news:publication>
      <news:publication_date>${p.publishedAt}</news:publication_date>
      <news:title>${escapeXml(p.title)}</news:title>
    </news:news>
  </url>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">${urls}
</urlset>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
