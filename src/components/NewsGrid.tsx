import NewsCard from "./NewsCard";
import type { Post } from "@/types";

export default function NewsGrid({ posts }: { posts: Post[] }) {
  if (!posts || posts.length === 0) {
    return (
      <p className="text-sm text-ink/50 py-6">
        अभी इस श्रेणी में कोई खबर नहीं है।
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
      {posts.map((post) => (
        <NewsCard key={post._id} post={post} />
      ))}
    </div>
  );
}
