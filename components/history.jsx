"use client";
import React, { useEffect, useState } from "react";

export default function History() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    let stored = [];
    try {
      const parsed = JSON.parse(localStorage.getItem("typingResults"));
      if (Array.isArray(parsed)) {
        stored = parsed;
      }
    } catch (e) {
      stored = [];
    }
    setResults(stored);
  }, []);

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-800">
      <h2 className="text-lg font-semibold mb-3">Past Results</h2>
      {results.length === 0 ? (
        <p className="text-gray-500">No results yet.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((r, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <span>{r.date}</span>
              <span>{r.wpm} WPM, {r.accuracy}%</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
