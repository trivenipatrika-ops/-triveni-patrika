export default function Header() {
  const dateStr = new Date().toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="border-b border-rule bg-paper">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
        <span className="text-xs text-ink/60 w-24">{dateStr}</span>
        <div className="text-center flex-1">
          <h1 className="font-headline text-3xl md:text-4xl font-black text-masthead tracking-tight">
            त्रिवेणी पत्रिका
          </h1>
          <p className="text-[10px] md:text-xs tracking-[0.2em] text-ink/50 uppercase mt-1">
            डिजिटल अखबार
          </p>
        </div>
        <span className="w-24 flex justify-end">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-ink/50">
            <circle cx="11" cy="11" r="7" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </span>
      </div>
    </header>
  );
}
