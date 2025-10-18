"use client";

import React, { useState, useEffect, useRef } from "react";

export default function TypingBox({ passage }) {
  const [typed, setTyped] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [stats, setStats] = useState({ wpm: 0, accuracy: 0, time: 0 });
  const [testStarted, setTestStarted] = useState(false);
  const [mode, setMode] = useState("timed");
  const [timeLeft, setTimeLeft] = useState(30);
  const [testComplete, setTestComplete] = useState(false);
  const inputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (mode === "timed" && testStarted && timeLeft > 0 && !testComplete) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTestComplete(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [testStarted, mode, timeLeft, testComplete]);

  const handleInput = (e) => {
    const value = e.target.value;

    if (mode === "timed" && testComplete) return;

    setTyped(value);

    if (!testStarted && value.length > 0) {
      setTestStarted(true);
    }

    if (passage) {
      const correctChars = value.split("").filter((char, i) => char === passage[i]).length;
      const accuracy = value.length > 0 ? Math.round((correctChars / value.length) * 100) : 0;
      const minutes = Math.max(stats.time / 60, 0.1);
      const words = value.trim().split(/\s+/).length;
      const wpm = Math.round(words / minutes);

      setStats({ wpm: Math.max(0, wpm), accuracy, time: stats.time });
    }
  };

  const handleReset = () => {
    setTyped("");
    setTestStarted(false);
    setTestComplete(false);
    setStats({ wpm: 0, accuracy: 0, time: 0 });
    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    inputRef.current?.focus();
  };

  const handleModeChange = (newMode) => {
    setMode(newMode);
    handleReset();
  };

  const isComplete = typed.length === passage.length && typed === passage;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Mode Buttons */}
      <div className="flex gap-3">
        <button
          onClick={() => handleModeChange("timed")}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
            mode === "timed"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500"
          } focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
        >
          Rush Mode
        </button>

        <button
          onClick={() => handleModeChange("casual")}
          className={`flex-1 px-4 py-2.5 rounded-lg font-semibold transition-all duration-200 ${
            mode === "casual"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20"
              : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700 hover:border-slate-500"
          } focus:outline-none focus:ring-2 focus:ring-amber-400/50`}
        >
          Chill Mode
        </button>
      </div>

      {/* Stats Display */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        {mode === "timed" && (
          <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center hover:border-slate-600/50 transition-colors duration-300">
            <div className="text-2xl sm:text-3xl font-bold text-cyan-400">{timeLeft}s</div>
            <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Time Left</div>
          </div>
        )}
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center hover:border-slate-600/50 transition-colors duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-amber-400">{stats.wpm}</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">WPM</div>
        </div>
        <div className="bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-center hover:border-slate-600/50 transition-colors duration-300">
          <div className="text-2xl sm:text-3xl font-bold text-emerald-400">{stats.accuracy}%</div>
          <div className="text-xs text-slate-400 mt-1 uppercase tracking-wider">Accuracy</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg h-1.5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-300"
          style={{ width: `${passage ? (typed.length / passage.length) * 100 : 0}%` }}
        />
      </div>

      {/* Typing Input */}
      <textarea
        ref={inputRef}
        value={typed}
        onChange={handleInput}
        onFocus={() => setIsActive(true)}
        onBlur={() => setIsActive(false)}
        placeholder="Click here and start typing..."
        className="w-full h-24 sm:h-28 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 text-slate-100 placeholder-slate-500 font-mono text-sm sm:text-base resize-none focus:outline-none focus:border-amber-400/50 focus:ring-2 focus:ring-amber-400/20 transition-all duration-200"
        disabled={!passage || (mode === "timed" && testComplete)}
      />

      {/* Footer Actions */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-slate-400">
          {isComplete && <span className="text-emerald-400 font-semibold">✓ Perfect!</span>}
          {typed.length > 0 && !isComplete && (
            <span>
              {typed.length} / {passage.length} characters
            </span>
          )}
        </div>
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm bg-slate-700/50 hover:bg-slate-700 text-slate-100 rounded-lg border border-slate-600/50 hover:border-slate-500 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-slate-400/50"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
