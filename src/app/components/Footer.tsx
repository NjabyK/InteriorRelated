"use client";

const glassClass = "backdrop-blur-lg bg-black/15 rounded px-3 py-1 border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 flex items-end justify-between px-8 py-6">
      <span className={`font-bold text-white pointer-events-auto ${glassClass}`}>Explore</span>
      <span className={`font-bold text-white pointer-events-auto ${glassClass}`}>&reg;</span>
    </footer>
  );
} 