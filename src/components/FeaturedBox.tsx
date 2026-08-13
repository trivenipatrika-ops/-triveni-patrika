import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/image";
import type { Post } from "@/types";

export default function FeaturedBox({ post }: { post: Post }) {
  const dateStr = new Date(post.publishedAt).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
  });

  return (
    <Link href={`/news/${post.slug}`} className="block mb-8 group">
      {post.mainImage && (
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-rule">
          <Image
            src={urlFor(post.mainImage).width(1200).height(675).url()}
            alt={post.mainImage.alt || post.title}
            fill
            priority
            className="object-cover"
          />
        </div>
      )}
      <div className="border-t-4 border-masthead mt-3 pt-2">
        {post.category && (
          <span className="text-xs font-bold text-accent">
            {post.category.title}
          </span>
        )}
        <h2 className="font-headline text-2xl md:text-3xl font-bold leading-snug mt-1 group-hover:underline">
          {post.title}
        </h2>
        {post.excerpt && (
          <p className="text-sm text-ink/70 mt-2 line-clamp-2">
            {post.excerpt}
          </p>
        )}
        <p className="text-xs text-ink/50 mt-2">
          {dateStr}
          {post.author?.name ? ` · ${post.author.name}` : ""}
        </p>
      </div>
    </Link>
  );
}
