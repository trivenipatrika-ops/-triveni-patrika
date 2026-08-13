"use client";

import { useState } from "react";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      // clipboard not available, ignore
    }
  }

  return (
    <div className="flex items-center gap-4 py-4 border-y border-rule my-6">
      <span className="text-xs font-bold text-ink/50 uppercase">शेयर करें</span>
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl"
        aria-label="WhatsApp पर शेयर करें"
      >
        🟢
      </a>
      <a
        href={facebookUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-2xl"
        aria-label="Facebook पर शेयर करें"
      >
        🔵
      </a>
      <button onClick={copyLink} className="text-xs font-semibold text-accent">
        {copied ? "✅ लिंक कॉपी हुआ" : "🔗 लिंक कॉपी करें"}
      </button>
    </div>
  );
}
