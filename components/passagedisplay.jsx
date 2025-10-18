"use client";

import { useState, useEffect } from "react";
import TypingBox from "./typingbox.jsx";
import Passages from "@/data/passage.js"; 
export default function Display() {
  const [passage, setPassage] = useState("");

  const loadRandomPassage = () => {
    if (!Passages || Passages.length === 0) return;
    const randomIndex = Math.floor(Math.random() * Passages.length);
    setPassage(Passages[randomIndex]);
  };

  useEffect(() => {
    loadRandomPassage();
  }, []);

  if (!passage) {
    return <div className="h-32 bg-slate-800/30 rounded-lg animate-pulse" />;
  }

  return (
    <div className="w-full space-y-6 animate-fade-in">
      {/* Passage Display Card */}
      <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 sm:p-10 shadow-lg hover:border-slate-600/50 transition-colors duration-300">
        <p className="text-lg sm:text-xl leading-relaxed text-slate-200 font-light tracking-wide font-mono">
          {passage}
        </p>
      </div>

      {/* Typing Box */}
      <TypingBox passage={passage} />

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <button
          onClick={loadRandomPassage}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/20 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Next Passage
        </button>

        <button
          onClick={() => navigator.clipboard.writeText(passage)}
          className="flex-1 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 text-slate-100 font-semibold rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400/50 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Copy Passage
        </button>
      </div>
    </div>
  );
}
