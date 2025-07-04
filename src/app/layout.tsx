import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import { CartProvider } from "./components/CartContext";
import { CartDrawerProvider } from './components/CartDrawerProvider';
import SlideCartWrapper from './components/SlideCartWrapper';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Interior Related",
  description: "Inspired By Drake-Related",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <CartProvider>
          <CartDrawerProvider>
            <NavBar />
            {children}
            <Footer />
            <SlideCartWrapper />
          </CartDrawerProvider>
        </CartProvider>
      </body>
    </html>
  );
}
