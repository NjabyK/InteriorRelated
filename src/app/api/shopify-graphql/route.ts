import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch('https://interiorrelated.myshopify.com/api/2023-07/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
      ...(body.buyerToken ? { 'Shopify-Storefront-Buyer-Token': body.buyerToken } : {})
    },
    body: JSON.stringify({ query: body.query, variables: body.variables }),
  });
  const data = await res.json();
  return NextResponse.json(data);
} 