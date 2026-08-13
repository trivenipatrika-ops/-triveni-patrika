import Link from "next/link";
import type { Category } from "@/types";

export default function Sidebar({
  categories,
  activeSlug,
}: {
  categories: Category[];
  activeSlug: string | null;
}) {
  return (
    <aside className="hidden md:block border-r border-rule pr-4">
      <h2 className="text-xs font-bold text-ink/50 uppercase mb-3 tracking-wide">
        मुख्य श्रेणियाँ
      </h2>
      <ul className="space-y-2 text-sm">
        <li>
          <Link
            href="/"
            className={
              activeSlug === null
                ? "text-accent font-semibold"
                : "text-ink/70 hover:text-accent"
            }
          >
            ताजा खबरें
          </Link>
        </li>
        {categories.map((c) => (
          <li key={c._id}>
            <Link
              href={`/${c.slug}`}
              className={
                activeSlug === c.slug
                  ? "text-accent font-semibold"
                  : "text-ink/70 hover:text-accent"
              }
            >
              {c.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
