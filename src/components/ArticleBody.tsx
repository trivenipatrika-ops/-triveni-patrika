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
