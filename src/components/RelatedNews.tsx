import NewsGrid from "./NewsGrid";
import type { Post } from "@/types";

export default function RelatedNews({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="mt-10 pt-6 border-t border-rule">
      <h2 className="text-xs font-bold text-ink/50 uppercase mb-4 tracking-wide">
        मिलती-जुलती खबरें
      </h2>
      <NewsGrid posts={posts} />
    </section>
  );
}
