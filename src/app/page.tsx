import { MainLayout } from '@/components/layout/MainLayout';
import { HeroSection } from '@/components/blocks/HeroSection';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { ServicesSection } from '@/components/blocks/ServicesSection';
import { IndustrySection } from '@/components/blocks/IndustrySection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <TrustedBrands />
      <IntroSection />
      <ServicesSection />
      <IndustrySection />
      <WhyEssSection />
      <PortfolioSection />
      <BlogSection />
      {/* 
        Remaining sections can be dynamically rendered from CMS later 
        such as Why Choose Us, Portfolio, Blog/News
      */}
    </MainLayout>
  );
}
