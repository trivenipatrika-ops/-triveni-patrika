import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Post } from "@/types";

export default function NewsCard({ post }: { post: Post }) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "short",
  });

  return (
    <Link
      href={`/news/${post.slug}`}
      className="flex gap-3 border-b border-rule pb-4 mb-4 group"
    >
      {post.mainImage && (
        <div className="relative w-28 h-20 shrink-0 overflow-hidden bg-rule">
          <Image
            src={urlFor(post.mainImage).width(200).height(140).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
          />
        </div>
      )}
      <div className="min-w-0">
        {post.category && (
          <span className="text-[11px] font-bold text-accent">
            {post.category.title}
          </span>
        )}
        <h3 className="font-headline text-base font-bold leading-snug mt-0.5 group-hover:underline">
          {post.title}
        </h3>
        <p className="text-[11px] text-ink/50 mt-1">
          {dateStr}
          {post.author?.name ? ` · ${post.author.name}` : ""}
        </p>
      </div>
    </Link>
  );
}
