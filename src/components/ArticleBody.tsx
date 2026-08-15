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
        <span className="absolute bottom-2 left-2 bg-masthead/90 text-white text-[10px] font-bold px-2 py-0.5 tracking-wide">
          त्रिवेणी पत्रिका
        </span>
      </div>
    ),
    pullQuote: ({ value }) => (
      <div className="my-8 border-2 border-accent">
        <div className="bg-accent/5 px-5 py-5 flex gap-4 items-start">
          <div className="flex-1">
            <span className="text-4xl text-accent font-headline leading-none">
              “
            </span>
            <p className="font-headline font-bold text-lg md:text-xl text-ink leading-snug -mt-2">
              {value.quote}
            </p>
            {value.attribution && (
              <>
                <div className="w-10 border-t-2 border-accent mt-4 mb-2" />
                <p className="text-xs font-bold text-accent uppercase tracking-wide">
                  {value.attribution}
                </p>
              </>
            )}
          </div>
          {value.photo && (
            <div className="relative w-20 h-20 md:w-28 md:h-28 shrink-0 overflow-hidden">
              <Image
                src={urlFor(value.photo).width(200).height(200).url()}
                alt={value.attribution || ""}
                fill
                className="object-cover"
              />
            </div>
          )}
        </div>
      </div>
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
