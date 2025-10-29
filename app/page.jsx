"use client"
import Display from "@/components/passagedisplay"
import History from "@/components/history"
export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#171717] p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                    type<span className="bg-gradient-to-r from-amber-300 via-amber-400 to-amber-500 bg-clip-text text-transparent">Fast</span> 
                </h1>
                <Display />
                <History />
            </div>
        </main>
    )
}
