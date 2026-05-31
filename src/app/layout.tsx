import type { Metadata } from "next";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import PageTransition from "@/components/PageTransition";
import { getSettings } from "@/lib/queries";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

export const metadata: Metadata = {
  title: "Talha Irfan — Web Developer",
  description: "Premium portfolio — Web development, modern frameworks, and AI-accelerated workflows.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const defaultTheme = settings?.default_theme || "light";

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200..800&family=Space+Grotesk:wght@300..700&display=swap" rel="stylesheet" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://framerusercontent.com" />
        <link rel="preconnect" href="https://fregldukggdkbemysbho.supabase.co" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (sessionStorage.getItem('portfolio-visited') === 'true') {
                  document.documentElement.classList.add('visited');
                }
              } catch (e) {}
              try {
                const savedTheme = localStorage.getItem('portfolio-theme');
                const theme = savedTheme || '${defaultTheme}';
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className="relative antialiased bg-background text-foreground overflow-x-hidden"
      >
        <ThemeProvider defaultTheme={defaultTheme}>
          <SmoothScroll>
            <PageTransition>
              <div className="relative min-h-screen w-full">
                {children}
              </div>
            </PageTransition>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}

