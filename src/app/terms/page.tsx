import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "नियम व शर्तें — त्रिवेणी पत्रिका",
};

export default function TermsPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl font-bold mb-6">
          नियम व शर्तें (Terms &amp; Conditions)
        </h1>
        <div className="space-y-4 text-ink/80 leading-relaxed text-sm">
          <p>अंतिम अपडेट: {new Date().toLocaleDateString("hi-IN")}</p>

          <h2 className="font-headline text-lg font-bold mt-6">1. सामग्री का उपयोग</h2>
          <p>
            त्रिवेणी पत्रिका पर प्रकाशित सभी खबरें, फोटो और वीडियो हमारी टीम या
            अधिकृत स्रोतों की संपत्ति हैं। बिना अनुमति के किसी भी सामग्री की नकल,
            पुनः प्रकाशन या व्यावसायिक उपयोग वर्जित है।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">2. सटीकता</h2>
          <p>
            हम खबरों की सटीकता सुनिश्चित करने का पूरा प्रयास करते हैं। यदि कोई त्रुटि
            पाई जाती है, तो हम उसे जल्द से जल्द सुधारने के लिए प्रतिबद्ध हैं।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">
            3. सुधार नीति (Correction Policy)
          </h2>
          <p>
            किसी खबर में तथ्यात्मक गलती की जानकारी मिलने पर हम उसे जांच कर सुधार
            देंगे, और आवश्यक होने पर सुधार का उल्लेख भी करेंगे।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">4. बाहरी लिंक</h2>
          <p>
            हमारी वेबसाइट पर मौजूद बाहरी लिंक की सामग्री के लिए त्रिवेणी पत्रिका
            जिम्मेदार नहीं है।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">5. नियमों में बदलाव</h2>
          <p>
            हम समय-समय पर इन नियमों को अपडेट कर सकते हैं। किसी भी बदलाव की जानकारी
            इसी पेज पर उपलब्ध रहेगी।
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
