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
import { RetailWhyErp } from '@/components/blocks/RetailWhyErp';
import ManufacturingHero from '@/components/blocks/ManufacturingHero';
import ManufacturingIconRow from '@/components/blocks/ManufacturingIconRow';
import ManufacturingDemand from '@/components/blocks/ManufacturingDemand';
import ManufacturingProcess from '@/components/blocks/ManufacturingProcess';
import ManufacturingEfficiency from '@/components/blocks/ManufacturingEfficiency';
import ManufacturingModels from '@/components/blocks/ManufacturingModels';
import CareerHero from '@/components/blocks/CareerHero';
import CareerWhyJoin from '@/components/blocks/CareerWhyJoin';
import CareerOffices from '@/components/blocks/CareerOffices';
import CareerExperience from '@/components/blocks/CareerExperience';
import CareerPerks from '@/components/blocks/CareerPerks';
import CareerLife from '@/components/blocks/CareerLife';
import CareerPositions from '@/components/blocks/CareerPositions';
import CareerCta from '@/components/blocks/CareerCta';
import JobDetailHero from '@/components/blocks/JobDetailHero';
import JobDetailContent from '@/components/blocks/JobDetailContent';
import { BlogListSection } from '@/components/blocks/BlogListSection';
import { BlogDetailSection } from '@/components/blocks/BlogDetailSection';
import { CaseStudyListSection } from '@/components/blocks/CaseStudyListSection';
import { CaseStudyDetailSection } from '@/components/blocks/CaseStudyDetailSection';
import { QualityHero } from '@/components/blocks/QualityHero';
import { QualityContent } from '@/components/blocks/QualityContent';
import { TestimonialsSection } from '@/components/blocks/TestimonialsSection';
import { ContactHero } from '@/components/blocks/ContactHero';
import { ContactInfoCards } from '@/components/blocks/ContactInfoCards';
import { ContactFormFaq } from '@/components/blocks/ContactFormFaq';
import { ContactLocations } from '@/components/blocks/ContactLocations';
import { ContactMap } from '@/components/blocks/ContactMap';
import { EmployeeSpotlightHero } from '@/components/blocks/EmployeeSpotlightHero';
import { EmployeeSpotlightCards } from '@/components/blocks/EmployeeSpotlightCards';
import { AboutUsHero } from '@/components/blocks/AboutUsHero';
import { AboutUsCompanyIntro } from '@/components/blocks/AboutUsCompanyIntro';
import { AboutUsMissionVision } from '@/components/blocks/AboutUsMissionVision';
import { AboutUsServicesOverview } from '@/components/blocks/AboutUsServicesOverview';
import { AboutUsTransformationSection } from '@/components/blocks/AboutUsTransformationSection';
import { AboutUsWhyEss } from '@/components/blocks/AboutUsWhyEss';
import { AboutUsCta } from '@/components/blocks/AboutUsCta';
import { RetailWhyErp } from '@/components/blocks/RetailWhyErp';

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
    case 'retail-why-erp':
      return <RetailWhyErp content={section.content} />;
    case 'mfg-hero':
      return <ManufacturingHero content={section.content} />;
    case 'mfg-icons':
      return <ManufacturingIconRow content={section.content} />;
    case 'mfg-demand':
      return <ManufacturingDemand content={section.content} />;
    case 'mfg-process':
      return <ManufacturingProcess content={section.content} />;
    case 'mfg-efficiency':
      return <ManufacturingEfficiency content={section.content} />;
    case 'mfg-models':
      return <ManufacturingModels content={section.content} />;
    case 'career-hero':
      return <CareerHero content={section.content} />;
    case 'career-why-join':
      return <CareerWhyJoin content={section.content} />;
    case 'career-offices':
      return <CareerOffices content={section.content} />;
    case 'career-experience':
      return <CareerExperience content={section.content} />;
    case 'career-perks':
      return <CareerPerks content={section.content} />;
    case 'career-life':
      return <CareerLife content={section.content} />;
    case 'career-positions':
      return <CareerPositions content={section.content} />;
    case 'career-cta':
      return <CareerCta content={section.content} />;
    case 'job-detail-hero':
      return <JobDetailHero content={section.content} />;
    case 'job-detail-content':
      return <JobDetailContent content={section.content} />;
    case 'blog-list-block':
      return <BlogListSection content={section.content} />;
    case 'blog-detail-block':
      return <BlogDetailSection content={section.content} />;
    case 'case-study-list':
      return <CaseStudyListSection content={section.content} />;
    case 'case-study-detail':
      return <CaseStudyDetailSection content={section.content} />;
    case 'quality-hero':
      return <QualityHero content={section.content} />;
    case 'quality-content':
      return <QualityContent content={section.content} />;
    case 'testimonials-block':
      return <TestimonialsSection content={section.content} />;
    case 'contact-hero':
      return <ContactHero content={section.content} />;
    case 'contact-info-cards':
      return <ContactInfoCards content={section.content} />;
    case 'contact-form-faq':
      return <ContactFormFaq content={section.content} />;
    case 'contact-locations':
      return <ContactLocations content={section.content} />;
    case 'contact-map':
      return <ContactMap content={section.content} />;
    case 'employee-spotlight-hero':
      return <EmployeeSpotlightHero content={section.content} />;
    case 'employee-spotlight-cards':
      return <EmployeeSpotlightCards content={section.content} />;
    case 'about-us-hero':
      return <AboutUsHero content={section.content} />;
    case 'about-us-company-intro':
      return <AboutUsCompanyIntro content={section.content} />;
    case 'about-us-mission-vision':
      return <AboutUsMissionVision content={section.content} />;
    case 'about-us-services-overview':
      return <AboutUsServicesOverview content={section.content} />;
    case 'about-us-transformation-section':
      return <AboutUsTransformationSection content={section.content} />;
    case 'about-us-why-ess':
      return <AboutUsWhyEss content={section.content} />;
    case 'about-us-cta':
      return <AboutUsCta content={section.content} />;
    case 'retail-why-erp':
      return <RetailWhyErp content={section.content} />;
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
