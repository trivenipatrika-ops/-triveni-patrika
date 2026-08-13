import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "हमारे बारे में — त्रिवेणी पत्रिका",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="font-headline text-3xl font-bold mb-6">हमारे बारे में</h1>
        <div className="space-y-4 text-ink/80 leading-relaxed">
          <p>
            त्रिवेणी पत्रिका एक डिजिटल हिंदी समाचार मंच है, जिसकी शुरुआत प्रयागराज से हुई
            है। हमारा उद्देश्य पाठकों तक सही, सटीक और समय पर खबरें पहुंचाना है — बिना
            किसी पक्षपात के।
          </p>
          <p>
            हम स्थानीय खबरों को उतनी ही गंभीरता से लेते हैं जितनी राष्ट्रीय और
            अंतरराष्ट्रीय खबरों को, क्योंकि हमारा मानना है कि हर खबर पाठक के लिए मायने
            रखती है।
          </p>
          <p>
            हमारी टीम में अनुभवी पत्रकार और स्थानीय रिपोर्टर शामिल हैं, जो ज़मीनी स्तर से
            सच्ची जानकारी लेकर आते हैं।
          </p>
          <h2 className="font-headline text-xl font-bold mt-8 mb-2">हमारा मिशन</h2>
          <p>निष्पक्ष, तेज़ और भरोसेमंद पत्रकारिता के ज़रिए समाज को जागरूक बनाना।</p>
        </div>
      </main>
      <Footer />
    </>
  );
}
