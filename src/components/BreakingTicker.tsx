export default function BreakingTicker({ items }: { items: string[] }) {
  if (!items || items.length === 0) return null;
  const text = items.join("   |   ");

  return (
    <div className="bg-accent text-white overflow-hidden">
      <div className="max-w-6xl mx-auto flex items-center gap-3 px-4 py-2 text-sm">
        <span className="shrink-0 font-bold flex items-center gap-1">
          🔴 ब्रेकिंग
        </span>
        <div className="overflow-hidden flex-1 relative h-5">
          <div className="ticker-track absolute whitespace-nowrap">
            {text}
          </div>
        </div>
      </div>
    </div>
  );
}
