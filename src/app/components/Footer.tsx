"use client";

const glassClass = "backdrop-blur-lg bg-black/15 rounded px-2 py-0.5 sm:px-3 sm:py-1 border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110 text-sm sm:text-base";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 flex items-end justify-between px-6 sm:px-8 py-9 sm:py-6">
      <span className={`font-bold text-white pointer-events-auto ${glassClass} hidden sm:inline-block`}>Explore</span>
      <span className={`font-bold text-white pointer-events-auto block sm:hidden ${glassClass}`}>Menu</span>
      <span className={`font-bold text-white pointer-events-auto hidden sm:inline-block ${glassClass}`}>&reg;</span>
      <span className={`font-bold text-white pointer-events-auto block sm:hidden ${glassClass}`}>Cart 0</span>
    </footer>
  );
} 