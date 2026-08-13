import { groq } from "next-sanity";
import { client } from "./client";
import type { Category, Post } from "@/types";

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
