import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getEpaperByDate } from "@/sanity/queries";

export const revalidate = 300;

export default async function EpaperDayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const edition = await getEpaperByDate(date);

  if (!edition || !edition.pdfUrl) {
    notFound();
  }

  const dateLabel = new Date(date).toLocaleDateString("hi-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="font-headline text-2xl font-bold mb-4">
          ई-पेपर — {dateLabel}
        </h1>
        <div className="border border-rule" style={{ height: "80vh" }}>
          <iframe
            src={edition!.pdfUrl}
            title={`Epaper ${date}`}
            className="w-full h-full"
          />
        </div>
        <a
          href={edition!.pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 text-sm font-semibold text-accent underline"
        >
          PDF डाउनलोड करें
        </a>
      </main>
      <Footer />
    </>
  );
}
