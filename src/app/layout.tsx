import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Talha Irfan — Web Developer",
  description: "Premium portfolio — Web development, modern frameworks, and AI-accelerated workflows.",
};

import PageTransition from "@/components/PageTransition";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://framerusercontent.com" />
        <link rel="preconnect" href="https://fregldukggdkbemysbho.supabase.co" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground overflow-x-hidden`}
      >
        <SmoothScroll>
          <PageTransition>
            <div className="min-h-screen w-full">
              {children}
            </div>
          </PageTransition>
        </SmoothScroll>
      </body>
    </html>
  );
}
