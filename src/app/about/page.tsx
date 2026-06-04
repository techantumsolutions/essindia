import { MainLayout } from '@/components/layout/MainLayout';
import { AboutUsHero } from '@/components/blocks/AboutUsHero';
import { AboutUsCompanyIntro } from '@/components/blocks/AboutUsCompanyIntro';
import { AboutUsMissionVision } from '@/components/blocks/AboutUsMissionVision';
import { AboutUsServicesOverview } from '@/components/blocks/AboutUsServicesOverview';
import { AboutUsTransformationSection } from '@/components/blocks/AboutUsTransformationSection';
import { AboutUsWhyEss } from '@/components/blocks/AboutUsWhyEss';
import { AboutUsCta } from '@/components/blocks/AboutUsCta';

export const metadata = {
  title: 'About Us | ESS India',
  description: 'Enterprise ERP solutions, software migration, and custom digital transformation services.',
};

export default function AboutPage() {
  return (
    <MainLayout>
      <AboutUsHero />
      <AboutUsCompanyIntro />
      <AboutUsMissionVision />
      <AboutUsServicesOverview />
      <AboutUsTransformationSection />
      <AboutUsWhyEss />
      <AboutUsCta />
    </MainLayout>
  );
}
