"use client"

import Display from "@/components/passagedisplay"
import History from "@/components/history"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Subtle animated background grid */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,.1)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.1)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      <div className="relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {/* Header */}
          <header className="mb-12 sm:mb-16 animate-fade-in">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">
              type
              <span className="bg-gradient-to-r from-amber-400 to-amber-500 bg-clip-text text-transparent">Fast</span>
            </h1>
            <p className="text-slate-400 text-sm mt-2 font-light">Master your typing speed</p>
          </header>

          {/* Main content */}
          <div className="space-y-8">
            <Display />
            <History />
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 sm:mt-20 py-8 border-t border-slate-800/50 text-center text-xs text-slate-500">
          <p>
            Made with <span className="text-emerald-400">&lt;/&gt;</span> by Kalash
          </p>
        </footer>
      </div>
    </main>
  )
}
