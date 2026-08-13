"use client";

import { useState, useRef } from "react";

export default function ListenButton({ text }: { text: string }) {
  const [speaking, setSpeaking] = useState(false);
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null);

  function toggle() {
    if (typeof window === "undefined" || !window.speechSynthesis) return;

    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 0.95;
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    utterRef.current = utterance;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  }

  return (
    <button
      onClick={toggle}
      className="flex items-center gap-2 text-sm font-semibold px-4 py-2 rounded-full border border-accent text-accent hover:bg-accent hover:text-white transition-colors"
    >
      <span>{speaking ? "⏸" : "🔊"}</span>
      {speaking ? "रोकें" : "इस खबर को सुनें"}
    </button>
  );
}
