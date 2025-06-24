"use client";
import { useState } from "react";

const glassClass = "backdrop-blur-lg bg-black/15 rounded px-2 py-0.5 sm:px-3 sm:py-1 border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110 text-sm sm:text-base";

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <footer className="fixed bottom-0 left-0 w-full z-40 flex items-end justify-between px-6 sm:px-8 py-5 sm:py-6">
      {/* Desktop: Show Explore */}
      <span className={`font-bold text-white pointer-events-auto ${glassClass} hidden sm:inline-block`}>Explore</span>
      {/* Mobile: Show Menu button with dropup */}
      <div className="relative block sm:hidden">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className={`font-bold text-white ${glassClass}`}
        >
          Menu
        </button>
        {menuOpen && (
          <div className="absolute bottom-full left-0 mb-2 w-32 bg-black/90 border-2 border-white rounded shadow-lg z-50 flex flex-col">
            <a
              href="#"
              className="px-4 py-2 text-white hover:bg-white/10 border-b border-white/10 rounded-t"
              onClick={() => setMenuOpen(false)}
            >
              Shop All
            </a>
            <a
              href="#"
              className="px-4 py-2 text-white hover:bg-white/10 rounded-b"
              onClick={() => setMenuOpen(false)}
            >
              Explore
            </a>
          </div>
        )}
      </div>
      {/* Desktop: Show &reg;; Mobile: Show Cart */}
      <span className={`font-bold text-white pointer-events-auto hidden sm:inline-block ${glassClass}`}>&reg;</span>
      <span className={`font-bold text-white pointer-events-auto block sm:hidden ${glassClass}`}>Cart 0</span>
    </footer>
  );
}