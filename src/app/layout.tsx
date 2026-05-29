import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "Talha Irfan — Web Developer",
  description: "Premium portfolio — Web development, modern frameworks, and AI-accelerated workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://framerusercontent.com" />
        <link rel="preconnect" href="https://fregldukggdkbemysbho.supabase.co" />
      </head>
      <body
        className="antialiased bg-background text-foreground overflow-x-hidden"
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

