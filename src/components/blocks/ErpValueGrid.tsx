'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpValueCard {
  title: string;
  desc: string;
  image: string;
}

interface ErpValueGridContent {
  heading?: string;
  subheading?: string;
  ctaButton?: { label: string; url: string };
  valueCards?: ErpValueCard[];
}

interface ErpValueGridProps {
  content?: ErpValueGridContent;
}

export function ErpValueGrid({ content }: ErpValueGridProps) {
  const heading = content?.heading || 'ERP Advances Business Value';
  const subheading = content?.subheading || 'Enterprise Resource Planning systems contribute to operational efficiency. ERP contributes in business growth in the following ways';
  const ctaButton = content?.ctaButton || { label: 'WHAT UNIQUE VALUE ESS ERP BRINGS?', url: '#' };
  const valueCards = content?.valueCards || [
    { title: 'Efficiency', desc: 'Minimize duplicate records and data entry, automate processes for maximum efficiency.', image: '/service-rpa.png' },
    { title: 'Integrated Information', desc: 'All database is integrated, no more siloed files, single source of truth.', image: '/service-oracle.png' },
    { title: 'Reporting', desc: 'Flexible custom reports, automated analytics, real-time metrics.', image: '/service-bi.png' },
    { title: 'Customer Service', desc: 'Get real-time customer history, improve response time, enhance customer satisfaction.', image: '/service-ems.png' },
    { title: 'Decision making', desc: 'Real-time updates across departments help management make faster, smarter decisions.', image: '/why-ess-main.png' },
    { title: 'Profitability', desc: 'Lower inventory carrying cost, reduce scrap, automate billing.', image: '/service-erp.png' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } 
    },
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-[#F8F9FA] overflow-hidden border-b border-slate-100">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full bg-slate-200/30 blur-[130px] -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-6">
          <MotionSection variant="fadeUp" className="space-y-4">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#4B2A63] tracking-tight">
              {heading}
            </h2>
            <p className="text-slate-500 text-lg font-light leading-relaxed">
              {subheading}
            </p>
          </MotionSection>

          {/* Central Accent CTA Button */}
          <MotionSection variant="fadeUp" delay={0.2} className="pt-2">
            <Button
              onClick={() => (window.location.href = ctaButton.url)}
              className="bg-[#4B2A63] hover:bg-[#391E4E] text-white rounded-full px-8 h-12 text-xs font-bold tracking-wider shadow-lg shadow-[#4B2A63]/10 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer uppercase"
            >
              {ctaButton.label}
            </Button>
          </MotionSection>
        </div>

        {/* 3x2 Grid layout */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {valueCards.map((card, idx) => (
            <motion.div
              key={idx}
              variants={cardVariants}
              className="group relative h-80 rounded-[32px] overflow-hidden border border-slate-200 bg-slate-900 shadow-lg hover:shadow-2xl transition-all duration-500"
            >
              {/* Card Image Cover with gradient fallback */}
              <div className="absolute inset-0 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 -z-10" />
              <img
                src={card.image}
                alt={card.title}
                onError={(e) => {
                  // If image fails to load, gracefully hide it and let the beautiful gradient show
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
                className="absolute inset-0 w-full h-full object-cover opacity-35 group-hover:scale-110 group-hover:rotate-1 transition-all duration-700 ease-[0.22,1,0.36,1] -z-10"
              />

              {/* Top Shadow Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent" />

              {/* Content Box */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end space-y-3.5">
                <div className="inline-block">
                  <span className="text-[10px] font-black tracking-widest text-[#FFD54F] uppercase border-b-2 border-[#FFD54F]/80 pb-1">
                    METRIC {idx + 1}
                  </span>
                </div>
                <h3 className="text-xl font-black text-white tracking-wide">
                  {card.title}
                </h3>
                <p className="text-slate-300 text-[13px] font-light leading-relaxed">
                  {card.desc}
                </p>
              </div>

              {/* Soft border accent on hover */}
              <div className="absolute inset-0 rounded-[32px] border-2 border-transparent group-hover:border-[#FFD54F]/20 transition-colors duration-500 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
