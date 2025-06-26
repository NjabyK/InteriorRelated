"use client";
import Image from "next/image";
import { useDragScroll } from "@/lib/useDragScroll";
import { useCart } from './components/CartContext';
import { ProductVariant } from '@/lib/shopify';
import { useEffect, useState } from 'react';

// Landing page with responsive hero image and drag-to-scroll hotspots
const HERO_IMAGE_ASPECT_RATIO = 2000 / 1200; // ≈ 1.67

// Map hotspots to actual Shopify product handles
// You'll need to replace these with your actual product handles from Shopify
const HOTSPOTS = [
  { left: "25%", top: "40%", handle: "tree", title: "Tree Product", shopifyHandle: "ceramic-mini-vase" },
  { left: "45%", top: "75%", handle: "table", title: "Table Product", shopifyHandle: "danish-bentwood-floor-lamp-by-caprani-of-denmark" },
  { left: "45%", top: "30%", handle: "lamp", title: "Lamp Product", shopifyHandle: "vibia-s-north-floor-lamp" },
  { left: "65%", top: "66%", handle: "couch", title: "Couch Product", shopifyHandle: "finn-juhl-egypetian-chair-in-wood-and-leather" },
  { left: "45%", top: "61%", handle: "pillow", title: "Pillow Product", shopifyHandle: "mcmullin-co-beatrix-fabric-bed-head" },
];

export default function HomePage() {
  const { addToCart } = useCart();
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [adding, setAdding] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<{ title: string; handle: string; image?: string } | null>(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const mobileScrollRef = useDragScroll();
  const desktopScrollRef = useDragScroll();

  useEffect(() => {
    fetch('/api/product-variants')
      .then(res => res.json())
      .then(vs => {
        setVariants(vs);
      });
  }, []);

  // Helper to get product info and variants by handle
  const getProductDetailsByHandle = (handle: string) => {
    const productVariants = variants.filter(v => v.product.handle === handle);
    if (productVariants.length === 0) return null;
    // Optionally, fetch image from the first variant if available
    return {
      title: productVariants[0].product.title,
      handle,
      image: undefined, // You can extend ProductVariant to include image if needed
      variants: productVariants,
    };
  };

  return (
    <>
      {/* Product Modal/Card */}
      {showProductModal && selectedProduct && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#222', padding: 32, borderRadius: 12, minWidth: 340, color: '#fff', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.3)', position: 'relative' }}>
            <button onClick={() => setShowProductModal(false)} style={{ position: 'absolute', top: 12, right: 12, background: 'transparent', color: '#fff', fontSize: 24, border: 'none', cursor: 'pointer' }}>&times;</button>
            <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{selectedProduct.title}</h2>
            {/* Optionally show image here if available */}
            {/* <Image src={selectedProduct.image} ... /> */}
            <div style={{ marginTop: 16 }}>
              {variants.filter(v => v.product.handle === selectedProduct.handle).map(variant => (
                <div key={variant.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <span>{variant.title}</span>
                  <button
                    className="bg-white text-black px-4 py-2 rounded font-bold"
                    disabled={adding === variant.id}
                    onClick={async () => {
                      setAdding(variant.id);
                      await addToCart(variant.id, 1);
                      setAdding(null);
                    }}
                  >
                    {adding === variant.id ? 'Adding...' : 'Add to Cart'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="w-screen h-screen overflow-hidden bg-black flex flex-col items-center justify-center">
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Mobile: horizontal drag-to-scroll, image fills height */}
          <div
            ref={mobileScrollRef}
            className="block sm:hidden w-full h-full overflow-x-auto overflow-y-hidden"
          >
            <div
              className="relative h-screen min-h-[300px]"
              style={{ width: `calc(100vh * ${HERO_IMAGE_ASPECT_RATIO})`, maxHeight: "100vh" }}
            >
              <Image
                src="/hero-drop.webp"
                alt="Hero Product"
                fill
                className="object-cover w-full h-full"
                priority
                sizes="100vw"
              />
              {HOTSPOTS.map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const details = getProductDetailsByHandle(spot.shopifyHandle);
                    if (details) {
                      setSelectedProduct({ title: details.title, handle: details.handle });
                      setShowProductModal(true);
                    }
                  }}
                  className="absolute z-10 group"
                  style={{ left: spot.left, top: spot.top }}
                >
                  <span className="block w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ripple-animate border border-white group-hover:scale-110 transition-transform">
                    <span className="w-3 h-3 bg-white rounded-full" />
                  </span>
                  {/* Hover tooltip */}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {spot.title}
                  </span>
                  <span className="sr-only">Go to {spot.title}</span>
                </button>
              ))}
            </div>
          </div>
          {/* Desktop: vertical drag-to-scroll, image fills width */}
          <div
            ref={desktopScrollRef}
            className="hidden sm:block w-full h-full overflow-y-auto overflow-x-hidden"
          >
            <div className="relative w-screen max-w-full mx-auto" style={{ height: "160vh", minHeight: "600px" }}>
              <Image
                src="/hero-drop.webp"
                alt="Hero Product"
                fill
                className="object-cover w-full h-full"
                priority
                sizes="100vw"
              />
              {HOTSPOTS.map((spot, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    const details = getProductDetailsByHandle(spot.shopifyHandle);
                    if (details) {
                      setSelectedProduct({ title: details.title, handle: details.handle });
                      setShowProductModal(true);
                    }
                  }}
                  className="absolute z-10 group"
                  style={{ left: spot.left, top: spot.top, transform: "translate(-50%, -50%)" }}
                >
                  <span className="block w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ripple-animate border border-white group-hover:scale-110 transition-transform">
                    <span className="w-3 h-3 bg-white rounded-full" />
                  </span>
                  {/* Hover tooltip */}
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {spot.title}
                  </span>
                  <span className="sr-only">Go to {spot.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
