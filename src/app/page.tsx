import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Reachus from "@/components/Reachus";
import Footer from "@/components/Footer";
import { SectionParallax } from "@/components/SectionParallax";
import { PORTFOLIO_CACHE_REVALIDATE_SECONDS } from "@/lib/admin/cache";
import { getHero, getAbout, getWorks, getServices, getProcessSteps, getReachus, getFooter } from "@/lib/queries";

export const revalidate = PORTFOLIO_CACHE_REVALIDATE_SECONDS;

export default async function Home() {
  // Fetch all sections in parallel
  const [hero, about, works, services, processSteps, reachus, footer] = await Promise.all([
    getHero(),
    getAbout(),
    getWorks(),
    getServices(),
    getProcessSteps(),
    getReachus(),
    getFooter(),
  ]);

  return (
    <div className="flex flex-col gap-10 md:gap-14">
      <SectionParallax zIndex={10} strength={80}>
        <Hero data={hero} />
      </SectionParallax>
      
      <SectionParallax zIndex={11} className="cv-auto">
        <About data={about} />
      </SectionParallax>

      <SectionParallax zIndex={12} strength={60} className="cv-auto">
        <Works
          data={works}
          featuredCount={4}
          showViewAll
          label="[ FEATURED PROJECTS ]"
        />
      </SectionParallax>

      <SectionParallax zIndex={13} strength={40} className="cv-auto">
        <Services data={services} />
      </SectionParallax>

      <SectionParallax zIndex={14} strength={50} className="cv-auto">
        <Process data={processSteps} />
      </SectionParallax>

      <SectionParallax zIndex={15} strength={30} className="cv-auto">
        <Reachus data={reachus} />
      </SectionParallax>
    </div>
  );
}
