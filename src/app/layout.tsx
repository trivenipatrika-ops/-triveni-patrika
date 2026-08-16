import type { Metadata, Viewport } from "next";
import { Noto_Serif_Devanagari, Noto_Sans_Devanagari } from "next/font/google";
import NotificationPrompt from "@/components/NotificationPrompt";
import PwaNavBar from "@/components/PwaNavBar";
import InstallButton from "@/components/InstallButton";
import "./globals.css";

const headlineFont = Noto_Serif_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["600", "700", "900"],
  variable: "--font-headline",
});

const bodyFont = Noto_Sans_Devanagari({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "त्रिवेणी पत्रिका — डिजिटल अखबार",
  description: "प्रयागराज और आसपास की ताज़ा खबरें — त्रिवेणी पत्रिका",
  appleWebApp: {
    title: "त्रिवेणी पत्रिका",
    statusBarStyle: "default",
  },
  icons: {
    icon: "/api/pwa-icon?size=192",
    apple: "/api/pwa-icon?size=180",
  },
};

export const viewport: Viewport = {
  themeColor: "#8A1418",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "https://triveni-patrika.vercel.app";

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: "त्रिवेणी पत्रिका",
    url: siteUrl,
    logo: `${siteUrl}/api/pwa-icon?size=512`,
  };

  return (
    <html lang="hi">
      <body
        className={`${headlineFont.variable} ${bodyFont.variable} font-body bg-paper text-ink`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <PwaNavBar />
        <NotificationPrompt />
        <InstallButton />
        {children}
      </body>
    </html>
  );
}
