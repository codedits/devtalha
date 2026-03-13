import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getFooter } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooter();

  return (
    <>
      <Navbar />
      <main className="min-h-screen w-full flex flex-col">
        {children}
      </main>
      <Footer data={footerData} />
    </>
  );
}
