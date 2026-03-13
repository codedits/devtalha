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
  getHomepageSectionOrder,
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
  const [hero, about, works, worksMeta, services, servicesMeta, processSteps, processMeta, reachus, sectionOrder] = await Promise.all([
    getHero(),
    getAbout(),
    getWorks(),
    getWorksMeta(),
    getServices(),
    getServicesMeta(),
    getProcessSteps(),
    getProcessMeta(),
    getReachus(),
    getHomepageSectionOrder(),
  ]);

  const sectionContent = {
    hero: <Hero data={hero} />,
    about: <About data={about} />,
    works: (
      <Works
        data={works}
        featuredCount={worksMeta.featured_count}
        showViewAll={works.length > worksMeta.featured_count}
        label={worksMeta.homepage_label}
        heading={worksMeta.homepage_heading}
      />
    ),
    services: <Services data={services} meta={servicesMeta} />,
    process: <Process data={processSteps} meta={processMeta} />,
    reachus: <Reachus data={reachus} />,
  } as const;

  const strengthByKey = {
    hero: 80,
    about: 100,
    works: 60,
    services: 45,
    process: 45,
    reachus: 30,
  } as const;

  const classNameByKey = {
    hero: undefined,
    about: "cv-auto",
    works: undefined,
    services: "cv-auto",
    process: "cv-auto",
    reachus: "cv-auto",
  } as const;

  return (
    <div className="flex flex-col">
      {sectionOrder.map((key, index) => (
        <SectionParallax
          key={key}
          zIndex={10 + index}
          strength={strengthByKey[key]}
          className={classNameByKey[key]}
        >
          {sectionContent[key]}
        </SectionParallax>
      ))}
    </div>
  );
}
