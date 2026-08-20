import { notFound } from "next/navigation";
import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import BreakingTicker from "@/components/BreakingTicker";
import Sidebar from "@/components/Sidebar";
import FeaturedBox from "@/components/FeaturedBox";
import NewsGrid from "@/components/NewsGrid";
import Footer from "@/components/Footer";
import {
  getCategories,
  getBreakingPosts,
  getPosts,
  getFeaturedPost,
} from "@/sanity/queries";
import type { Category, Post } from "@/types";

export const revalidate = 60;

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

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: rawCategorySlug } = await params;

  let categories: Category[] = [];
  try {
    categories = await getCategories();
  } catch (error) {
    categories = [];
  }

  const decoded = safeDecode(rawCategorySlug);
  const encoded = safeEncode(rawCategorySlug);
  const category = categories.find(
    (c) => c.slug === rawCategorySlug || c.slug === decoded || c.slug === encoded
  );

  if (!category) {
    notFound();
  }

  const categorySlug = category!.slug;

  let breaking: { title: string }[] = [];
  let posts: Post[] = [];
  let featuredFromQuery: Post | null = null;

  try {
    [breaking, posts, featuredFromQuery] = await Promise.all([
      getBreakingPosts(),
      getPosts(categorySlug),
      getFeaturedPost(categorySlug),
    ]);
  } catch (error) {
    // Sanity से डेटा न मिले तो भी पेज खाली दिखे, टूटे नहीं
  }

  const featured = featuredFromQuery || posts[0];
  const rest = posts.filter((p) => p._id !== featured?._id);

  return (
    <>
      <Header />
      <CategoryNav categories={categories} activeSlug={categorySlug} />
      <BreakingTicker items={breaking.map((b) => b.title)} />
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 px-4 py-6">
        <Sidebar categories={categories} activeSlug={categorySlug} />
        <div>
          <h1 className="font-headline text-xl font-bold mb-4 text-ink">
            {category!.title}
          </h1>
          {featured && <FeaturedBox post={featured} />}
          <NewsGrid posts={rest} />
        </div>
      </main>
      <Footer />
    </>
  );
}
