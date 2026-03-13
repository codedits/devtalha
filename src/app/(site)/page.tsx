import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Works from "@/components/Works";
import Services from "@/components/Services";
import Process from "@/components/Process";
import Reachus from "@/components/Reachus";
import { SectionParallax } from "@/components/SectionParallax";
import {
  getHero,
  getAbout,
  getWorks,
  getWorksMeta,
  getServices,
  getServicesMeta,
  getProcessSteps,
  getProcessMeta,
  getReachus,
} from "@/lib/queries";

export const revalidate = 604800; // 7 days in seconds

export default async function Home() {
  // Fetch all sections in parallel
  const [hero, about, works, worksMeta, services, servicesMeta, processSteps, processMeta, reachus] = await Promise.all([
    getHero(),
    getAbout(),
    getWorks(),
    getWorksMeta(),
    getServices(),
    getServicesMeta(),
    getProcessSteps(),
    getProcessMeta(),
    getReachus(),
  ]);

  return (
    <div className="flex flex-col">
      <SectionParallax zIndex={10} strength={80}>
        <Hero data={hero} />
      </SectionParallax>
      
      <SectionParallax zIndex={11} className="cv-auto">
        <About data={about} />
      </SectionParallax>

      <SectionParallax zIndex={12} strength={60}>
        <Works
          data={works}
          featuredCount={worksMeta.featured_count}
          showViewAll={works.length > worksMeta.featured_count}
          label={worksMeta.homepage_label}
          heading={worksMeta.homepage_heading}
        />
      </SectionParallax>

      <div className="flex flex-col">
        <SectionParallax zIndex={13} strength={45} className="cv-auto">
          <Services data={services} meta={servicesMeta} />
        </SectionParallax>

        <SectionParallax zIndex={14} strength={45} className="cv-auto">
          <Process data={processSteps} meta={processMeta} />
        </SectionParallax>
      </div>

      <SectionParallax zIndex={15} strength={30} className="cv-auto">
        <Reachus data={reachus} />
      </SectionParallax>
    </div>
  );
}
