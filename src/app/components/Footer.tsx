"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "./CartContext";
import ExploreDrawer from "./ExploreDrawer";
import MobileMenuDrawer from "./MobileMenuDrawer";
import { useCartDrawer } from "./CartDrawerProvider";
// import SlideCart from "./SlideCart"; // Uncomment if you want to render the cart drawer here

const glassClass = "backdrop-blur-lg bg-black/15 rounded border border-white/30 shadow-lg transition-transform duration-200 hover:scale-110 text-sm sm:text-base px-2 py-0.5 sm:px-3 sm:py-1";

export default function Footer() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const { cart } = useCart();
  const { setOpen } = useCartDrawer();
  const itemCount = cart?.lines?.edges?.length || 0;

  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full z-40 flex items-end justify-between px-6 sm:px-8 py-5 sm:py-6">
        {/* Desktop: Show Explore */}
        <Button 
          onClick={() => setExploreOpen(true)}
          className={`font-bold text-white pointer-events-auto ${glassClass} hidden sm:inline-block`}
        >
          Explore
        </Button>
        
        {/* Mobile: Show Menu button */}
        <div className="block sm:hidden">
          <Button
            onClick={() => setMenuOpen(true)}
            className={`font-bold text-white ${glassClass}`}
          >
            Menu
          </Button>
        </div>
        
        {/* Desktop: Show &reg;; Mobile: Show Cart */}
        <span className={`font-bold text-white pointer-events-auto hidden sm:inline-block ${glassClass}`}>
          &reg;
        </span>
        <Button 
          onClick={() => setOpen(true)}
          className={`font-bold text-white pointer-events-auto block sm:hidden ${glassClass} text-center flex items-center justify-center`}
        >
          Cart {itemCount}
        </Button>
      </footer>
      
      <ExploreDrawer open={exploreOpen} onClose={() => setExploreOpen(false)} />
      <MobileMenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
      {/* <SlideCart open={cartDrawerOpen} setOpen={setCartDrawerOpen} /> */}
    </>
  );
}