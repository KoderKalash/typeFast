"use client";
import React, { useEffect, useState } from "react";

export default function History() {
  const [results, setResults] = useState([]);

  useEffect(() => {
    function loadResults() {
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
    }

    loadResults();

    // Listen for updates
    window.addEventListener("typingResultsUpdated", loadResults);
    return () => window.removeEventListener("typingResultsUpdated", loadResults);
  }, []);

  const clearResults = () => {
    localStorage.removeItem("typingResults")
    setResults([])
  }

  console.log("Results loaded in History:", results);

  return (
    <div className="mt-6 p-4 border rounded-lg bg-gray-800">
      <div className="flex justify-between items-center mb-4">
      <h2 className="text-lg font-semibold mb-3">Past Results</h2>
      <button onClick={clearResults} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring">
        Delete History
      </button>
      </div>
      
      {results.length === 0 ? (
        <p className="text-gray-500">No results yet.</p>
      ) : (
        <ul className="space-y-2">
          {results.map((r, idx) => (
            <li key={idx} className="flex justify-between text-sm">
              <div>
                <span className="block text-gray-300">{r.date}</span>
                <span className="block text-gray-300">Mode:{r.mode ? r.mode : "timed"}</span>
              </div>
              <div>
                <span className="block">{r.wpm} WPM, {r.accuracy}%</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
