import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-masthead text-white mt-10">
      <div className="max-w-6xl mx-auto px-4 py-8 text-sm">
        <div className="font-headline text-xl mb-2">त्रिवेणी पत्रिका</div>
        <p className="text-white/70 text-xs mb-4">
          प्रयागराज से शुरू, स्थानीय और सच्ची खबरों का भरोसेमंद स्रोत।
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-white/85">
          <Link href="/epaper" className="hover:underline">
            ई-पेपर
          </Link>
          <Link href="/about" className="hover:underline">
            हमारे बारे में
          </Link>
          <Link href="/contact" className="hover:underline">
            संपर्क करें
          </Link>
          <Link href="/privacy" className="hover:underline">
            गोपनीयता नीति
          </Link>
          <Link href="/terms" className="hover:underline">
            नियम व शर्तें
          </Link>
        </div>
        <div className="border-t border-white/15 mt-6 pt-4">
          <p className="text-white/50 text-xs">
            © {year} त्रिवेणी पत्रिका. सर्वाधिकार सुरक्षित।
          </p>
        </div>
      </div>
    </footer>
  );
}
