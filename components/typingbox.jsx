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
        <div className="mt-6">
            <div className="flex justify-between mb-2"><span className="text-gray-700">
                <strong>Time left:</strong>{timer}s</span>
                <span className="text-gray-700">
                    <strong>WPM:</strong> {isNaN(wpm) ? 0 : wpm}
                </span>
                <span className="text-gray-700">
                    <strong>Accuracy:</strong> {isNaN(accuracy) ? 0 : accuracy}%
                </span>
            </div>

            <Highlightedpsg passage={passage} userInput={input} />

            <textarea
                className="w-full p-3 border rounded-lg mt-4"
                rows="3"
                value={input}
                onChange={handleChange}
                placeholder="Type here..." disabled={!isActive && starttime !== null && timer === 0} //diabling text area after time is up
            />

            <button onClick={restart}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:cursor-pointer">
                Reset
            </button>


            {showresults && (
                <div className="mt-6 p-4 border rounded-lg bg-black text-center">
                    <h2 className="text-xl font-semibold mb-4">Results</h2>
                    <p><strong>WPM:</strong> {isNaN(wpm) ? 0 : wpm}</p>
                    <p><strong>Accuracy:</strong> {isNaN(accuracy) ? 0 : accuracy}%</p>
                    <p><strong>Characters Typed:</strong> {input.length}</p>
                </div>
            )}
        </div>
    )
}
