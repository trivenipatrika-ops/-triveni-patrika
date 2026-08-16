import Header from "@/components/Header";
import CategoryNav from "@/components/CategoryNav";
import BreakingTicker from "@/components/BreakingTicker";
import Sidebar from "@/components/Sidebar";
import FeaturedBox from "@/components/FeaturedBox";
import NewsGrid from "@/components/NewsGrid";
import Footer from "@/components/Footer";
import { getCategories, getBreakingPosts, getPosts } from "@/sanity/queries";
import type { Category, Post } from "@/types";

export const revalidate = 60;

export default async function HomePage() {
  let categories: Category[] = [];
  let breaking: { title: string }[] = [];
  let posts: Post[] = [];

  try {
    [categories, breaking, posts] = await Promise.all([
      getCategories(),
      getBreakingPosts(),
      getPosts(),
    ]);
  } catch (error) {
    // Sanity से डेटा न मिले तो भी पेज खाली दिखे, टूटे नहीं
  }

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <>
      <Header />
      <CategoryNav categories={categories} activeSlug={null} />
      <BreakingTicker items={breaking.map((b) => b.title)} />
      <main className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-[220px_1fr] gap-8 px-4 py-6">
        <Sidebar categories={categories} activeSlug={null} />
        <div>
          {featured && <FeaturedBox post={featured} />}
          <NewsGrid posts={rest} />
        </div>
      </main>
      <Footer />
    </>
  );
}
