'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpModule {
  title: string;
  desc: string;
  iconImage: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface ErpModulesGridContent {
  heading?: string;
  subheading?: string;
  modules?: ErpModule[];
}

interface ErpModulesGridProps {
  content?: ErpModulesGridContent;
}

export function ErpModulesGrid({ content }: ErpModulesGridProps) {
  const heading = content?.heading || 'ERP Modules';
  const subheading = content?.subheading || 'Choose standard version or customizable version of our technology. ERP modules contribute to business growth in the following ways';
  const modules = content?.modules || [
    { title: 'FINANCE & TAX AUDIT', desc: 'Ensure compliance, gain audits and financial security.', iconImage: '/ErpOverview/ERP-1.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'SUPPLY CHAIN & PROCUREMENT', desc: 'Ensure seamless supply chain, reduce storage cost, ready parts dynamically.', iconImage: '/ErpOverview/ERP-2.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'CUSTOMER RELATIONSHIP MANAGEMENT', desc: 'Ensure customer success, track lead pipeline, close deals faster.', iconImage: '/ErpOverview/ERP-3.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'PROJECT MANAGEMENT', desc: 'Manage projects efficiently, keep track of budgets and deliver on time.', iconImage: '/ErpOverview/ERP-4.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'MANUFACTURING PLANNING', desc: 'Optimize factory floors, automate billing materials, increase production capacity.', iconImage: '/ErpOverview/ERP-5.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'BI & ANALYTICS', desc: 'Generate executive dashboards, forecast sales, get real-time operational reports.', iconImage: '/ErpOverview/ERP-6.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'QUALITY ASSURANCE', desc: 'Ensure high-quality standards in manufacturing and operations.', iconImage: '/ErpOverview/ERP-7.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'HR & PAYROLL', desc: 'Manage attendance, payroll generation, track appraisals, and recruitment.', iconImage: '/ErpOverview/ERP-8.png', ctaLabel: 'READ MORE', ctaUrl: '#' },
  ];

  // Grid container and item animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } 
    },
  };

  return (
    <section className="relative w-full py-16 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-4xl lg:text-[42px] font-medium text-[#462294] tracking-tight">
              {heading}
            </h2>
          </MotionSection>
          
          <MotionSection variant="fadeUp" delay={0.15}>
            <p className="text-[#777777] text-base font-normal">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Modules Responsive Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {modules.map((module, idx) => {
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className="group flex flex-col justify-between text-center items-center p-6 rounded-xl shadow-lg hover:shadow-xl border-2 border-gray-100 transition-all duration-500 ease-[0.22,1,0.36,1] cursor-pointer"
              >
                {/* Icon Image inside a beautiful rounded card box */}
                <div className="w-28 h-28 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0">
                  <img 
                    src={module.iconImage} 
                    alt="" 
                    className="w-full h-full rounded-full" 
                  />
                </div>

                {/* Text details */}
                <div className="space-y-3 flex-1 flex flex-col justify-center my-2">
                  <h3 className="text-base font-black tracking-wide text-[#4B2A63] leading-snug group-hover:text-slate-900 transition-colors duration-300">
                    {module.title}
                  </h3>
                  <p className="text-[#777777] text-sm font-medium">
                    {module.desc}
                  </p>
                </div>

                {/* Read More dynamic CTA */}
                <button 
                  type="button" 
                  className="text-[10px] mt-4 font-semibold text-white bg-[#462294] hover:bg-white hover:text-black rounded-full h-7 px-4 border border-[#462294] transition-colors duration-300 cursor-pointer" 
                  onClick={(e) => {
                    e.stopPropagation();
                    window.open(module.ctaUrl || '#', '_blank');
                  }}
                >
                  {module.ctaLabel || 'READ MORE'}
                </button>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
