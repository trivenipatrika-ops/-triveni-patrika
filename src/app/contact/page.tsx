import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "संपर्क करें — त्रिवेणी पत्रिका",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl font-bold mb-6">संपर्क करें</h1>
        <div className="space-y-4 text-ink/80 leading-relaxed">
          <p>
            खबर भेजने, विज्ञापन देने, या किसी भी सुझाव/शिकायत के लिए हमसे नीचे दिए
            माध्यम से संपर्क करें:
          </p>
          <ul className="space-y-2">
            <li>
              <span className="font-semibold">ईमेल:</span>{" "}
              <a
                href="mailto:contact@triveni-patrika.com"
                className="text-accent underline"
              >
                contact@triveni-patrika.com
              </a>
            </li>
            <li>
              <span className="font-semibold">पता:</span> प्रयागराज, उत्तर प्रदेश, भारत
            </li>
          </ul>
          <p className="text-sm text-ink/50 mt-6">
            (ऊपर दिया ईमेल एक उदाहरण है — कृपया इसे अपने असली ईमेल पते से बदल दें।)
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
