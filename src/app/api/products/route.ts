import { NextResponse } from "next/server";
import { getAllProductHandles } from "@/lib/shopify";

export async function GET() {
  try {
    const products = await getAllProductHandles();
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
} 