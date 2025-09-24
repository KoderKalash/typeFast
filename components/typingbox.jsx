import { useEffect, useState } from "react";
// import random from "@/data/passage";
export default function TypingBox({ passage }) {
    const [input, setInput] = useState("");
    const [starttime, setStarttime] = useState(null);
    const [wpm, setWpm] = useState(0);
    //30s timer
    const [timer, setTimer] = useState(30);
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        if (!isActive) return
        if (timer > 0) {
            const t = setTimeout(() => { setTimer(timer - 1) }, 1000)
            return () => clearTimeout(t);
        } else {
            setIsActive(false);
        }
    }, [timer, isActive])

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
    }

    const restart = () => {
        setInput("")
        setWpm(0)
        setStarttime(null)
        setTimer(30)
        setIsActive(false)
        // random()
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between mb-2"><span className="text-gray-700">
                <strong>Time left:</strong>{timer}s</span>
                <span className="text-gray-700">
                    <strong>WPM:</strong> {isNaN(wpm) ? 0 : wpm}
                </span></div>
            <textarea
            className="w-full p-3 border rounded-lg"
                value={input}
                onChange={handleChange}
                placeholder="Type here..." disabled={!isActive && starttime !== null && timer === 0} //diabling text area after time is up
            />

            <button onClick={restart}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:cursor-pointer">
                Reset
            </button>
        </div>
    )
}
