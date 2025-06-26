"use client";
import { CartLine, useCart } from "./CartContext";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SlideCartProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function SlideCart({ open, setOpen }: SlideCartProps) {
  const { cart, loading, removeFromCart, refreshCart } = useCart();

  return (
    <div
      className={`fixed top-0 right-0 z-[100] h-screen transition-transform duration-300 ease-in-out
        ${open ? "translate-x-0" : "translate-x-full"}
        w-full sm:w-[390px] bg-black/30 backdrop-blur-lg border-l border-white/30 shadow-2xl flex flex-col
        sm:rounded-l-xl
      `}
      style={{
        maxWidth: "100vw",
        ...(open ? { pointerEvents: "auto" } : { pointerEvents: "none" }),
      }}
    >
      {/* Overlay for mobile */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-md z-[-1] sm:hidden ${open ? "block" : "hidden"}`}
        onClick={() => setOpen(false)}
      />
      <div className="flex items-center justify-between p-4 border-b border-white/20">
        <span className="font-bold text-lg text-white">Your Cart</span>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={() => {
              console.log("🔄 Manual refresh button clicked");
              refreshCart();
            }}
            disabled={loading}
            className="text-white hover:bg-white/10 transition-colors"
            title="Refresh cart"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          <Button size="icon" variant="ghost" onClick={() => setOpen(false)}>
            <X className="w-6 h-6 text-white" />
          </Button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : !cart || !cart.lines?.edges?.length ? (
          <div className="text-white text-center mt-8">Your cart is empty.</div>
        ) : (
          cart.lines.edges.map((edge: { node: CartLine }) => (
            <div key={edge.node.id} className="flex items-center gap-4 bg-black/20 rounded-lg p-2">
              {edge.node.merchandise.image?.url && (
                <Image
                  src={edge.node.merchandise.image.url}
                  alt={edge.node.merchandise.image.altText || "Product"}
                  width={64}
                  height={64}
                  className="w-16 h-16 object-cover rounded"
                />
              )}
              <div className="flex-1">
                <div className="font-semibold text-white">
                  {edge.node.merchandise.product.title}
                </div>
                <div className="text-white/70 text-sm">
                  {edge.node.merchandise.title}
                </div>
                <div className="text-white/90 text-sm mt-1">
                  Qty: {edge.node.quantity}
                </div>
                <div className="text-white/90 text-sm mt-1">
                  {edge.node.merchandise.price.amount} {edge.node.merchandise.price.currencyCode}
                </div>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeFromCart(edge.node.id)}
                className="text-white"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))
        )}
      </div>
      {/* Cart summary and checkout */}
      <div className="p-4 border-t border-white/20 bg-black/30">
        {cart && (
          <>
            <div className="flex justify-between text-white font-semibold mb-2">
              <span>Subtotal</span>
              <span>
                {cart.cost?.subtotalAmount?.amount} {cart.cost?.subtotalAmount?.currencyCode}
              </span>
            </div>
            <Button
              asChild
              className="w-full font-bold text-white bg-white/10 hover:bg-white/20 border border-white/30 backdrop-blur"
            >
              <Link href={cart.checkoutUrl} target="_blank" rel="noopener noreferrer">
                Checkout
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
} 