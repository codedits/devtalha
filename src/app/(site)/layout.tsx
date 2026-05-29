import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ClientSideEffects from "@/components/ui/ClientSideEffects";
import { getFooter } from "@/lib/queries";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const footerData = await getFooter();

  return (
    <div className="custom-cursor-page">
      <ClientSideEffects />
      <Navbar />
      <main className="min-h-screen w-full flex flex-col">
        {children}
      </main>
      <Footer data={footerData} />
    </div>
  );
}

