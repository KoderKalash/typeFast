
import Passages from "@/data/passage";
import { useState, useEffect } from "react";

export default function Display() {
    const [passage, setPassage] = useState("")
    const [mount, setMount] = useState(false)

    const random = () =>{
        if(!Passages || Passages.length === 0) return;
        const i = Math.floor(Math.random() * Passages.length);
        const p = Passages[i];
        setPassage(p);
        // if(onPassageChange) onPassageChange(p); ---- not defined
    }
    useEffect (() => {
        setMount(true);
        random()
    },[]);

    if(!mount){
        return (
            <div>
                <div/>
            </div>
        )
    }
    return(
        <>
        <div className="w-full max-w-3xl mx-auto p-6">
            <div
            role = "article"
            aria-level = "polite"
            className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow">
                <p className="text-lg md:text-xl leading-relaxed text-slate-800 dark:text-slate-100">{passage}</p>
            </div>
            <div className="mt-4 flex gap-2">
                <button onClick={random}  className="px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring">Next Para</button>
                <button onClick={() => navigator.clipboard.writeText(passage)} className="px-4 py-2 rounded border border-slate-200 dark:border-slate-700">Copy Para</button>
            </div>
        </div>
        </>
    )
}