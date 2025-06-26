"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import { useCartDrawer } from "./CartDrawerProvider";

const glassClass = "backdrop-blur-lg bg-black/15 rounded border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110 text-sm sm:text-base px-2 py-0.5 sm:px-3 sm:py-1";

export default function NavBar() {
  const { cart } = useCart();
  const { setOpen } = useCartDrawer();
  const itemCount = cart?.lines?.edges?.length || 0;

  return (
    <nav className="fixed top-0 left-0 w-full z-50 flex items-center justify-between px-6 sm:px-8 pt-15 pb-5 sm:py-6">
      {/* Left links */}
      <div className="flex gap-4 sm:gap-8">
        <Button asChild className={`font-bold text-white hidden sm:inline-block ${glassClass}`}>
          <Link href="#">Shop All</Link>
        </Button>
      </div>
      
      {/* Center title */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className={`font-bold text-white text-base sm:text-lg select-none ${glassClass} mx-2 sm:mx-4 w-fit inline-block`}>
          Interior Related
        </span>
      </div>
      
      {/* Right links */}
      <div className="flex gap-8">
        <Button 
          onClick={() => setOpen(true)}
          className={`font-bold text-white hidden sm:inline-block ${glassClass}`}
        >
          Cart ({itemCount})
        </Button>
      </div>
    </nav>
  );
} 