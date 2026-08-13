import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "गोपनीयता नीति — त्रिवेणी पत्रिका",
};

export default function PrivacyPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl font-bold mb-6">
          गोपनीयता नीति (Privacy Policy)
        </h1>
        <div className="space-y-4 text-ink/80 leading-relaxed text-sm">
          <p>अंतिम अपडेट: {new Date().toLocaleDateString("hi-IN")}</p>

          <h2 className="font-headline text-lg font-bold mt-6">
            1. जानकारी का संग्रह
          </h2>
          <p>
            जब आप हमारी वेबसाइट पर पुश नोटिफिकेशन के लिए सब्सक्राइब करते हैं, तो हम
            केवल आपके ब्राउज़र की सब्सक्रिप्शन जानकारी सुरक्षित रूप से संग्रहीत करते
            हैं, ताकि आपको नई खबरों की सूचना भेजी जा सके। हम आपका नाम, ईमेल, या फोन
            नंबर नहीं मांगते।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">2. कुकीज़ (Cookies)</h2>
          <p>
            हमारी वेबसाइट बेहतर अनुभव देने और विज्ञापन (Google AdSense) दिखाने के लिए
            कुकीज़ का उपयोग कर सकती है। Google और उसके सहयोगी, आपकी वेबसाइट विज़िट के
            आधार पर विज्ञापन दिखाने के लिए कुकीज़ का इस्तेमाल करते हैं।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">3. थर्ड-पार्टी विज्ञापन</h2>
          <p>
            हम Google AdSense के माध्यम से विज्ञापन दिखाते हैं। Google, आपकी रुचियों
            के अनुसार विज्ञापन दिखाने के लिए कुकीज़ का इस्तेमाल कर सकता है। आप{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent underline"
            >
              Google Ads Settings
            </a>{" "}
            से इसे नियंत्रित कर सकते हैं।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">4. डेटा सुरक्षा</h2>
          <p>
            हम आपकी जानकारी को सुरक्षित रखने के लिए उचित तकनीकी उपाय अपनाते हैं।
            हालांकि, इंटरनेट पर किसी भी डेटा ट्रांसमिशन की 100% सुरक्षा की गारंटी नहीं
            दी जा सकती।
          </p>

          <h2 className="font-headline text-lg font-bold mt-6">5. संपर्क</h2>
          <p>
            इस नीति से जुड़े किसी भी सवाल के लिए हमें{" "}
            <a
              href="mailto:contact@triveni-patrika.com"
              className="text-accent underline"
            >
              contact@triveni-patrika.com
            </a>{" "}
            पर लिखें।
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
