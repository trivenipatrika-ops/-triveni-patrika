import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import { urlFor } from "@/sanity/image";

const quoteColors: Record<
  string,
  { border: string; bg: string; text: string; solidBg: string }
> = {
  red: {
    border: "border-accent",
    bg: "bg-accent/5",
    text: "text-accent",
    solidBg: "bg-accent",
  },
  blue: {
    border: "border-blue-700",
    bg: "bg-blue-50",
    text: "text-blue-700",
    solidBg: "bg-blue-700",
  },
  green: {
    border: "border-green-700",
    bg: "bg-green-50",
    text: "text-green-700",
    solidBg: "bg-green-700",
  },
  orange: {
    border: "border-orange-600",
    bg: "bg-orange-50",
    text: "text-orange-600",
    solidBg: "bg-orange-600",
  },
  purple: {
    border: "border-purple-700",
    bg: "bg-purple-50",
    text: "text-purple-700",
    solidBg: "bg-purple-700",
  },
  navy: {
    border: "border-navy",
    bg: "bg-navy/5",
    text: "text-navy",
    solidBg: "bg-navy",
  },
};

function PullQuoteBlock({ value }: { value: any }) {
  const c = quoteColors[value.color] || quoteColors.red;
  const style = value.style || "box";

  if (style === "diagonal") {
    return (
      <div className="my-8">
        <div className={`h-1 ${c.solidBg} mb-3`} />
        <p className="font-headline font-bold text-lg md:text-xl text-ink leading-snug">
          {value.quote}
        </p>
        {value.attribution && (
          <>
            <div className={`h-0.5 ${c.solidBg} w-16 mt-4 mb-2`} />
            <p className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>
              {value.attribution}
            </p>
          </>
        )}
      </div>
    );
  }

  if (style === "underline") {
    return (
      <div className={`my-8 border-l-4 ${c.border} pl-4`}>
        <p className="italic text-lg text-ink leading-snug">{value.quote}</p>
        {value.attribution && (
          <p className={`text-xs font-bold uppercase tracking-wide mt-2 ${c.text}`}>
            — {value.attribution}
          </p>
        )}
      </div>
    );
  }

  if (style === "sidebar") {
    return (
      <div className="my-8 flex gap-3">
        <div className={`w-1 shrink-0 ${c.solidBg}`} />
        <div>
          <p className={`font-headline italic text-lg ${c.text}`}>{value.quote}</p>
          {value.attribution && (
            <p className="text-xs text-ink/60 mt-2">{value.attribution}</p>
          )}
        </div>
      </div>
    );
  }

  if (style === "minimal") {
    return (
      <div className="my-6">
        <p className="text-lg italic text-ink">“{value.quote}”</p>
        {value.attribution && (
          <p className={`text-xs font-semibold mt-1 ${c.text}`}>
            — {value.attribution}
          </p>
        )}
      </div>
    );
  }

  if (style === "solid") {
    return (
      <div className={`my-8 ${c.solidBg} px-5 py-6`}>
        <p className="font-headline font-bold text-lg md:text-xl text-white leading-snug">
          {value.quote}
        </p>
        {value.attribution && (
          <p className="text-xs font-bold uppercase tracking-wide text-white/80 mt-3">
            {value.attribution}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className={`my-8 border-2 ${c.border}`}>
      <div className={`${c.bg} px-5 py-5 flex gap-4 items-start`}>
        <div className="flex-1">
          <span className={`text-4xl font-headline leading-none ${c.text}`}>
            “
          </span>
          <p className="font-headline font-bold text-lg md:text-xl text-ink leading-snug -mt-2">
            {value.quote}
          </p>
          {value.attribution && (
            <>
              <div className={`w-10 border-t-2 ${c.border} mt-4 mb-2`} />
              <p className={`text-xs font-bold uppercase tracking-wide ${c.text}`}>
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
  );
}

const components: PortableTextComponents = {
  types: {
    image: ({ value }) => (
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
    ),
    pullQuote: ({ value }) => <PullQuoteBlock value={value} />,
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
