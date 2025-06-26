"use client";
import SlideCart from "./SlideCart";
import { useCartDrawer } from "./CartDrawerProvider";

export default function SlideCartWrapper() {
  const { open, setOpen } = useCartDrawer();
  return <SlideCart open={open} setOpen={setOpen} />;
} 