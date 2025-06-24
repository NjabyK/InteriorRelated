"use client";
import Link from "next/link";
import { useState } from "react";

const glassClass = "backdrop-blur-lg bg-black/15 rounded px-2 py-0.5 sm:px-3 sm:py-1 border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110 text-sm sm:text-base";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-8 pt-20 pb-5 sm:py-6">
      {/* Left links */}
      <div className="flex gap-4 sm:gap-8">
        {/* Desktop: Show Shop All */}
        <Link href="#" className={`font-bold text-white hidden sm:inline-block ${glassClass}`}>Shop All</Link>
        {/* Mobile: Menu button removed from nav bar */}
      </div>
      {/* Center title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className={`font-bold text-white text-base sm:text-lg select-none ${glassClass}`}>Interior Related</span>
      </div>
      {/* Right links */}
      <div className="flex gap-8">
        {/* Desktop: Show Cart */}
        <Link href="#" className={`font-bold text-white hidden sm:inline-block ${glassClass}`}>Cart (0)</Link>
      </div>
    </nav>
  );
} 