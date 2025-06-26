import { NextRequest, NextResponse } from 'next/server';

const SHOPIFY_CART_URL = 'https://interiorrelated.myshopify.com';

export async function GET() {
  const response = await fetch(`${SHOPIFY_CART_URL}/cart.js`, {
    headers: { 'Content-Type': 'application/json' },
  });
  const data = await response.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { action, ...body } = await req.json();

  let endpoint = '';
  if (action === 'add') endpoint = '/cart/add.js';
  else if (action === 'change') endpoint = '/cart/change.js';
  else return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  const response = await fetch(`${SHOPIFY_CART_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  return NextResponse.json(data);
} 