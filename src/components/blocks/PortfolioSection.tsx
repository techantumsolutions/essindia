'use client';

import React, { useCallback, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { cn } from '@/lib/utils';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { useInternalNavigate } from '@/hooks/useInternalNavigate';

interface Project {
  title: string;
  tags: string[];
  image: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
}

interface PortfolioContent {
  heading?: string;
  subheading?: string;
  projects?: Project[];
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

interface PortfolioSectionProps {
  content?: PortfolioContent;
}

const defaultPortfolios = [
  {
    title: 'Workflow System Energy',
    tags: ['Oil & gas'],
    image: '/portfolio-1.png',
    ctaText: 'Explore Project',
    ctaUrl: '#',
  },
  {
    title: 'SaaS for End to-End Analytics',
    tags: ['ecommerce', 'Custom software'],
    image: '/portfolio-2.png',
    ctaText: 'Explore Project',
    ctaUrl: '#',
  },
  {
    title: 'Workload Management',
    tags: ['Web development', 'Custom software'],
    image: '/portfolio-3.png',
    ctaText: 'Explore Project',
    ctaUrl: '#',
  },
];

export function PortfolioSection({ content }: PortfolioSectionProps) {
  const [isBtnHovered, setIsBtnHovered] = React.useState(false);
  const heading = content?.heading || "Real Work. Real Results.";
  const subheading = content?.subheading || "Explore the ESS story, a legacy of transformation across high-end brands and verticals.";
  const projects = content?.projects || defaultPortfolios;

  const btnText = content?.buttonText || content?.viewAllCta?.label || "View All Work";
  const btnUrl = content?.buttonUrl || content?.viewAllCta?.url || "/portfolio";
  const btnFormType = (content?.buttonFormType || content?.viewAllCta?.formType || '') as CtaFormType;
  const pdfUrl = (content as any)?.pdfUrl || content?.viewAllCta?.pdfUrl;

  const buttonBgColor = content?.buttonBgColor || '#4B2A63';
  const buttonHoverBgColor = content?.buttonHoverBgColor || '#3B198F';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonHoverTextColor = content?.buttonHoverTextColor;

  const { handleClick, modalNode } = useCtaAction(btnUrl, btnFormType, pdfUrl);

  const scrollRef = useRef<HTMLDivElement>(null);
  const pausedRef = useRef(false);
  const showArrows = projects.length > 3;
  const slides = showArrows ? [...projects, ...projects] : projects;

  const getSlideStep = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return 0;
    const cards = el.querySelectorAll<HTMLElement>('[data-portfolio-card]');
    if (cards.length >= 2) return cards[1].offsetLeft - cards[0].offsetLeft;
    return cards[0]?.offsetWidth || el.clientWidth;
  }, []);

  const normalizeLoop = useCallback(() => {
    const el = scrollRef.current;
    if (!el || !showArrows || projects.length === 0) return;
    const cycle = getSlideStep() * projects.length;
    if (cycle <= 0 || el.scrollLeft < cycle - 1) return;
    const previous = el.style.scrollBehavior;
    el.style.scrollBehavior = 'auto';
    el.scrollLeft = el.scrollLeft - cycle;
    el.style.scrollBehavior = previous;
  }, [getSlideStep, projects.length, showArrows]);

  const scroll = useCallback((direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const step = getSlideStep();
    if (el.scrollWidth - el.clientWidth <= 8 || step <= 0) return;

    if (direction === 'left' && showArrows && el.scrollLeft <= 8) {
      const cycle = step * projects.length;
      const previous = el.style.scrollBehavior;
      el.style.scrollBehavior = 'auto';
      el.scrollLeft = el.scrollLeft + cycle;
      el.style.scrollBehavior = previous;
    }

    el.scrollBy({ left: direction === 'right' ? step : -step, behavior: 'smooth' });
  }, [getSlideStep, projects.length, showArrows]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !showArrows) return;

    let settleTimer = 0;
    const onScroll = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(() => normalizeLoop(), 80);
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.clearTimeout(settleTimer);
      el.removeEventListener('scroll', onScroll);
    };
  }, [normalizeLoop, showArrows, slides.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !showArrows) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const id = window.setInterval(() => {
      if (pausedRef.current) return;
      if (el.scrollWidth - el.clientWidth <= 8) return;
      el.scrollBy({ left: getSlideStep(), behavior: 'smooth' });
    }, 4500);

    return () => window.clearInterval(id);
  }, [getSlideStep, showArrows, projects.length]);

  return (
    <section className="py-14 bg-[#F2F6F9] overflow-hidden relative">
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
        <div
          className={cn(
            "relative @container flex items-center justify-center group/carousel w-full",
            showArrows ? "xl:px-24" : ""
          )}
          onMouseEnter={() => { pausedRef.current = true; }}
          onMouseLeave={() => { pausedRef.current = false; }}
        >
          
          {/* Left Arrow */}
          {showArrows && (
            <button 
              onClick={() => scroll('left')}
              className="flex absolute left-2 top-[calc(75cqw+1.625rem)] md:top-1/2 md:-translate-y-1/2 xl:left-4 z-10 w-10 h-10 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          )}

          {/* Grid / Flex Wrapper */}
          <div 
            ref={scrollRef}
            className={cn(
              "w-full",
              showArrows ? "overflow-x-auto snap-x snap-mandatory pb-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]" : ""
            )}
          >
            <StaggerContainer 
              className={cn(
                "w-full",
                showArrows 
                  ? "flex gap-10" 
                  : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 xl:px-24"
              )}
            >
              {slides.map((portfolio, index) => {
                const targetUrl = portfolio.ctaUrl || (portfolio as any).url || (portfolio as any).link || (portfolio as any).buttonUrl || '';
                const formType = ((portfolio as any).ctaFormType || (portfolio as any).formType || '') as CtaFormType;
                const isClone = showArrows && index >= projects.length;
                return (
                  <ProjectCard
                    key={`${portfolio.title}-${index}`}
                    portfolio={portfolio}
                    showArrows={showArrows}
                    targetUrl={targetUrl}
                    formType={formType}
                    isClone={isClone}
                  />
                );
              })}
            </StaggerContainer>
          </div>

          {/* Right Arrow */}
          {showArrows && (
            <button 
              onClick={() => scroll('right')}
              className="flex absolute right-2 top-[calc(75cqw+1.625rem)] md:top-1/2 md:-translate-y-1/2 xl:right-4 z-10 w-10 h-10 rounded-full border border-slate-200 bg-white items-center justify-center text-slate-600 hover:bg-[#4B2A63] hover:text-white hover:border-[#4B2A63] transition-all duration-300 shadow-sm cursor-pointer hover:scale-110 active:scale-95"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          )}

        </div>

        {/* View All Button */}
        {btnText && (
          <MotionSection variant="fadeUp" delay={0.6} className="mt-20 text-center">
            <Button 
              onClick={handleClick}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                backgroundColor: isBtnHovered && buttonHoverBgColor ? buttonHoverBgColor : buttonBgColor,
                color: isBtnHovered && buttonHoverTextColor ? buttonHoverTextColor : buttonTextColor,
              }}
              className="rounded-full px-12 h-[54px] text-[16px] font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer border-none"
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

function ProjectCard({
  portfolio,
  showArrows,
  targetUrl,
  formType,
  isClone = false,
}: {
  portfolio: Project;
  showArrows: boolean;
  targetUrl: string;
  formType: CtaFormType;
  isClone?: boolean;
}) {
  const { handleClick, modalNode } = useCtaAction(targetUrl, formType);
  const handleCardClick = (e: React.MouseEvent) => {
    if (formType) {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <>
      <motion.div
        variants={{
          initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
          animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
        }}
        whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
        data-portfolio-card
        aria-hidden={isClone || undefined}
        className={cn(
          "flex flex-col group cursor-pointer",
          showArrows ? "w-full md:w-[calc(50%-20px)] lg:w-[calc(33.33%-26px)] shrink-0 flex-none snap-start" : ""
        )}
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
        <h3 className={cn(
          "text-lg md:text-xl font-bold text-[#4B2A63] mb-2.5 tracking-tight group-hover:text-black transition-colors",
          showArrows && "max-md:px-12"
        )}>
          {portfolio.title}
        </h3>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {portfolio.tags?.map(tag => (
            <span 
              key={tag} 
              className="bg-white/80 backdrop-blur-sm border border-slate-100 text-slate-500 px-3 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Link */}
        <div className="flex items-center text-slate-900 text-xs md:text-sm font-bold group-hover:text-[#4B2A63] transition-all duration-300 mt-auto cursor-pointer">
          {targetUrl ? (
            <a href={targetUrl} onClick={handleCardClick} tabIndex={isClone ? -1 : undefined} className="flex items-center">
              {portfolio.ctaText || 'Explore Project'} <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </a>
          ) : (
            <span className="flex items-center">
              {portfolio.ctaText || 'Explore Project'} <ArrowRight className="w-3.5 h-3.5 ml-1.5 transition-transform group-hover:translate-x-1" />
            </span>
          )}
        </div>
      </motion.div>
      {modalNode}
    </>
  );
}
