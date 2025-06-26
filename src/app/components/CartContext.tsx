"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { shopifyCustomerLogin } from "@/lib/shopify";
import { LoginModal } from "./LoginModal";

// --- Types ---
export interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    id: string;
    title: string;
    product: { title: string; handle: string };
    image?: { url: string; altText?: string };
    price: { amount: string; currencyCode: string };
  };
}

export interface Cart {
  id: string;
  checkoutUrl: string;
  lines: { edges: { node: CartLine }[] };
  cost: {
    subtotalAmount: { amount: string; currencyCode: string };
    totalAmount: { amount: string; currencyCode: string };
  };
}

interface CartContextType {
  cart: Cart | null;
  cartId: string | null;
  loading: boolean;
  addToCart: (variantId: string, quantity?: number) => Promise<Cart | undefined>;
  removeFromCart: (lineId: string) => Promise<Cart | undefined>;
  refreshCart: () => Promise<void>;
  showLogin: boolean;
  openLogin: () => void;
  closeLogin: () => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  customerToken: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [cartId, setCartId] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('shopify_cart_id') : null);
  const [customerToken, setCustomerToken] = useState<string | null>(typeof window !== 'undefined' ? localStorage.getItem('shopify_customer_token') : null);
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Helper: GraphQL fetch
  const shopifyFetch = useCallback(async (query: string, variables: Record<string, unknown> = {}, tokenOverride?: string) => {
    const res = await fetch('/api/shopify-graphql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        variables,
        ...(tokenOverride ? { buyerToken: tokenOverride } : {})
      }),
    });
    const json = await res.json();
    if (json.errors) throw new Error(JSON.stringify(json.errors));
    return json.data;
  }, []);

  // Fetch or create cart
  const fetchOrCreateCart = useCallback(async (token: string, id?: string) => {
    setLoading(true);
    try {
      if (id) {
        // Try to fetch cart
        const query = `
          query getCart($cartId: ID!) {
            cart(id: $cartId) {
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
          }
        `;
        const data = await shopifyFetch(query, { cartId: id }, token);
        if (data.cart) return data.cart;
      }
      // Create new cart
      const mutation = `
        mutation cartCreate {
          cartCreate {
            cart {
              id
              checkoutUrl
              lines(first: 20) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } image { url altText } price { amount currencyCode } } } } } }
              cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
            }
          }
        }
      `;
      const data = await shopifyFetch(mutation, {}, token);
      return data.cartCreate.cart;
    } finally {
      setLoading(false);
    }
  }, [shopifyFetch]);

  // Fetch cart on mount or when token/cartId changes
  useEffect(() => {
    if (!customerToken) return;
    fetchOrCreateCart(customerToken, cartId || undefined).then(cart => {
      setCart(cart);
      setCartId(cart.id);
      localStorage.setItem('shopify_cart_id', cart.id);
    });
  }, [customerToken, cartId, fetchOrCreateCart]);

  // Add to cart
  const addToCart = useCallback(async (variantId: string, quantity = 1): Promise<Cart | undefined> => {
    if (!customerToken || !cartId) {
      setShowLogin(true);
      return undefined;
    }
    setLoading(true);
    try {
      const mutation = `
        mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
          cartLinesAdd(cartId: $cartId, lines: $lines) {
            cart {
              id
              checkoutUrl
              lines(first: 20) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } image { url altText } price { amount currencyCode } } } } } }
              cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
            }
            userErrors { field message }
          }
        }
      `;
      const variables = { cartId, lines: [{ merchandiseId: variantId, quantity }] };
      const data = await shopifyFetch(mutation, variables, customerToken);
      setCart(data.cartLinesAdd.cart);
      return data.cartLinesAdd.cart;
    } finally {
      setLoading(false);
    }
  }, [customerToken, cartId, shopifyFetch]);

  // Remove from cart
  const removeFromCart = useCallback(async (lineId: string): Promise<Cart | undefined> => {
    if (!customerToken || !cartId) {
      setShowLogin(true);
      return undefined;
    }
    setLoading(true);
    try {
      const mutation = `
        mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
          cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
            cart {
              id
              checkoutUrl
              lines(first: 20) { edges { node { id quantity merchandise { ... on ProductVariant { id title product { title handle } image { url altText } price { amount currencyCode } } } } } }
              cost { subtotalAmount { amount currencyCode } totalAmount { amount currencyCode } }
            }
            userErrors { field message }
          }
        }
      `;
      const variables = { cartId, lineIds: [lineId] };
      const data = await shopifyFetch(mutation, variables, customerToken);
      setCart(data.cartLinesRemove.cart);
      return data.cartLinesRemove.cart;
    } finally {
      setLoading(false);
    }
  }, [customerToken, cartId, shopifyFetch]);

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (!customerToken || !cartId) return;
    setLoading(true);
    try {
      const query = `
        query getCart($cartId: ID!) {
          cart(id: $cartId) {
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
        }
      `;
      const data = await shopifyFetch(query, { cartId }, customerToken);
      setCart(data.cart);
    } finally {
      setLoading(false);
    }
  }, [customerToken, cartId, shopifyFetch]);

  // Login
  const login = useCallback(async (email: string, password: string) => {
    setLoading(true);
    try {
      const result = await shopifyCustomerLogin(email, password);
      if (result.customerAccessToken) {
        setCustomerToken(result.customerAccessToken.accessToken);
        localStorage.setItem('shopify_customer_token', result.customerAccessToken.accessToken);
        setShowLogin(false);
      } else {
        throw new Error(result.userErrors?.[0]?.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout
  const logout = useCallback(() => {
    setCustomerToken(null);
    setCart(null);
    setCartId(null);
    localStorage.removeItem('shopify_customer_token');
    localStorage.removeItem('shopify_cart_id');
  }, []);

  // Login modal controls
  const openLogin = () => setShowLogin(true);
  const closeLogin = () => setShowLogin(false);

  const value: CartContextType = {
    cart,
    cartId,
    loading,
    addToCart,
    removeFromCart,
    refreshCart,
    showLogin,
    openLogin,
    closeLogin,
    login,
    logout,
    customerToken,
  };

  useEffect(() => {
    if (!customerToken) {
      setShowLogin(true);
    }
  }, [customerToken]);

  return (
    <CartContext.Provider value={value}>
      {children}
      {showLogin && <LoginModal onLogin={token => {
        setCustomerToken(token);
        localStorage.setItem('shopify_customer_token', token);
        setShowLogin(false);
      }} onClose={closeLogin} />}
    </CartContext.Provider>
  );
} 