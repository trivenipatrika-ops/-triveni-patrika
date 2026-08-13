import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm">
        <div className="font-headline text-xl mb-2">त्रिवेणी पत्रिका</div>
        <p className="text-white/60 text-xs mb-4">
          प्रयागराज से शुरू, स्थानीय और सच्ची खबरों का भरोसेमंद स्रोत।
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/70">
          <Link href="/about">हमारे बारे में</Link>
          <Link href="/contact">संपर्क करें</Link>
          <Link href="/privacy">गोपनीयता नीति</Link>
          <Link href="/terms">नियम व शर्तें</Link>
        </div>
        <p className="text-white/40 text-xs mt-6">
          © {year} त्रिवेणी पत्रिका. सर्वाधिकार सुरक्षित।
        </p>
      </div>
    </footer>
  );
}
