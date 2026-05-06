'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';

interface Project {
  title: string;
  tags: string[];
  image: string;
  link: string;
}

interface PortfolioContent {
  heading?: string;
  subheading?: string;
  projects?: Project[];
  viewAllCta?: { label: string; url: string };
}

interface PortfolioSectionProps {
  content?: PortfolioContent;
}

const defaultPortfolios = [
  {
    title: 'Workflow System Energy',
    tags: ['Oil & gas'],
    image: '/portfolio-1.png',
    link: '#',
  },
  {
    title: 'SaaS for End to-End Analytics',
    tags: ['ecommerce', 'Custom software'],
    image: '/portfolio-2.png',
    link: '#',
  },
  {
    title: 'Workload Management',
    tags: ['Web development', 'Custom software'],
    image: '/portfolio-3.png',
    link: '#',
  },
];

export function PortfolioSection({ content }: PortfolioSectionProps) {
  const heading = content?.heading || "Real Work. Real Results.";
  const subheading = content?.subheading || "Explore the ESS story, a legacy of transformation across high-end brands and verticals.";
  const projects = content?.projects || defaultPortfolios;
  const viewAllCta = content?.viewAllCta || { label: "View All Work", url: "/portfolio" };

  return (
    <section className="py-24 bg-[#F2F6F9] overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <TextReveal 
            as="h2"
            text={heading}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight justify-center"
          />
          <MotionSection variant="fadeUp" delay={0.4}>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Carousel / Grid Container */}
        <div className="relative flex items-center justify-center">
          
          {/* Left Arrow */}
          <button className="hidden xl:flex absolute left-0 z-10 w-14 h-14 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95">
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Grid */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:px-24 w-full">
            {projects.map((portfolio, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
                  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                className="flex flex-col group cursor-pointer"
              >
                {/* Image */}
                <div className="rounded-[32px] overflow-hidden bg-slate-200 aspect-[4/3] shadow-lg mb-8 relative">
                  <motion.img 
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={portfolio.image} 
                    alt={portfolio.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  {/* Subtle overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-[#4B2A63]/10 transition-colors duration-500" />
                </div>

                {/* Content */}
                <h3 className="text-[24px] font-bold text-[#4B2A63] mb-4 tracking-tight group-hover:text-black transition-colors">
                  {portfolio.title}
                </h3>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {portfolio.tags?.map(tag => (
                    <span 
                      key={tag} 
                      className="bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-500 px-4 py-1.5 rounded-full text-[11px] font-bold tracking-wider uppercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Link */}
                <div className="flex items-center text-slate-900 text-[15px] font-bold group-hover:text-[#4B2A63] transition-all duration-300 mt-auto cursor-pointer">
                  Explore Project <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1.5" />
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

          {/* Right Arrow */}
          <button className="hidden xl:flex absolute right-0 z-10 w-14 h-14 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95">
            <ChevronRight className="w-6 h-6" />
          </button>

        </div>

        {/* View All Button */}
        <MotionSection variant="fadeUp" delay={0.6} className="mt-20 text-center">
          <Button 
            onClick={() => window.location.href = viewAllCta.url}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-12 h-[54px] text-[16px] font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            {viewAllCta.label}
          </Button>
        </MotionSection>

      </div>
    </section>
  );
}
