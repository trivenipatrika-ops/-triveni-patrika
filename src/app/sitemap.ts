import type { MetadataRoute } from "next";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";

  const posts: { slug: string; publishedAt: string }[] = await client.fetch(
    groq`*[_type == "post"]{ "slug": slug.current, publishedAt }`
  );

  const categories: { slug: string }[] = await client.fetch(
    groq`*[_type == "category"]{ "slug": slug.current }`
  );

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    { url: `${siteUrl}/contact`, lastModified: new Date() },
    { url: `${siteUrl}/privacy`, lastModified: new Date() },
    { url: `${siteUrl}/terms`, lastModified: new Date() },
  ];

  const categoryPages: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/${c.slug}`,
    lastModified: new Date(),
  }));

  const postPages: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${siteUrl}/news/${p.slug}`,
    lastModified: new Date(p.publishedAt),
  }));

  return [...staticPages, ...categoryPages, ...postPages];
}
