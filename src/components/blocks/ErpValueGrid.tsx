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
  const subheading = content?.subheading || 'Enterprise Resource Planning Companies are more likely to deploy a full-service suite of ERP technology.ERP modules are available to automate processes that broadly are:';
  const ctaButton = content?.ctaButton || { label: 'So what benefits do businesses get from ERP Software?', url: '#' };
  const valueCards = content?.valueCards || [
    { title: 'Efficiency', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-1.png' },
    { title: 'Integrated Information', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-2.png' },
    { title: 'Reporting', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-3.png' },
    { title: 'Customer Service', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-4.png' },
    { title: 'Decision making', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-5.png' },
    { title: 'Profitability', desc: 'Removes repetitive processes and reduces manual entry of information. Business processes are therefore streamlined and efficient as they work on information from common source.', image: '/ErpOverview/value-6.png' },
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
    <section className="relative w-full py-16 bg-[#F8F9FA] overflow-hidden border-b border-slate-100">
      {/* Background radial soft light */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 rounded-full bg-slate-200/30 blur-[130px] -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <MotionSection variant="fadeUp" className="">
            <h2 className="text-3xl md:text-4xl lg:[42px] font-bold text-[#462294] tracking-tight">
              {heading}
            </h2>
            <p className="text-[#777777] text-lg font-normal">
              {subheading}
            </p>
          </MotionSection>

          {/* Central Accent CTA Button */}
          {/* Badge With Dotted Line */}
          <MotionSection variant="fadeUp" delay={0.2} className="pt-8">
            <div className="relative flex items-center justify-center transition-all duration-300">

              {/* Left Line */}
              <div className="hidden md:flex flex-1 items-center justify-end">
                <div className="w-full border-t border-dashed border-[#B9B4D6]" />
                <div className="w-2 h-2 rounded-full bg-[#4A36F4] ml-2 shrink-0" />
              </div>

              {/* Badge */}
              <Button
                onClick={() => (window.location.href = ctaButton.url)}
                className="bg-[#4A36F4] hover:bg-[#462294] text-white rounded-full px-8 md:px-10 h-12 text-sm md:text-base font-semibold shadow-lg transition-all duration-300"
              >
                {ctaButton.label}
              </Button>

              {/* Right Line */}
              <div className="hidden md:flex flex-1 items-center justify-start">
                <div className="w-2 h-2 rounded-full bg-[#4A36F4] mr-2 shrink-0" />
                <div className="w-full border-t border-dashed border-[#B9B4D6]" />
              </div>
            </div>
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
              className="group transition-all duration-500 hover:-translate-y-2"
            >
              {/* Image */}
              <div className="relative h-65">
                <img
                  src={card.image}
                  alt={card.title}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                  className="w-full h-full transition-transform hover:rounded-2xl rounded-2xl duration-700 group-hover:scale-105"
                />

                {/* Overlay */}
                {/* <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/10 to-transparent" /> */}

                {/* Floating Number */}
                {/* <div className="absolute top-5 left-5 w-11 h-11 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center shadow-lg">
                  <span className="text-[#462294] font-bold text-sm">
                    0{idx + 1}
                  </span>
                </div> */}
              </div>

              {/* Content */}
              <div className="py-4 px-4">
                <h3 className="text-[28px] leading-tight mb-1 font-bold text-[#462294] group-hover:text-[#391781] transition-colors duration-300">
                  {card.title}
                </h3>

                <p className="text-[#6E6E73] text-[15px] font-normal">
                  {card.desc}
                </p>

                {/* Bottom Accent */}
                {/* <div className="mt-6 flex items-center gap-2">
                  <div className="w-10 h-[3px] rounded-full bg-[#462294]" />
                  <div className="w-2 h-2 rounded-full bg-[#462294]" />
                </div> */}
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
