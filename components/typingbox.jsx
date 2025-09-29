"use client";
import React, { useState, useEffect } from "react";
import Highlightedpsg from "./highlightpsg";





//import random from "@/data/passage";
export default function TypingBox({ passage }) {
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
        if (!isActive) return;
        if (timer > 0) {
            const t = setTimeout(() => { setTimer(timer - 1); }, 1000);
            return () => clearTimeout(t);
        } else {
            setIsActive(false);
            setShowResults(true);

            const newResult = {
                wpm,
                accuracy,
                characters: input.length,
                date: new Date().toLocaleString(),
            };

            const prevResults = JSON.parse(localStorage.getItem("typingResults")) || [];
            const updated = Array.isArray(prevResults) ? [...prevResults, newResult] : [newResult];

            localStorage.setItem("typingResults", JSON.stringify(updated));
        }
    }, [timer, isActive]);


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
        if (!starttime && !isActive) {
            setStarttime(Date.now()) //timer starts at the first input
            setIsActive(true)
        }
        if (!isActive) return; //block input when timer ends
        setInput(e.target.value);

        //calculating wpm
        const words = e.target.value.trim().split(" ").length
        const minutes = (Date.now() - starttime) / 1000 / 60
        setWpm(Math.round(words / minutes))

        setAccuracy(calculateAccuracy(e.target.value, passage));
    }

    const finishChill = () => {
        const elapsed = (Date.now() - starttime) / 60000; // minutes
        const words = input.trim().split(/\s+/).length;
        const wpmNow = elapsed > 0 ? Math.round(words / elapsed) : 0;
        const accNow = Math.round(
            (passage
                .split("")
                .slice(0, input.length)
                .filter((c, i) => c === input[i]).length /
                input.length) * 100
        );

        // Save to localStorage
        const result = {
            date: new Date().toLocaleString(),
            wpm: wpmNow,
            accuracy: isNaN(accNow) ? 0 : accNow,
        };

        const prev = JSON.parse(localStorage.getItem("typingResults")) || [];
        prev.push(result);
        localStorage.setItem("typingResults", JSON.stringify(prev));

        // Reset state
        setIsActive(false);
        setInput("");
    };




    const restart = () => {
        if (starttime) {
            const newResult = {
                wpm,
                accuracy,
                characters: input.length,
                date: new Date().toLocaleString(),
            };

            const prevResults = JSON.parse(localStorage.getItem("typingResults")) || [];
            const updated = Array.isArray(prevResults) ? [...prevResults, newResult] : [newResult];

            localStorage.setItem("typingResults", JSON.stringify(updated));
        }
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
            <div className="mb-4 flex gap-3">
                <button
                    onClick={() => setMode("timed")}
                    className={`px-4 py-2 rounded ${mode === "timed" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
                >
                    Rush Mode
                </button>
                <button
                    onClick={() => setMode("casual")}
                    className={`px-4 py-2 rounded ${mode === "casual" ? "bg-blue-600 text-white" : "bg-gray-700 text-gray-300"}`}
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
                        className="w-full p-3 border rounded-lg mt-4"
                        rows="3"
                        value={input}
                        onChange={handleChange}
                        placeholder="Type here..."
                        disabled={mode === "timed" && !isActive && starttime !== null && timer === 0}
                    />

                    <button onClick={restart}
                        className="mt-3 px-4 py-2 bg-green-600 text-white rounded">
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
                        className="w-full p-3 border rounded-lg mt-4"
                        rows="3"
                        value={input}
                        onChange={handleChange}
                        placeholder="Type here..."
                    />

                    <div className="mt-3 flex gap-3">
                        <button onClick={finishChill} className="px-4 py-2 bg-blue-600 text-white rounded">
                            Finish
                        </button>
                        <button onClick={restart} className="px-4 py-2 bg-green-600 text-white rounded">
                            Reset
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}



//add a delete history button
//casual mode -> not endless