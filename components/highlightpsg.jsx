"use client";
import React from "react";


export default function Highlightedpsg({ passage, userInput }) {
    return (
        <p className="text-lg leading-relaxed">
        {
            passage.split("").map((char, idx) => {
                let colorClass = "text-gray-800"; //default text color
                if (idx < userInput.length) {
                    if (userInput[idx] === char) {
                        colorClass = "text-green-600"; //correct character
                    } else {
                        colorClass = "text-red-600";
                    }
                }
                return (
                    <span key={idx} className={colorClass}>{char}</span>
                );
            })}
        </p>
    );
}