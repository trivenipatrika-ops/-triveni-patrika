import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ListenButton from "@/components/ListenButton";
import ShareButtons from "@/components/ShareButtons";
import VideoEmbed from "@/components/VideoEmbed";
import ArticleBody from "@/components/ArticleBody";
import PullQuote from "@/components/PullQuote";
import RelatedNews from "@/components/RelatedNews";
import { getPostBySlug, getRelatedPosts } from "@/sanity/queries";
import { urlFor } from "@/sanity/image";

export const revalidate = 60;

function extractPlainText(blocks: any[] = []): string {
  return blocks
    .filter((b) => b._type === "block")
    .map((b) => (b.children || []).map((c: any) => c.text).join(""))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  const imageUrl = post.mainImage?.asset
    ? urlFor(post.mainImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${post.title} — त्रिवेणी पत्रिका`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      modifiedTime: post._updatedAt || post.publishedAt,
      images: imageUrl ? [imageUrl] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: imageUrl ? [imageUrl] : [],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const related = post!.category
    ? await getRelatedPosts(post!.category.slug, post!._id)
    : [];

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";
  const pageUrl = `${siteUrl}/news/${post!.slug}`;
  const dateStr = new Date(post!.publishedAt).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const speechText = `${post!.title}. ${post!.excerpt || ""}. ${
    post!.pullQuote?.quote ? post!.pullQuote.quote + ". " : ""
  }${extractPlainText(post!.body)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post!.title,
    description: post!.excerpt || "",
    image: post!.mainImage?.asset
      ? [urlFor(post!.mainImage).width(1200).url()]
      : [],
    datePublished: post!.publishedAt,
    dateModified: post!._updatedAt || post!.publishedAt,
    author: post!.author?.name
      ? [{ "@type": "Person", name: post!.author.name }]
      : [],
    publisher: {
      "@type": "Organization",
      name: "त्रिवेणी पत्रिका",
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/api/pwa-icon?size=512`,
        width: 512,
        height: 512,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": pageUrl,
    },
    isAccessibleForFree: "True",
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-8">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {post!.category && (
          <span className="text-xs font-bold text-accent">
            {post!.category.title}
          </span>
        )}
        <h1 className="font-headline text-2xl md:text-4xl font-bold leading-snug mt-2">
          {post!.title}
        </h1>
        {post!.excerpt && (
          <p className="text-base text-ink/70 mt-3">{post!.excerpt}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-ink/50">
          <span>{dateStr}</span>
          {post!.author?.name && <span>· {post!.author.name}</span>}
        </div>

        <div className="mt-4">
          <ListenButton text={speechText} />
        </div>

        {post!.mainImage?.asset && (
          <figure className="my-6">
            <div className="relative w-full aspect-[16/9] bg-rule">
              <Image
                src={urlFor(post!.mainImage).width(1200).height(675).url()}
                alt={post!.mainImage.alt || post!.title}
                fill
                priority
                className="object-cover"
              />
              <span className="absolute bottom-2 left-2 bg-masthead/90 text-white text-[10px] font-bold px-2 py-0.5 tracking-wide">
                त्रिवेणी पत्रिका
              </span>
            </div>
            {post!.mainImage.caption && (
              <figcaption className="text-xs text-ink/50 italic mt-2 border-l-2 border-accent pl-2">
                {post!.mainImage.caption} — फोटो: त्रिवेणी पत्रिका
              </figcaption>
            )}
          </figure>
        )}

        {post!.pullQuote && <PullQuote value={post!.pullQuote} />}

        {post!.videoUrl && <VideoEmbed url={post!.videoUrl} />}

        {post!.body && <ArticleBody value={post!.body} />}

        <ShareButtons url={pageUrl} title={post!.title} />

        <RelatedNews posts={related} />
      </main>
      <Footer />
    </>
  );
}
