"use client";
import React, { useState, useEffect, useRef } from "react";
import Highlightedpsg from "./highlightpsg";


//import random from "@/data/passage";
export default function TypingBox({ passage }) {
    const textareaRef = useRef(null);
    const [input, setInput] = useState("");
    const [starttime, setStarttime] = useState(null);
    const [wpm, setWpm] = useState(0);
    //30s timer
    const [timer, setTimer] = useState(30);
    const [isActive, setIsActive] = useState(false);
    const [accuracy, setAccuracy] = useState(0);
    const [showresults, setShowResults] = useState(false);
    //mode toggle
    const [mode, setMode] = useState("timed");

    useEffect(() => {
        // Auto-focus textarea on mount and when mode changes
        if (textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [mode]);

    useEffect(() => {
        if (mode !== "timed") return;
        if (!isActive) return;

        if (timer > 0) {
            const t = setTimeout(() => setTimer(timer - 1), 1000);
            return () => clearTimeout(t);
        } else {
            setIsActive(false);
            setShowResults(true);

            // use latest values when saving
            saveResults({
                wpm,
                accuracy,
                characters: input.length,
                date: new Date().toLocaleString(),
                mode,
            });
        }
    }, [timer, isActive, mode]);



    //Accuracy Calculation 
    const calculateAccuracy = (input, passage) => {
        let correct = 0;
        for (let i = 0; i < input.length; i++) {
            if (input[i] === passage[i]) {
                correct++;
            }
        }
        return input.length > 0 ? Math.round((correct / input.length) * 100) : 100;
    };

    const handleChange = (e) => {
        const value = e.target.value;
        // Start timer and set starttime BEFORE updating input
        let newStartTime = starttime;
        let newIsActive = isActive;
        if (!starttime && !isActive) {
            newStartTime = Date.now();
            setStarttime(newStartTime); // timer starts at the first input
            newIsActive = true;
            setIsActive(true);
        }
        if (mode === "timed" && (!newIsActive || timer === 0)) return; // block input when timer ends
        setInput(value);

        // Calculate WPM using the correct starttime
        const words = value.trim().split(" ").length;
        const minutes = newStartTime ? ((Date.now() - newStartTime) / 1000 / 60) : 0;
        setWpm(minutes > 0 ? Math.round(words / minutes) : 0);

        setAccuracy(calculateAccuracy(value, passage));
    }

const saveResults = (override = null) => {
    if (typeof window === "undefined") return; // ✅ guard for Next.js SSR

    const newResult = override || {
        wpm,
        accuracy,
        characters: input.length,
        date: new Date().toLocaleString(),
        mode,
    };

    const prevResults = JSON.parse(localStorage.getItem("typingResults")) || [];
    const updated = Array.isArray(prevResults) ? [...prevResults, newResult] : [newResult];

    localStorage.setItem("typingResults", JSON.stringify(updated));
    window.dispatchEvent(new Event("typingResultsUpdated")); // Add this line

    console.log("✅ Saved:", newResult); // debug
};



    const finishChill = () => {
        setIsActive(false)
        saveResults()
        setShowResults(true)
    };

    const restart = () => {
        setInput("")
        setWpm(0)
        setStarttime(null)
        setTimer(30)
        setIsActive(false)
        setAccuracy(0)
        //random()
    }

    return (
        <div>
            {/* Mode toggle buttons */}
            <div className="mb-4 mt-4 flex gap-3">
                <button
                    onClick={() => setMode("timed")}
                    className={`px-4 py-2 rounded cursor-pointer hover:outline focus:ring ${mode === "timed" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                    Rush Mode
                </button>
                <button
                    onClick={() => setMode("casual")}
                    className={`px-4 py-2 rounded cursor-pointer hover:outline focus:ring ${mode === "casual" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`
                    }
                >
                    Chill Mode
                </button>
            </div>
            {mode === "timed" ? (
                // Timed Mode UI
                <>
                    <div className="flex justify-between mb-2">
                        <span><strong>Time left:</strong> {timer}s</span>
                        <span><strong>WPM:</strong> {isNaN(wpm) ? 0 : wpm}</span>
                        <span><strong>Accuracy:</strong> {isNaN(accuracy) ? 0 : accuracy}%</span>
                    </div>

                    <Highlightedpsg passage={passage} userInput={input} />

                    <textarea
                        ref={textareaRef}
                        className="w-full p-3 rounded-lg mt-4 bg-[#111111] outline-none focus:ring h-32"
                        rows="3"
                        value={input}
                        onChange={handleChange}
                        placeholder="Type here..."
                        disabled={mode === "timed" && !isActive && starttime !== null && timer === 0}
                    />

                    <button onClick={restart}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring cursor-pointer">
                        Reset
                    </button>
                </>
            ) : (
                // Casual Mode UI
                <>
                    <div className="flex justify-between mb-2">
                        <span><strong>WPM:</strong> {isNaN(wpm) ? 0 : wpm}</span>
                        <span><strong>Accuracy:</strong> {isNaN(accuracy) ? 0 : accuracy}%</span>
                    </div>

                    <Highlightedpsg passage={passage} userInput={input} />

                    <textarea
                        ref={textareaRef}
                        className="w-full p-3 rounded-lg mt-4 bg-[#111111] outline-none focus:ring h-32"
                        rows="3"
                        value={input}
                        onChange={handleChange}
                        placeholder="Type here..."
                    />

                    <div className="mt-3 flex gap-3">
                        <button onClick={finishChill} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring cursor-pointer">
                            Finish
                        </button>
                        <button onClick={restart} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 focus:outline-none focus:ring cursor-pointer">
                            Reset
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}



//make it so people can't copy paste into the typing box
