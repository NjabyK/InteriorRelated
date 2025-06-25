import { NextRequest, NextResponse } from "next/server";

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;
const endpoint = `https://${domain}/api/2023-07/graphql.json`;

async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function GET(req: NextRequest) {
  const cartId = req.nextUrl.searchParams.get("cartId");
  if (!cartId) return NextResponse.json({ error: "Missing cartId" }, { status: 400 });
  const query = `{
    cart(id: "${cartId}") {
      id
      checkoutUrl
      lines(first: 20) {
        edges {
          node {
            id
            quantity
            merchandise {
              ... on ProductVariant {
                id
                title
                product { title handle }
                image { url altText }
                price { amount currencyCode }
              }
            }
          }
        }
      }
      cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
    }
  }`;
  const data = await shopifyFetch(query);
  return NextResponse.json(data.cart);
}

export async function POST() {
  const query = `mutation { cartCreate { cart { id checkoutUrl } } }`;
  const data = await shopifyFetch(query);
  return NextResponse.json(data.cartCreate.cart);
}

export async function PUT(req: NextRequest) {
  const { cartId, variantId, quantity } = await req.json();
  const query = `mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart { id checkoutUrl lines(first: 20) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } image { url altText } price { amount currencyCode } } } } } } cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } } }
    }
  }`;
  const variables = { cartId, lines: [{ merchandiseId: variantId, quantity }] };
  const data = await shopifyFetch(query, variables);
  return NextResponse.json(data.cartLinesAdd.cart);
}

export async function DELETE(req: NextRequest) {
  const { cartId, lineId } = await req.json();
  const query = `mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
      cart { id checkoutUrl lines(first: 20) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } image { url altText } price { amount currencyCode } } } } } } cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } } } }
    }
  }`;
  const variables = { cartId, lineIds: [lineId] };
  const data = await shopifyFetch(query, variables);
  return NextResponse.json(data.cartLinesRemove.cart);
} 