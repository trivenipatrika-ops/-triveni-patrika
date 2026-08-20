import { groq } from "next-sanity";
import { client } from "./client";
import type { Category, Post } from "@/types";

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function safeEncode(value: string): string {
  try {
    return encodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function getCategories(): Promise<Category[]> {
  return client.fetch(
    groq`*[_type == "category"] | order(order asc) {
      _id, title, "slug": slug.current
    }`
  );
}

export async function getBreakingPosts(): Promise<{ title: string }[]> {
  return client.fetch(
    groq`*[_type == "post" && isBreaking == true] | order(publishedAt desc)[0...8] {
      title
    }`
  );
}

const postFields = groq`
  _id, title, "slug": slug.current, mainImage, excerpt, publishedAt,
  category->{title, "slug": slug.current},
  author->{name}
`;

export async function getPosts(categorySlug?: string): Promise<Post[]> {
  if (categorySlug) {
    return client.fetch(
      groq`*[_type == "post" && category->slug.current == $slug] | order(publishedAt desc)[0...24] { ${postFields} }`,
      { slug: categorySlug }
    );
  }
  return client.fetch(
    groq`*[_type == "post"] | order(publishedAt desc)[0...24] { ${postFields} }`
  );
}

export async function getFeaturedPost(categorySlug?: string): Promise<Post | null> {
  if (categorySlug) {
    return client.fetch(
      groq`*[_type == "post" && isFeatured == true && category->slug.current == $slug] | order(publishedAt desc)[0] { ${postFields} }`,
      { slug: categorySlug }
    );
  }
  return client.fetch(
    groq`*[_type == "post" && isFeatured == true] | order(publishedAt desc)[0] { ${postFields} }`
  );
}

async function fetchPostBySlugExact(slug: string): Promise<Post | null> {
  return client.fetch(
    groq`*[_type == "post" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, mainImage, excerpt, pullQuote, body, videoUrl, publishedAt, _updatedAt,
      category->{title, "slug": slug.current},
      author->{name, image, bio, role}
    }`,
    { slug }
  );
}

// हिंदी/यूनिकोड स्लग किसी भी रूप (raw, decoded, encoded) में आए, तब भी सही खबर मिल जाए
export async function getPostBySlug(slug: string): Promise<Post | null> {
  const candidates = Array.from(
    new Set([slug, safeDecode(slug), safeEncode(slug)])
  );

  for (const candidate of candidates) {
    const post = await fetchPostBySlugExact(candidate);
    if (post) return post;
  }

  return null;
}

export async function getRelatedPosts(
  categorySlug: string,
  excludeId: string
): Promise<Post[]> {
  return client.fetch(
    groq`*[_type == "post" && category->slug.current == $categorySlug && _id != $excludeId] | order(publishedAt desc)[0...4] { ${postFields} }`,
    { categorySlug, excludeId }
  );
}

export type Epaper = {
  _id: string;
  date: string;
  title?: string;
  pdfUrl?: string;
  coverImageUrl?: string;
};

export async function getEpapers(): Promise<Epaper[]> {
  return client.fetch(
    groq`*[_type == "epaper"] | order(date desc) {
      _id, date, title,
      "pdfUrl": pdfFile.asset->url,
      "coverImageUrl": coverImage.asset->url
    }`
  );
}

export async function getEpaperByDate(date: string): Promise<Epaper | null> {
  return client.fetch(
    groq`*[_type == "epaper" && date == $date][0] {
      _id, date, title,
      "pdfUrl": pdfFile.asset->url,
      "coverImageUrl": coverImage.asset->url
    }`,
    { date }
  );
}
