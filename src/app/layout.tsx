import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooter } from "@/lib/queries";
import { ThemeTransitionWrapper } from "../components/ThemeTransitionWrapper";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Talha Irfan — Web Developer",
  description: "Premium portfolio — Web development, modern frameworks, and AI-accelerated workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const footerData = await getFooter();

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://framerusercontent.com" />
        <link rel="preconnect" href="https://fregldukggdkbemysbho.supabase.co" />
      </head>
      <body
        className={`${plusJakartaSans.variable} ${spaceGrotesk.variable} antialiased bg-background text-foreground`}
      >
        <ThemeTransitionWrapper>
          <div className="min-h-screen w-full">
            <Navbar />
            <main className="min-h-screen w-full flex flex-col gap-10 md:gap-14">
              {children}
            </main>
            <Footer data={footerData} />
          </div>
        </ThemeTransitionWrapper>
      </body>
    </html>
  );
}
