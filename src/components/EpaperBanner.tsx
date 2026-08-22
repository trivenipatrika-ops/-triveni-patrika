import Link from "next/link";
import { getEpaperByDate } from "@/sanity/queries";

export default async function EpaperBanner() {
  const todayISO = new Date().toISOString().slice(0, 10);

  let edition = null;
  try {
    edition = await getEpaperByDate(todayISO);
  } catch (error) {
    edition = null;
  }

  if (!edition?.pdfUrl) return null;

  return (
    <Link href={`/epaper/${todayISO}`} className="block bg-masthead text-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-3 px-4 py-2.5 text-sm font-semibold">
        <span>📰 आज का ई-पेपर तैयार है — पूरा अखबार यहां पढ़ें</span>
        <span className="underline shrink-0">पढ़ें →</span>
      </div>
    </Link>
  );
}
