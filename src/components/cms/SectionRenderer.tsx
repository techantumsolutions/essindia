import React from 'react';
import { StickyCardSection } from '@/components/blocks/StickyCardSection';
import { HeroSection } from '@/components/blocks/HeroSection';
import { ServicesSection } from '@/components/blocks/ServicesSection';
import { PrivacyPolicy } from '@/components/blocks/PrivacyPolicy';
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
import { EmployeeSpotlightHero } from '@/components/blocks/EmployeeSpotlightHero';
import { EmployeeSpotlightCards } from '@/components/blocks/EmployeeSpotlightCards';
import { AboutUsHero } from '@/components/blocks/AboutUsHero';
import { AboutUsCompanyIntro } from '@/components/blocks/AboutUsCompanyIntro';
import { AboutUsMissionVision } from '@/components/blocks/AboutUsMissionVision';
import { AboutUsServicesOverview } from '@/components/blocks/AboutUsServicesOverview';
import { AboutUsTransformationSection } from '@/components/blocks/AboutUsTransformationSection';
import { AboutUsWhyEss } from '@/components/blocks/AboutUsWhyEss';
import { AboutUsCta } from '@/components/blocks/AboutUsCta';
import { JudicialHero } from '@/components/blocks/JudicialHero';
import { JudicialOverview } from '@/components/blocks/JudicialOverview';
import { JudicialFeatures } from '@/components/blocks/JudicialFeatures';
import { HospitalHero } from '@/components/blocks/HospitalHero';
import { HospitalOverview } from '@/components/blocks/HospitalOverview';
import { HospitalFeatures } from '@/components/blocks/HospitalFeatures';
import { HospitalRegulatory } from '@/components/blocks/HospitalRegulatory';
import { HospitalTechSpecs } from '@/components/blocks/HospitalTechSpecs';
import { StaffingHero } from '@/components/blocks/StaffingHero';
import { StaffingAugmentation } from '@/components/blocks/StaffingAugmentation';
import { StaffingTechnologies } from '@/components/blocks/StaffingTechnologies';
import { StaffingWhyEss } from '@/components/blocks/StaffingWhyEss';
import { StaffingBenefits } from '@/components/blocks/StaffingBenefits';
import { AssHero } from '@/components/blocks/AssHero';
import { AssIntro } from '@/components/blocks/AssIntro';
import { AssFunctionalities } from '@/components/blocks/AssFunctionalities';
import { AssBenefits } from '@/components/blocks/AssBenefits';
import { AssEnterprise } from '@/components/blocks/AssEnterprise';
import { AssStats } from '@/components/blocks/AssStats';
import { AssProcess } from '@/components/blocks/AssProcess';
import { AssWhyChoose } from '@/components/blocks/AssWhyChoose';
import { AssFeaturesGrid } from '@/components/blocks/AssFeaturesGrid';
import { AssCta } from '@/components/blocks/AssCta';
import { AssClients } from '@/components/blocks/AssClients';
import { AssExperience } from '@/components/blocks/AssExperience';
import { AomHero } from '@/components/blocks/AomHero';
import { AomSolutions } from '@/components/blocks/AomSolutions';
import { AomWorkspace } from '@/components/blocks/AomWorkspace';
import { FmcgHero } from '@/components/blocks/FmcgHero';
import { FmcgLogos } from '@/components/blocks/FmcgLogos';
import { FmcgOverview } from '@/components/blocks/FmcgOverview';
import { FmcgTabs } from '@/components/blocks/FmcgTabs';
import { FmcgAction } from '@/components/blocks/FmcgAction';
import { FmcgImpact } from '@/components/blocks/FmcgImpact';
import { FmcgChallenges } from '@/components/blocks/FmcgChallenges';
import { FmcgEmpower } from '@/components/blocks/FmcgEmpower';
import { FmcgUseCases } from '@/components/blocks/FmcgUseCases';
import { FmcgIntegrations } from '@/components/blocks/FmcgIntegrations';
import { FmcgFaq } from '@/components/blocks/FmcgFaq';
import { FmcgCta } from '@/components/blocks/FmcgCta';
import { RoiHero } from '@/components/blocks/RoiHero';
import { RoiExplanation } from '@/components/blocks/RoiExplanation';
import { RoiFormula } from '@/components/blocks/RoiFormula';
import { RoiUsage } from '@/components/blocks/RoiUsage';
import { OracleHero } from '@/components/blocks/OracleHero';
import { OraclePartner } from '@/components/blocks/OraclePartner';
import { OracleWhyUpgrade } from '@/components/blocks/OracleWhyUpgrade';
import { OracleMigrationFlow } from '@/components/blocks/OracleMigrationFlow';
import { OracleFramework } from '@/components/blocks/OracleFramework';
import { OracleCta } from '@/components/blocks/OracleCta';
import { BiHero } from '@/components/blocks/BiHero';
import { BiIntro } from '@/components/blocks/BiIntro';
import { BiInsights } from '@/components/blocks/BiInsights';
import { BiTabs } from '@/components/blocks/BiTabs';
import { BiHighlightStrip } from '@/components/blocks/BiHighlightStrip';
import { BiBusinessImpact } from '@/components/blocks/BiBusinessImpact';
import { BiArchitecture } from '@/components/blocks/BiArchitecture';
import { BiEmpowerment } from '@/components/blocks/BiEmpowerment';
import { BiIndustries } from '@/components/blocks/BiIndustries';
import { BiIndustryServices } from '@/components/blocks/BiIndustryServices';
import { BiFeatures } from '@/components/blocks/BiFeatures';
import { RpaHero } from '@/components/blocks/RpaHero';
import { RpaOverview } from '@/components/blocks/RpaOverview';
import { RpaOverviewIntro } from '@/components/blocks/RpaOverviewIntro';
import { RpaOverviewMetrics } from '@/components/blocks/RpaOverviewMetrics';
import { RpaOverviewLogos } from '@/components/blocks/RpaOverviewLogos';
import { RpaIndustries } from '@/components/blocks/RpaIndustries';
import { RpaSolutions } from '@/components/blocks/RpaSolutions';
import { RpaBenefits } from '@/components/blocks/RpaBenefits';
import { RpaCapabilities } from '@/components/blocks/RpaCapabilities';
import { RpaFaq } from '@/components/blocks/RpaFaq';
import { RpaCta } from '@/components/blocks/RpaCta';
import { RpaFrameworks } from '@/components/blocks/RpaFrameworks';
import { OracleApexHero } from '@/components/blocks/OracleApexHero';
import { OracleApexIntro } from '@/components/blocks/OracleApexIntro';
import { OracleApexWhyMigrate } from '@/components/blocks/OracleApexWhyMigrate';
import { OracleApexDeliverables } from '@/components/blocks/OracleApexDeliverables';
import { OracleApexApproach } from '@/components/blocks/OracleApexApproach';
import { OracleApexCta } from '@/components/blocks/OracleApexCta';
import { EuropeHero } from '@/components/blocks/europe/EuropeHero';
import { EuropeFeatureCards } from '@/components/blocks/europe/EuropeFeatureCards';
import { EuropeDarkShowcase } from '@/components/blocks/europe/EuropeDarkShowcase';
import { EuropeGlobalPresence } from '@/components/blocks/europe/EuropeGlobalPresence';
import { EuropeCaseStudySlider } from '@/components/blocks/europe/EuropeCaseStudySlider';
import { EuropePromoCta } from '@/components/blocks/europe/EuropePromoCta';
import { EuropeProductShowcase } from '@/components/blocks/europe/EuropeProductShowcase';
import { EuropeReports } from '@/components/blocks/europe/EuropeReports';
import { EuropeAiMonitor } from '@/components/blocks/europe/EuropeAiMonitor';
import { UgandaHero } from '@/components/blocks/uganda/UgandaHero';
import { UgandaPresence } from '@/components/blocks/uganda/UgandaPresence';
import { UgandaServices } from '@/components/blocks/uganda/UgandaServices';
import { UgandaControl } from '@/components/blocks/uganda/UgandaControl';
import { UgandaCapabilities } from '@/components/blocks/uganda/UgandaCapabilities';
import { UgandaIndustries } from '@/components/blocks/uganda/UgandaIndustries';
import { UgandaInsights } from '@/components/blocks/uganda/UgandaInsights';
import { NotFoundHero } from '@/components/blocks/NotFoundHero';
import { NotFoundLinks } from '@/components/blocks/NotFoundLinks';
import { Landing1Hero } from '@/components/blocks/Landing1Hero';
import { Landing2Hero } from '@/components/blocks/Landing2Hero';
import { Landing2Intro } from '@/components/blocks/Landing2Intro';
import { Landing2Modules } from '@/components/blocks/Landing2Modules';
import { Landing2Carousel } from '@/components/blocks/Landing2Carousel';
import { Landing2Boosting } from '@/components/blocks/Landing2Boosting';
import { Landing2Accounting } from '@/components/blocks/Landing2Accounting';
import { Landing2Brands } from '@/components/blocks/Landing2Brands';
import { Landing2Capabilities } from '@/components/blocks/Landing2Capabilities';
import { Landing2Industries } from '@/components/blocks/Landing2Industries';
import { Landing2Integrations } from '@/components/blocks/Landing2Integrations';
import { Landing2Testimonials } from '@/components/blocks/Landing2Testimonials';
import { Landing2WhyEss } from '@/components/blocks/Landing2WhyEss';
import { Landing1Brands } from '@/components/blocks/Landing1Brands';
import { Landing1Intro } from '@/components/blocks/Landing1Intro';
import { Landing1Industries } from '@/components/blocks/Landing1Industries';
import { Landing1Features } from '@/components/blocks/Landing1Features';
import { Landing1Suite } from '@/components/blocks/Landing1Suite';
import { Landing1Stats } from '@/components/blocks/Landing1Stats';
import { Landing1Integration } from '@/components/blocks/Landing1Integration';
import { Landing1Process } from '@/components/blocks/Landing1Process';
import { Landing1Works } from '@/components/blocks/Landing1Works';
import { Landing1Showcase } from '@/components/blocks/Landing1Showcase';
import { Landing1Testimonials } from '@/components/blocks/Landing1Testimonials';
import { Landing1Faq } from '@/components/blocks/Landing1Faq';
import { Landing1Cta } from '@/components/blocks/Landing1Cta';
import { Landing1Challenges } from '@/components/blocks/Landing1Challenges';
import { Landing1Value } from '@/components/blocks/Landing1Value';
import { ThankYouHero } from '@/components/blocks/ThankYouHero';
import { BiTitle } from '@/components/blocks/BiTitle';





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
    case 'judicial-hero':
      return <JudicialHero content={section.content} />;
    case 'judicial-overview':
      return <JudicialOverview content={section.content} />;
    case 'judicial-features':
      return <JudicialFeatures content={section.content} />;
    case 'hospital-hero':
      return <HospitalHero content={section.content} />;
    case 'hospital-overview':
      return <HospitalOverview content={section.content} />;
    case 'hospital-features':
      return <HospitalFeatures content={section.content} />;
    case 'hospital-regulatory':
      return <HospitalRegulatory content={section.content} />;
    case 'hospital-tech-specs':
      return <HospitalTechSpecs content={section.content} />;
    case 'staffing-hero':
      return <StaffingHero content={section.content} />;
    case 'staffing-augmentation':
      return <StaffingAugmentation content={section.content} />;
    case 'staffing-technologies':
      return <StaffingTechnologies content={section.content} />;
    case 'staffing-why-ess':
      return <StaffingWhyEss content={section.content} />;
    case 'staffing-benefits':
      return <StaffingBenefits content={section.content} />;
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
    case 'privacy-policy-block':
      return <PrivacyPolicy content={section.content} />;
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
    case 'ass-hero':
      return <AssHero content={section.content} />;
    case 'ass-intro':
      return <AssIntro content={section.content} />;
    case 'ass-functionalities':
      return <AssFunctionalities content={section.content} />;
    case 'ass-benefits':
      return <AssBenefits content={section.content} />;
    case 'ass-enterprise':
      return <AssEnterprise content={section.content} />;
    case 'ass-stats':
      return <AssStats content={section.content} />;
    case 'ass-process':
      return <AssProcess content={section.content} />;
    case 'ass-why-choose':
      return <AssWhyChoose content={section.content} />;
    case 'ass-features-grid':
      return <AssFeaturesGrid content={section.content} />;
    case 'ass-cta':
      return <AssCta content={section.content} />;
    case 'ass-clients':
      return <AssClients content={section.content} />;
    case 'ass-experience':
      return <AssExperience content={section.content} />;
    case 'aom-hero':
      return <AomHero content={section.content} />;
    case 'aom-solutions':
      return <AomSolutions content={section.content} />;
    case 'aom-workspace':
      return <AomWorkspace content={section.content} />;
    case 'fmcg-hero':
      return <FmcgHero content={section.content} />;
    case 'fmcg-logos':
      return <FmcgLogos content={section.content} />;
    case 'fmcg-overview':
      return <FmcgOverview content={section.content} />;
    case 'fmcg-tabs':
      return <FmcgTabs content={section.content} />;
    case 'fmcg-action':
      return <FmcgAction content={section.content} />;
    case 'fmcg-impact':
      return <FmcgImpact content={section.content} />;
    case 'fmcg-challenges':
      return <FmcgChallenges content={section.content} />;
    case 'fmcg-empower':
      return <FmcgEmpower content={section.content} />;
    case 'fmcg-use-cases':
      return <FmcgUseCases content={section.content} />;
    case 'fmcg-integrations':
      return <FmcgIntegrations content={section.content} />;
    case 'fmcg-faq':
      return <FmcgFaq content={section.content} />;
    case 'fmcg-cta':
      return <FmcgCta content={section.content} />;
    case 'roi-hero':
      return <RoiHero content={section.content} />;
    case 'roi-explanation':
      return <RoiExplanation content={section.content} />;
    case 'roi-formula':
      return <RoiFormula content={section.content} />;
    case 'roi-usage':
      return <RoiUsage content={section.content} />;
    case 'oracle-hero':
      return <OracleHero content={section.content} />;
    case 'oracle-partner':
      return <OraclePartner content={section.content} />;
    case 'oracle-why-upgrade':
      return <OracleWhyUpgrade content={section.content} />;
    case 'oracle-migration-flow':
      return <OracleMigrationFlow content={section.content} />;
    case 'oracle-framework':
      return <OracleFramework content={section.content} />;
    case 'oracle-cta':
      return <OracleCta content={section.content} />;
    case 'bi-hero':
      return <BiHero content={section.content} />;
    case 'bi-intro':
      return <BiIntro content={section.content} />;
    case 'bi-insights':
      return <BiInsights content={section.content} />;
    case 'bi-title':
      return <BiTitle content={section.content} />;
    case 'bi-tabs':
      return <BiTabs content={section.content} />;
    case 'bi-highlight-strip':
      return <BiHighlightStrip content={section.content} />;
    case 'bi-business-impact':
      return <BiBusinessImpact content={section.content} />;
    case 'bi-architecture':
      return <BiArchitecture content={section.content} />;
    case 'bi-empowerment':
      return <BiEmpowerment content={section.content} />;
    case 'bi-industries':
      return <BiIndustries content={section.content} />;
    case 'bi-industry-services':
      return <BiIndustryServices content={section.content} />;
    case 'bi-features':
      return <BiFeatures content={section.content} />;
    case 'rpa-hero':
      return <RpaHero content={section.content} />;
    case 'rpa-overview':
      return <RpaOverview content={section.content} />;
    case 'rpa-overview-intro':
      return <RpaOverviewIntro content={section.content} />;
    case 'rpa-overview-metrics':
      return <RpaOverviewMetrics content={section.content} />;
    case 'rpa-overview-logos':
      return <RpaOverviewLogos content={section.content} />;
    case 'rpa-industries':
      return <RpaIndustries content={section.content} />;
    case 'rpa-solutions':
      return <RpaSolutions content={section.content} />;
    case 'rpa-frameworks':
      return <RpaFrameworks content={section.content} />;
    case 'rpa-benefits':
      return <RpaBenefits content={section.content} />;
    case 'rpa-capabilities':
      return <RpaCapabilities content={section.content} />;
    case 'rpa-faq':
      return <RpaFaq content={section.content} />;
    case 'rpa-cta':
      return <RpaCta content={section.content} />;
    case 'oracle-apex-hero':
      return <OracleApexHero content={section.content} />;
    case 'oracle-apex-intro':
      return <OracleApexIntro content={section.content} />;
    case 'oracle-apex-why-migrate':
      return <OracleApexWhyMigrate content={section.content} />;
    case 'oracle-apex-deliverables':
      return <OracleApexDeliverables content={section.content} />;
    case 'oracle-apex-approach':
      return <OracleApexApproach content={section.content} />;
    case 'oracle-apex-cta':
      return <OracleApexCta content={section.content} />;
    case 'europe-hero':
      return <EuropeHero content={section.content} />;
    case 'europe-feature-cards':
      return <EuropeFeatureCards content={section.content} />;
    case 'europe-dark-showcase':
      return <EuropeDarkShowcase content={section.content} />;
    case 'europe-global-presence':
      return <EuropeGlobalPresence content={section.content} />;
    case 'europe-case-study-slider':
      return <EuropeCaseStudySlider content={section.content} />;
    case 'europe-promo-cta':
      return <EuropePromoCta content={section.content} />;
    case 'europe-product-showcase':
      return <EuropeProductShowcase content={section.content} />;
    case 'europe-ai-monitor':
      return <EuropeAiMonitor content={section.content} />;
    case 'europe-reports':
      return <EuropeReports content={section.content} />;
    case 'uganda-hero':
      return <UgandaHero content={section.content} />;
    case 'uganda-presence':
      return <UgandaPresence content={section.content} />;
    case 'uganda-services':
      return <UgandaServices content={section.content} />;
    case 'uganda-control':
      return <UgandaControl content={section.content} />;
    case 'uganda-capabilities':
      return <UgandaCapabilities content={section.content} />;
    case 'uganda-industries':
      return <UgandaIndustries content={section.content} />;
    case 'uganda-insights':
      return <UgandaInsights content={section.content} />;
    case 'not-found-hero':
      return <NotFoundHero content={section.content} />;
    case 'not-found-links':
      return <NotFoundLinks content={section.content} />;
    case 'thank-you-hero':
      return <ThankYouHero content={section.content} />;
    case 'landing1-hero':
      return <Landing1Hero content={section.content} />;
    case 'landing2-hero':
      return <Landing2Hero content={section.content} />;
    case 'landing2-intro':
      return <Landing2Intro content={section.content} />;
    case 'landing2-modules':
      return <Landing2Modules content={section.content} />;
    case 'landing2-carousel':
      return <Landing2Carousel content={section.content} />;
    case 'landing2-boosting':
      return <Landing2Boosting content={section.content} />;
    case 'landing2-accounting':
      return <Landing2Accounting content={section.content} />;
    case 'landing2-brands':
      return <Landing2Brands content={section.content} />;
    case 'landing2-capabilities':
      return <Landing2Capabilities content={section.content} />;
    case 'landing2-industries':
      return <Landing2Industries content={section.content} />;
    case 'landing2-integrations':
      return <Landing2Integrations content={section.content} />;
    case 'landing2-testimonials':
      return <Landing2Testimonials content={section.content} />;
    case 'landing2-why-ess':
      return <Landing2WhyEss content={section.content} />;
    case 'landing1-brands':
      return <Landing1Brands content={section.content} />;
    case 'landing1-intro':
      return <Landing1Intro content={section.content} />;
    case 'landing1-industries':
      return <Landing1Industries content={section.content} />;
    case 'landing1-features':
      return <Landing1Features content={section.content} />;
    case 'landing1-suite':
      return <Landing1Suite content={section.content} />;
    case 'landing1-stats':
      return <Landing1Stats content={section.content} />;
    case 'landing1-integration':
      return <Landing1Integration content={section.content} />;
    case 'landing1-process':
      return <Landing1Process content={section.content} />;
    case 'landing1-works':
      return <Landing1Works content={section.content} />;
    case 'landing1-showcase':
      return <Landing1Showcase content={section.content} />;
    case 'landing1-testimonials':
      return <Landing1Testimonials content={section.content} />;
    case 'landing1-faq':
      return <Landing1Faq content={section.content} />;
    case 'landing1-cta':
      return <Landing1Cta content={section.content} />;
    case 'landing1-challenges':
      return <Landing1Challenges content={section.content} />;
    case 'landing1-value':
      return <Landing1Value content={section.content} />;
    case 'sticky-card':
      return <StickyCardSection content={section.content} />;

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
