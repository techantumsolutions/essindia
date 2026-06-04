import React from 'react';
import { HeroSection } from '@/components/blocks/HeroSection';
import { ServicesSection } from '@/components/blocks/ServicesSection';
import { IndustrySection } from '@/components/blocks/IndustrySection';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';
import { ErpHero } from '@/components/blocks/ErpHero';
import { ErpIntro } from '@/components/blocks/ErpIntro';
import { ErpModulesGrid } from '@/components/blocks/ErpModulesGrid';
import { ErpFeaturesTab } from '@/components/blocks/ErpFeaturesTab';
import { ErpValueGrid } from '@/components/blocks/ErpValueGrid';
import { ErpTransform } from '@/components/blocks/ErpTransform';
import { RetailHero } from '@/components/blocks/RetailHero';
import { RetailNurture } from '@/components/blocks/RetailNurture';
import { RetailFeatures } from '@/components/blocks/RetailFeatures';
import { RetailOperations } from '@/components/blocks/RetailOperations';
import { RetailMobileDashboard } from '@/components/blocks/RetailMobileDashboard';
import { RetailClients } from '@/components/blocks/RetailClients';
import ManufacturingHero from '@/components/blocks/ManufacturingHero';
import ManufacturingIconRow from '@/components/blocks/ManufacturingIconRow';
import ManufacturingDemand from '@/components/blocks/ManufacturingDemand';
import ManufacturingProcess from '@/components/blocks/ManufacturingProcess';
import ManufacturingEfficiency from '@/components/blocks/ManufacturingEfficiency';
import ManufacturingModels from '@/components/blocks/ManufacturingModels';
import { AboutUsHero } from '@/components/blocks/AboutUsHero';
import { AboutUsCompanyIntro } from '@/components/blocks/AboutUsCompanyIntro';
import { AboutUsMissionVision } from '@/components/blocks/AboutUsMissionVision';
import { AboutUsServicesOverview } from '@/components/blocks/AboutUsServicesOverview';
import { AboutUsTransformationSection } from '@/components/blocks/AboutUsTransformationSection';
import { AboutUsWhyEss } from '@/components/blocks/AboutUsWhyEss';
import { AboutUsCta } from '@/components/blocks/AboutUsCta';

interface Section {
  id: string;
  type: string;
  content: any;
}

interface SectionRendererProps {
  section: Section;
}

export function SectionRenderer({ section }: SectionRendererProps) {
  switch (section.type) {
    case 'hero':
      return <HeroSection content={section.content} />;
    case 'trusted-brands':
      return <TrustedBrands content={section.content} />;
    case 'intro':
      return <IntroSection content={section.content} />;
    case 'services':
      return <ServicesSection content={section.content} />;
    case 'industries':
      return <IndustrySection content={section.content} />;
    case 'why-ess':
      return <WhyEssSection content={section.content} />;
    case 'portfolio':
      return <PortfolioSection content={section.content} />;
    case 'blog':
      return <BlogSection content={section.content} />;
    case 'rich_text':
      return (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4 md:px-8 max-w-7xl prose prose-slate lg:prose-lg">
            <div dangerouslySetInnerHTML={{ __html: section.content.html || '' }} />
          </div>
        </section>
      );
    case 'erp-hero':
      return <ErpHero content={section.content} />;
    case 'erp-intro':
      return <ErpIntro content={section.content} />;
    case 'erp-modules':
      return <ErpModulesGrid content={section.content} />;
    case 'erp-features':
      return <ErpFeaturesTab content={section.content} />;
    case 'erp-value':
      return <ErpValueGrid content={section.content} />;
    case 'erp-transform':
      return <ErpTransform content={section.content} />;
    case 'retail-hero':
      return <RetailHero content={section.content} />;
    case 'retail-nurture':
      return <RetailNurture content={section.content} />;
    case 'retail-features':
      return <RetailFeatures content={section.content} />;
    case 'retail-operations':
      return <RetailOperations content={section.content} />;
    case 'retail-mobile-dashboard':
      return <RetailMobileDashboard content={section.content} />;
    case 'retail-clients':
      return <RetailClients content={section.content} />;
    case 'mfg-hero':
      return <ManufacturingHero />;
    case 'mfg-icons':
      return <ManufacturingIconRow />;
    case 'mfg-demand':
      return <ManufacturingDemand />;
    case 'mfg-process':
      return <ManufacturingProcess />;
    case 'mfg-efficiency':
      return <ManufacturingEfficiency />;
    case 'mfg-models':
      return <ManufacturingModels />;
    case 'AboutUsHero':
      return <AboutUsHero content={section.content} />;
    case 'AboutUsCompanyIntro':
      return <AboutUsCompanyIntro content={section.content} />;
    case 'AboutUsMissionVision':
      return <AboutUsMissionVision content={section.content} />;
    case 'AboutUsServicesOverview':
      return <AboutUsServicesOverview content={section.content} />;
    case 'AboutUsTransformationSection':
      return <AboutUsTransformationSection content={section.content} />;
    case 'AboutUsWhyEss':
      return <AboutUsWhyEss content={section.content} />;
    case 'AboutUsCta':
      return <AboutUsCta content={section.content} />;
    default:
      if (process.env.NODE_ENV === 'development') {
        return (
          <div className="p-4 bg-red-100 text-red-800 rounded">
            Unknown section type: {section.type}
          </div>
        );
      }
      return null;
  }
}
