"use client";
import Link from "next/link";

const glassClass = "backdrop-blur-lg bg-black/15 rounded px-3 py-1 border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110";

export default function NavBar() {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-8 py-6">
      {/* Left links */}
      <div className="flex gap-8">
        <Link href="#" className={`font-bold text-white ${glassClass}`}>Shop All</Link>
      </div>
      {/* Center title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className={`font-bold text-white text-lg select-none ${glassClass}`}>Interior Related</span>
      </div>
      {/* Right links */}
      <div className="flex gap-8">
        <Link href="#" className={`font-bold text-white ${glassClass}`}>Cart (0)</Link>
      </div>
    </nav>
  );
} 