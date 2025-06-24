import Image from "next/image";
import Link from "next/link";

// Aspect ratio of the hero image (width / height)
const HERO_IMAGE_ASPECT_RATIO = 2000 / 1200; // ≈ 1.67

// Hotspot data: position as % of image, and product handle
const HOTSPOTS = [
  { left: "25%", top: "40%", handle: "lamp" },
  { left: "70%", top: "80%", handle: "couch" },
  { left: "50%", top: "20%", handle: "table" },
];

export default function Home() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-black flex items-center justify-center">
      {/* Responsive scrollable hero image with hotspots */}
      <div className="relative w-full h-full flex items-center justify-center">
        {/* Mobile: horizontal scroll, image fills height */}
        <div className="block sm:hidden w-full h-full overflow-x-auto overflow-y-hidden">
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
                <span className="block w-8 h-8 bg-white/80 border-2 border-black rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:scale-110 transition-all cursor-pointer">
                  <span className="w-3 h-3 bg-black rounded-full" />
                </span>
                <span className="sr-only">Go to {spot.handle}</span>
              </Link>
            ))}
          </div>
        </div>
        {/* Desktop: vertical scroll, image fills width */}
        <div className="hidden sm:block w-full h-full overflow-y-auto overflow-x-hidden">
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
                <span className="block w-8 h-8 bg-white/80 border-2 border-black rounded-full flex items-center justify-center shadow-lg hover:bg-primary-500 hover:scale-110 transition-all cursor-pointer">
                  <span className="w-3 h-3 bg-black rounded-full" />
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
