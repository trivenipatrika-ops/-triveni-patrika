"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function PwaNavBar() {
  const router = useRouter();
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const standaloneMedia = window.matchMedia(
      "(display-mode: standalone)"
    ).matches;
    const iosStandalone = (window.navigator as any).standalone === true;
    setIsStandalone(standaloneMedia || iosStandalone);
  }, []);

  if (!isStandalone) return null;

  return (
    <div className="flex items-center gap-3 bg-navy text-white px-3 py-1.5 text-sm">
      <button
        onClick={() => router.back()}
        aria-label="पीछे जाएं"
        className="px-2 py-0.5 rounded hover:bg-white/10"
      >
        ◀ पीछे
      </button>
      <button
        onClick={() => router.forward()}
        aria-label="आगे जाएं"
        className="px-2 py-0.5 rounded hover:bg-white/10"
      >
        आगे ▶
      </button>
    </div>
  );
}
