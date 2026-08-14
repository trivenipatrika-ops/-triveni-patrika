import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { getEpapers } from "@/sanity/queries";

export const revalidate = 300;

export const metadata = {
  title: "ई-पेपर — त्रिवेणी पत्रिका",
};

export default async function EpaperArchivePage() {
  const editions = await getEpapers();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl font-bold mb-2">ई-पेपर</h1>
        <p className="text-sm text-ink/60 mb-8">
          हर दिन सुबह 5 बजे नया अंक अपने आप जुड़ जाता है — पुराने अंक भी यहां
          से पढ़ सकते हैं।
        </p>

        {editions.length === 0 ? (
          <p className="text-sm text-ink/50">अभी कोई अंक उपलब्ध नहीं है।</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
            {editions.map((e) => (
              <Link
                key={e._id}
                href={`/epaper/${e.date}`}
                className="block border border-rule rounded-sm overflow-hidden group"
              >
                <div className="aspect-[3/4] bg-rule flex items-center justify-center">
                  {e.coverImageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={e.coverImageUrl}
                      alt={e.title || e.date}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-3xl">📰</span>
                  )}
                </div>
                <div className="p-2 text-center">
                  <p className="text-xs font-semibold group-hover:text-accent">
                    {new Date(e.date).toLocaleDateString("hi-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
