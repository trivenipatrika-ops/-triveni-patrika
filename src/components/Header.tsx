export default function Header() {
  const dateStr = new Date().toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="bg-paper">
      <div className="h-1.5 bg-gradient-to-r from-masthead via-accent to-masthead" />
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-4 border-b border-rule">
        <span className="text-[11px] md:text-xs text-ink/60 w-20 md:w-28">
          {dateStr}
        </span>
        <div className="text-center flex-1">
          <h1 className="font-headline text-3xl md:text-5xl font-black text-masthead tracking-tight">
            त्रिवेणी पत्रिका
          </h1>
          <p className="text-[9px] md:text-xs tracking-[0.3em] text-ink/50 uppercase mt-1 font-semibold">
            डिजिटल अखबार · प्रयागराज
          </p>
        </div>
        <span className="w-20 md:w-28 flex justify-end">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-ink/50"
          >
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
    </header>
  );
}
