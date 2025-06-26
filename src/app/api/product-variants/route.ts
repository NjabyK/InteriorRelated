import { NextResponse } from 'next/server';
import { getAllProductVariants } from '@/lib/shopify';

export async function GET() {
  try {
    const variants = await getAllProductVariants();
    return NextResponse.json(variants);
  } catch {
    return NextResponse.json({ error: 'Failed to fetch product variants' }, { status: 500 });
  }
} 