"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, Dispatch, SetStateAction } from "react";

interface CartContextType {
  cart: any;
  cartId: string | null;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<any>;
  removeFromCart: (lineId: string) => Promise<any>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [cart, setCart] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Load cartId from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("shopify_cart_id");
    if (stored) setCartId(stored);
  }, []);

  // Fetch cart from Shopify when cartId changes
  useEffect(() => {
    if (!cartId) return;
    setLoading(true);
    fetch("/api/cart?cartId=" + cartId)
      .then(res => res.json())
      .then(data => setCart(data))
      .finally(() => setLoading(false));
  }, [cartId]);

  // Create a new cart
  const createCart = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/cart", { method: "POST" });
    const data = await res.json();
    setCartId(data.id);
    localStorage.setItem("shopify_cart_id", data.id);
    setCart(data);
    setLoading(false);
    return data;
  }, []);

  // Add item to cart
  const addToCart = useCallback(async (variantId: string, quantity = 1) => {
    setLoading(true);
    let id = cartId;
    if (!id) {
      const newCart = await createCart();
      id = newCart.id;
    }
    const res = await fetch("/api/cart", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId: id, variantId, quantity }),
    });
    const data = await res.json();
    setCart(data);
    setCartId(data.id);
    localStorage.setItem("shopify_cart_id", data.id);
    setLoading(false);
    setOpen(true);
    return data;
  }, [cartId, createCart]);

  // Remove item from cart
  const removeFromCart = useCallback(async (lineId: string) => {
    setLoading(true);
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cartId, lineId }),
    });
    const data = await res.json();
    setCart(data);
    setLoading(false);
    return data;
  }, [cartId]);

  const value: CartContextType = {
    cart,
    cartId,
    open,
    setOpen,
    loading,
    addToCart,
    removeFromCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
} 