"use client";
import Image from "next/image";
import Link from "next/link";
import { useDragScroll } from "./useDragScroll";

// Landing page with responsive hero image and drag-to-scroll hotspots
const HERO_IMAGE_ASPECT_RATIO = 2000 / 1200; // ≈ 1.67
const HOTSPOTS = [
  { left: "25%", top: "40%", handle: "tree" },
  { left: "45%", top: "75%", handle: "table" },
  { left: "45%", top: "30%", handle: "lamp" },
  { left: "65%", top: "66%", handle: "couch" },
  { left: "45%", top: "61%", handle: "pillow" },
];

export default function Home() {
  const mobileScrollRef = useDragScroll();
  const desktopScrollRef = useDragScroll();

  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
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
              <Link
                key={idx}
                href={`/product/${spot.handle}`}
                className="absolute z-10"
                style={{
                  left: spot.left,
                  top: spot.top,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="block w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ripple-animate border border-white">
                  <span className="w-3 h-3 bg-white rounded-full" />
                </span>
                <span className="sr-only">Go to {spot.handle}</span>
              </Link>
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
              <Link
                key={idx}
                href={`/product/${spot.handle}`}
                className="absolute z-10"
                style={{
                  left: spot.left,
                  top: spot.top,
                  transform: "translate(-50%, -50%)",
                }}
              >
                <span className="block w-8 h-8 rounded-full flex items-center justify-center cursor-pointer ripple-animate border border-white">
                  <span className="w-3 h-3 bg-white rounded-full" />
                </span>
                <span className="sr-only">Go to {spot.handle}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
