"use client";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";

interface MobileMenuDrawerProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileMenuDrawer({ open, onClose }: MobileMenuDrawerProps) {
  const menuItems = [
    { title: "Shop All", href: "/shop", description: "Browse all products" },
    { title: "Home", href: "/", description: "Landing page with product drops" },
    { title: "Collection 1", href: "/collection/1", description: "First product collection" },
    { title: "Collection 2", href: "/collection/2", description: "Second product collection" },
    { title: "About", href: "/about", description: "About Interior Related" },
    { title: "Contact", href: "/contact", description: "Get in touch" },
  ];

  return (
    <div
      className={`fixed top-0 left-0 z-[100] h-screen transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "-translate-x-full"}
        w-full bg-black/30 backdrop-blur-lg border-r border-white/30 shadow-2xl flex flex-col
        block sm:hidden
      `}
      style={{
        ...(open ? { pointerEvents: "auto" } : { pointerEvents: "none" }),
      }}
    >
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[-1] ${open ? "block" : "hidden"}`}
        onClick={onClose}
      />
      
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <span className="font-bold text-lg text-white">Menu</span>
        <Button size="icon" variant="ghost" onClick={onClose}>
          <X className="w-6 h-6 text-white" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            href={item.href}
            onClick={onClose}
            className="block p-4 bg-black/20 rounded-lg hover:bg-black/30 transition-colors duration-200 border border-white/10"
          >
            <div className="font-semibold text-white text-lg mb-1">
              {item.title}
            </div>
            <div className="text-white/70 text-sm">
              {item.description}
            </div>
          </Link>
        ))}
      </div>
      
      <div className="p-4 border-t border-white/20 bg-black/30">
        <div className="text-white/60 text-xs text-center">
          Interior Related © 2024
        </div>
      </div>
    </div>
  );
} 