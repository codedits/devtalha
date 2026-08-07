import dynamic from "next/dynamic";
import { SectionParallax } from "@/components/SectionParallax";

const Hero = dynamic(() => import("@/components/Hero"));
const About = dynamic(() => import("@/components/About"));
const WhyChooseUs = dynamic(() => import("@/components/WhyChooseUs"));
const Works = dynamic(() => import("@/components/Works"));
const Services = dynamic(() => import("@/components/Services"));
const Process = dynamic(() => import("@/components/Process"));
const Supasection = dynamic(() => import("@/components/Supasection"));
const Reachus = dynamic(() => import("@/components/Reachus"));
import {
  type HomepageSectionKey,
} from "@/lib/admin/homepageSections";
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
  getWhyChooseUs,
  getSupasection,
} from "@/lib/queries";

export const revalidate = 604800; // 7 days in seconds

export default async function Home() {
  // Fetch all sections in parallel
  const [
    hero,
    about,
    why,
    works,
    worksMeta,
    services,
    servicesMeta,
    processSteps,
    processMeta,
    supasection,
    reachus,
    sectionOrder,
  ] = await Promise.all([
    getHero(),
    getAbout(),
    getWhyChooseUs(),
    getWorks(),
    getWorksMeta(),
    getServices(),
    getServicesMeta(),
    getProcessSteps(),
    getProcessMeta(),
    getSupasection(),
    getReachus(),
    getHomepageSectionOrder(),
  ]);

  const sectionContent = {
    hero: <Hero data={hero} />,
    about: <About data={about} />,
    why: <WhyChooseUs data={why} />,
    works: (
      <Works
        data={works}
        featuredCount={worksMeta.featured_count}
        showViewAll={true}
        label={worksMeta.homepage_label}
        heading={worksMeta.homepage_heading}
      />
    ),
    services: <Services data={services} meta={servicesMeta} />,
    process: <Process data={processSteps} meta={processMeta} />,
    supasection: <Supasection data={supasection} />,
    reachus: <Reachus data={reachus} />,
  } as const;

  const strengthByKey = {
    hero: 80,
    about: 100,
    why: 0,
    works: 0,
    services: 45,
    process: 45,
    supasection: 0,
    reachus: 30,
  } as const;

  const classNameByKey = {
    hero: undefined,
    about: "cv-auto",
    why: "cv-auto",
    works: undefined,
    services: "cv-auto",
    process: "cv-auto",
    supasection: undefined,
    reachus: "cv-auto",
  } as const;

  return (
    <div className="flex flex-col">
      {sectionOrder.map((key: HomepageSectionKey, index: number) => (
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

