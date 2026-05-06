import React from 'react';
import { HeroSection } from '@/components/blocks/HeroSection';
import { ServicesSection } from '@/components/blocks/ServicesSection';
import { IndustrySection } from '@/components/blocks/IndustrySection';
import { TrustedBrands } from '@/components/blocks/TrustedBrands';
import { IntroSection } from '@/components/blocks/IntroSection';
import { WhyEssSection } from '@/components/blocks/WhyEssSection';
import { PortfolioSection } from '@/components/blocks/PortfolioSection';
import { BlogSection } from '@/components/blocks/BlogSection';

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
