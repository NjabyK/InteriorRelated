import { Cart } from "@/app/components/CartContext";

export interface Product {
  id: string;
  title: string;
  handle: string;
  images: { edges: { node: { src: string; altText?: string } }[] };
}

export interface ProductVariant {
  id: string;
  title: string;
  product: { title: string; handle: string };
}

const domain = process.env.SHOPIFY_STORE_DOMAIN!;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

export async function shopifyFetch(query: string, variables = {}) {
  const res = await fetch(`https://${domain}/api/2023-07/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 }, // ISR for Next.js
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data;
}

export async function getProducts(): Promise<Product[]> {
  const query = `
    {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
            images(first: 1) { edges { node { src: url altText } } }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.products.edges.map((edge: { node: Product }) => edge.node);
}

// Get all products with their handles for hotspot mapping
export async function getAllProductHandles(): Promise<{ title: string; handle: string }[]> {
  const query = `
    {
      products(first: 250) {
        edges {
          node {
            title
            handle
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  return data.products.edges.map((edge: { node: { title: string; handle: string } }) => ({
    title: edge.node.title,
    handle: edge.node.handle,
  }));
}

// Get current cart from Shopify (if it exists)
export async function getCurrentCart(): Promise<Cart | null> {
  try {
    // This would need to be implemented based on how Shopify handles cart sessions
    // For now, we'll return null as this is complex to implement without customer authentication
    return null;
  } catch (error) {
    console.error("Error getting current cart:", error);
    return null;
  }
}

export async function shopifyCustomerLogin(email: string, password: string) {
  const res = await fetch('https://interiorrelated.myshopify.com/api/2023-07/graphql.json', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN!,
    },
    body: JSON.stringify({
      query: `
        mutation customerAccessTokenCreate($input: CustomerAccessTokenCreateInput!) {
          customerAccessTokenCreate(input: $input) {
            customerAccessToken {
              accessToken
              expiresAt
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      variables: {
        input: { email, password }
      }
    }),
  });
  const json = await res.json();
  return json.data.customerAccessTokenCreate;
}

export async function getAllProductVariants(): Promise<ProductVariant[]> {
  const query = `
    {
      products(first: 100) {
        edges {
          node {
            title
            handle
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                }
              }
            }
          }
        }
      }
    }
  `;
  const data = await shopifyFetch(query);
  const variants: ProductVariant[] = [];
  
  interface ProductEdge {
    node: {
      title: string;
      handle: string;
      variants: {
        edges: Array<{
          node: {
            id: string;
            title: string;
          };
        }>;
      };
    };
  }
  
  data.products.edges.forEach((product: ProductEdge) => {
    product.node.variants.edges.forEach((variant) => {
      variants.push({
        id: variant.node.id,
        title: variant.node.title,
        product: { title: product.node.title, handle: product.node.handle },
      });
    });
  });
  return variants;
} 