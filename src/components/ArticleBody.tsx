import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;
      return (
        <figure className="my-6">
          <div className="relative w-full aspect-[4/3] bg-rule">
            <Image
              src={urlFor(value).width(1000).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
            />
            <span className="absolute bottom-2 left-2 bg-masthead/90 text-white text-[10px] font-bold px-2 py-0.5 tracking-wide">
              त्रिवेणी पत्रिका
            </span>
          </div>
          {value.caption && (
            <figcaption className="text-xs text-ink/50 italic mt-2 border-l-2 border-accent pl-2">
              {value.caption} — फोटो: त्रिवेणी पत्रिका
            </figcaption>
          )}
        </figure>
      );
    },
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
  if (!Array.isArray(value) || value.length === 0) return null;
  return (
    <div className="article-body">
      <PortableText value={value} components={components} />
    </div>
  );
}
