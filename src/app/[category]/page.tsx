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

export const revalidate = 60;

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category: categorySlug } = await params;

  const categories = await getCategories();
  const category = categories.find((c) => c.slug === categorySlug);

  if (!category) {
    notFound();
  }

  const [breaking, posts, featuredFromQuery] = await Promise.all([
    getBreakingPosts(),
    getPosts(categorySlug),
    getFeaturedPost(categorySlug),
  ]);

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
