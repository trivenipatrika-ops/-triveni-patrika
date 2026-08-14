import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
      <div className="relative w-full aspect-[4/3] my-6 bg-rule">
        <Image
          src={urlFor(value).width(1000).url()}
          alt={value.alt || ""}
          fill
          className="object-cover"
        />
      </div>
    ),
    pullQuote: ({ value }) => (
      <blockquote className="my-8 border-l-4 border-accent bg-accent/5 px-5 py-4">
        <p className="font-headline italic text-xl leading-snug text-ink">
          “{value.quote}”
        </p>
        {value.attribution && (
          <footer className="mt-2 text-sm text-ink/60">
            — {value.attribution}
          </footer>
        )}
      </blockquote>
    ),
  },
  marks: {
    highlightRed: ({ children }) => (
      <span className="text-accent font-semibold">{children}</span>
    ),
    highlightBlue: ({ children }) => (
      <span className="text-blue-700 font-semibold">{children}</span>
    ),
    link: ({ value, children }) => (
      <a
        href={value?.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-accent underline"
      >
        {children}
      </a>
    ),
  },
  block: {
    h2: ({ children }) => (
      <h2 className="font-headline text-xl font-bold mt-8 mb-3">{children}</h2>
    ),
    normal: ({ children }) => (
      <p className="text-base leading-relaxed text-ink/90 mb-4">{children}</p>
    ),
  },
};

export default function ArticleBody({ value }: { value: any[] }) {
  return (
    <div className="article-body">
      <PortableText value={value} components={components} />
    </div>
  );
}
