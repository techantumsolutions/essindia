'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection } from '@/components/animations/MotionSection';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface Industry {
  name: string;
  description: string;
  image: string;
}

interface IndustryContent {
  heading?: string;
  subheading?: string;
  description?: string;
  industries?: Industry[];
  bgColor?: string;
  headingTextColor?: string;
  subheadingTextColor?: string;
  descriptionTextColor?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonHoverBgColor?: string;
  buttonTextColor?: string;
  buttonHoverTextColor?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  pdfUrl?: string;
  viewAllCta?: { label?: string; url?: string; formType?: string; pdfUrl?: string };
}

interface IndustrySectionProps {
  content?: IndustryContent;
}

const defaultIndustries = [
  { 
    name: 'Manufacturing industry', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-manufacturing.png' 
  },
  { 
    name: 'HealthCare', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-healthcare.png' 
  },
  { 
    name: 'Logistics', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-logistics.png' 
  },
  { 
    name: 'Custom ERP Solution', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-erp.png' 
  },
];

export function IndustrySection({ content }: IndustrySectionProps) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const heading = content?.heading || "Choose the Industry Expert";
  const subheading = content?.subheading || "Designed for the way your industry works.";
  const description = content?.description || "From manufacturing to services, ESS understands the workflows behind real business operations. We infuse our extensive industry expertise into every solution, tailoring our approach to the specific realities of each industry rather than relying on generic software thinking.";
  const industries = content?.industries || defaultIndustries;

  const bgColor = content?.bgColor || '#462885';
  const headingTextColor = content?.headingTextColor || '#ffffff';
  const subheadingTextColor = content?.subheadingTextColor || 'rgba(255,255,255,0.9)';
  const descriptionTextColor = content?.descriptionTextColor || 'rgba(255,255,255,0.7)';

  const btnText = content?.buttonText || content?.viewAllCta?.label || "View all INDUSTRIES";
  const btnUrl = content?.buttonUrl || content?.viewAllCta?.url || "/industries";
  const btnFormType = (content?.buttonFormType || content?.viewAllCta?.formType || '') as CtaFormType;
  const pdfUrl = content?.pdfUrl || content?.viewAllCta?.pdfUrl;

  const buttonBgColor = content?.buttonBgColor || '#ffffff';
  const buttonHoverBgColor = content?.buttonHoverBgColor || '#f8fafc';
  const buttonTextColor = content?.buttonTextColor || '#462885';
  const buttonHoverTextColor = content?.buttonHoverTextColor;

  const { handleClick, modalNode } = useCtaAction(btnUrl, btnFormType, pdfUrl);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5);
    }
  }, []);

  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      window.addEventListener('resize', checkScroll);
    }
    return () => {
      clearTimeout(timer);
      if (el) {
        el.removeEventListener('scroll', checkScroll);
      }
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll, industries]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const card = scrollRef.current.firstElementChild as HTMLElement | null;
      const cardWidth = card ? card.offsetWidth + 24 : 340;
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-14 relative z-10 overflow-hidden" style={{ backgroundColor: bgColor }}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Text Header Content */}
        <div className="flex flex-col items-center text-center mb-12 max-w-4xl mx-auto">
          <TextReveal 
            as="h2"
            text={heading}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 justify-center"
            style={{ color: headingTextColor }}
          />
          <MotionSection variant="fadeUp" delay={0.3}>
            <h3
              className="text-xl md:text-[24px] font-medium mb-6"
              style={{ color: subheadingTextColor }}
            >
              {subheading}
            </h3>
          </MotionSection>
          <MotionSection variant="fadeUp" delay={0.4}>
            <p
              className="text-[14px] md:text-[15px] font-normal leading-relaxed max-w-3xl tracking-wide"
              style={{ color: descriptionTextColor }}
            >
              {description}
            </p>
          </MotionSection>
        </div>

        {/* Carousel Container with Left/Right Arrows */}
        <div className="relative group/carousel">
          {/* Scroll Left Button - Only visible if canScrollLeft */}
          {canScrollLeft && (
            <button
              type="button"
              onClick={() => scroll('left')}
              aria-label="Scroll Left"
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 md:-translate-x-4 lg:-translate-x-8 xl:-translate-x-14 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-slate-100"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {/* Scroll Right Button - Only visible if canScrollRight */}
          {canScrollRight && (
            <button
              type="button"
              onClick={() => scroll('right')}
              aria-label="Scroll Right"
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 md:translate-x-4 lg:translate-x-8 xl:translate-x-14 z-20 w-11 h-11 rounded-full bg-white/90 hover:bg-white text-slate-600 hover:text-slate-900 shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer border border-slate-100"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          {/* Cards Scroll Track */}
          <div
            ref={scrollRef}
            className="flex items-stretch gap-6 overflow-x-auto scroll-smooth py-4 px-1 no-scrollbar snap-x snap-mandatory"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {industries.map((ind, index) => (
              <motion.div
                key={ind.name + index}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.5, delay: index * 0.05 }
                }}
                viewport={{ once: true }}
                whileHover={{ y: -10, transition: { duration: 0.3, ease: 'easeInOut' } }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="bg-white rounded-[24px] overflow-hidden flex flex-col shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-shadow duration-300 cursor-pointer group shrink-0 w-full sm:w-[300px] md:w-[310px] lg:w-[calc((100%-4.5rem)/4)] snap-start"
              >
                {/* Image Container */}
                <div className="h-[220px] relative bg-slate-100 overflow-hidden">
                  <motion.img 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    src={ind.image} 
                    alt={ind.name} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
                </div>
                
                {/* Text Container */}
                <div className="p-8 flex flex-col flex-1">
                  <h4
                    className="text-[17px] font-bold text-slate-900 mb-3 transition-colors"
                    onMouseEnter={(e) => { e.currentTarget.style.color = bgColor; }}
                    onMouseLeave={(e) => { e.currentTarget.style.color = ''; }}
                  >
                    {ind.name}
                  </h4>
                  <p className="text-[13px] text-slate-500 leading-relaxed">
                    {ind.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* View All Button */}
        {btnText && (
          <MotionSection variant="fadeUp" delay={0.5} className="mt-16 text-center">
            <Button 
              onClick={handleClick}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                backgroundColor: isBtnHovered && buttonHoverBgColor ? buttonHoverBgColor : buttonBgColor,
                color: isBtnHovered && buttonHoverTextColor ? buttonHoverTextColor : buttonTextColor,
              }}
              className="rounded-full px-12 h-[54px] text-[15px] font-bold tracking-wider shadow-2xl transition-all duration-300 hover:shadow-white/20 hover:-translate-y-1 active:scale-95 cursor-pointer border-none"
            >
              {btnText}
            </Button>
          </MotionSection>
        )}

      </div>
      {modalNode}
    </section>
  );
}
