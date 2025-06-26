"use client";
import { useState, createContext, useContext, ReactNode } from "react";

const CartDrawerContext = createContext<{
  open: boolean;
  setOpen: (open: boolean) => void;
}>({ open: false, setOpen: () => {} });

export function useCartDrawer() {
  return useContext(CartDrawerContext);
}

export function CartDrawerProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <CartDrawerContext.Provider value={{ open, setOpen }}>
      {children}
    </CartDrawerContext.Provider>
  );
} 