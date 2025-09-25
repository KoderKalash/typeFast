"use client"
import Display from "@/components/passagedisplay"
import History from "@/components/history"
export default function Home() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-900 p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-slate-900 dark:text-white">
                    type<span className="text-yellow-500">Fast</span> 
                </h1>
                <Display />
                <History />
            </div>
        </main>
    )
}
