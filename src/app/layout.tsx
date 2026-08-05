import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { getSettings } from "@/lib/queries";
import { ThemeProvider } from "@/components/ui/ThemeProvider";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
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
  const settings = await getSettings();
  const defaultTheme = settings?.default_theme || "light";

  return (
    <html 
      lang="en" 
      suppressHydrationWarning 
      data-scroll-behavior="smooth"
      className={`${plusJakartaSans.variable} ${spaceGrotesk.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Preconnect to essential origins only (Max 2 origins to prevent warnings) */}
        <link rel="preconnect" href="https://fregldukggdkbemysbho.supabase.co" />
        <link rel="preconnect" href="https://images.unsplash.com" />
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
        className="relative antialiased bg-background text-foreground overflow-x-hidden font-sans"
      >
        <ThemeProvider defaultTheme={defaultTheme}>
          <div className="relative min-h-screen w-full">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
