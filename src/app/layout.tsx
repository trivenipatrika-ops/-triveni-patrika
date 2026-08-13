import type { Metadata, Viewport } from "next";
import { Noto_Serif_Devanagari, Noto_Sans_Devanagari } from "next/font/google";
import NotificationPrompt from "@/components/NotificationPrompt";
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
};

export const viewport: Viewport = {
  themeColor: "#8A1418",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi">
      <body
        className={`${headlineFont.variable} ${bodyFont.variable} font-body bg-paper text-ink`}
      >
        <NotificationPrompt />
        {children}
      </body>
    </html>
  );
}
