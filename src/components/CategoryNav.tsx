import Link from "next/link";
import type { Category } from "@/types";

export default function CategoryNav({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug: string | null;
}) {
  return (
    <nav className="border-b border-rule bg-white overflow-x-auto">
      <ul className="max-w-6xl mx-auto flex gap-6 px-4 text-sm font-semibold whitespace-nowrap">
        <li className="py-3">
          <Link
            href="/"
            className={
              activeSlug === null
                ? "text-accent border-b-2 border-accent pb-3 -mb-px inline-block"
                : "text-ink/70 hover:text-accent inline-block"
            }
          >
            ताजा खबरें
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c._id} className="py-3">
            <Link
              href={`/${c.slug}`}
              className={
                activeSlug === c.slug
                  ? "text-accent border-b-2 border-accent pb-3 -mb-px inline-block"
                  : "text-ink/70 hover:text-accent inline-block"
              }
            >
              {c.title}
            </Link>
          </li>
        ))}
        <li className="py-3">
          <Link href="/epaper" className="text-accent inline-block">
            📰 ई-पेपर
          </Link>
        </li>
      </ul>
    </nav>
  );
}
