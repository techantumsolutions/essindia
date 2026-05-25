'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpTransformItem {
  title: string;
  desc: string;
  illustration?: string;
}

interface ErpTransformContent {
  heading?: string;
  subheading?: string;
  items?: ErpTransformItem[];
}

interface ErpTransformProps {
  content?: ErpTransformContent;
}

export function ErpTransform({ content }: ErpTransformProps) {
  const heading = content?.heading || 'Transform Your Business';
  const subheading = content?.subheading || 'Learn how modern ERP automates workflows and drives efficiency across departments.';
  const items = content?.items || [
    { 
      title: 'OPERATIONAL EXCELLENCE', 
      desc: 'ESS ERP system optimizes your workflows by automating manual entries and integrating sales, inventory, and finance. Real-time updates eliminate bottlenecks and ensure operational flow.' 
    },
    { 
      title: 'MANAGERIAL EFFECTIVENESS', 
      desc: 'With unified dashboards, department heads can monitor performance indices, forecast stock demands, and manage resources dynamically from a single screen.' 
    },
    { 
      title: 'STRATEGIC INVESTMENT', 
      desc: 'Our ERP is built on scalable modern tech, making it a future-proof asset. It expands alongside your business volumes, maintaining efficiency at any scale.' 
    },
  ];

  // Unique Premium SVG Vectors for the 3 Panels
  const renderIllustration = (index: number) => {
    switch (index) {
      case 0:
        // Operational Excellence SVG - Workflow & Nodes
        return (
          <svg className="w-16 h-16 text-[#4B2A63]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="8" y="24" width="12" height="12" rx="3" className="stroke-[#4B2A63]" />
            <rect x="44" y="8" width="12" height="12" rx="3" className="stroke-[#FFD54F]" />
            <rect x="44" y="40" width="12" height="12" rx="3" className="stroke-[#4B2A63]" />
            <path d="M20 30 H32 V14 H44" strokeDasharray="2 2" />
            <path d="M32 30 V46 H44" />
            <circle cx="32" cy="30" r="3" fill="#4B2A63" />
            <circle cx="20" cy="30" r="2" fill="#4B2A63" />
            <circle cx="44" cy="14" r="2" fill="#FFD54F" />
            <circle cx="44" cy="46" r="2" fill="#4B2A63" />
          </svg>
        );
      case 1:
        // Managerial Effectiveness SVG - Dashboard Speed Dial
        return (
          <svg className="w-16 h-16 text-[#4B2A63]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 44 A 20 20 0 1 1 52 44" strokeLinecap="round" />
            <path d="M16 40 A 15 15 0 0 1 48 40" strokeDasharray="3 3" />
            <line x1="32" y1="36" x2="44" y2="24" strokeWidth="3" strokeLinecap="round" className="stroke-[#FFD54F]" />
            <circle cx="32" cy="36" r="4" fill="#4B2A63" />
            <line x1="12" y1="44" x2="52" y2="44" />
          </svg>
        );
      case 2:
        // Strategic Investment SVG - Upward Analytics Bars
        return (
          <svg className="w-16 h-16 text-[#4B2A63]" viewBox="0 0 64 64" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="12" y="38" width="8" height="14" rx="2" fill="none" />
            <rect x="28" y="24" width="8" height="28" rx="2" className="fill-[#4B2A63]/10" />
            <rect x="44" y="10" width="8" height="42" rx="2" className="fill-[#FFD54F]/20 stroke-[#FFD54F]" />
            <path d="M8 52 H56" strokeLinecap="round" />
            <path d="M16 34 L32 20 L48 6" strokeLinecap="round" strokeDasharray="2 2" />
            <circle cx="48" cy="6" r="3" fill="#FFD54F" />
          </svg>
        );
      default:
        return null;
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const panelVariants = {
    hidden: { opacity: 0, y: 40, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as any } 
    },
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden">
      {/* Background soft glowing blur */}
      <div className="absolute top-0 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-100/40 blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-5xl">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#4B2A63] tracking-tight">
              {heading}
            </h2>
          </MotionSection>
          
          <MotionSection variant="fadeUp" delay={0.15}>
            <p className="text-slate-500 text-lg font-light leading-relaxed">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Stacked White Panels Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="space-y-6 md:space-y-8"
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={panelVariants}
              className="group bg-white rounded-[32px] border border-slate-200/80 p-6 md:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_24px_60px_-15px_rgba(75,42,99,0.06)] transition-all duration-500 hover:-translate-y-1 flex flex-col md:flex-row gap-8 items-center cursor-pointer"
            >
              {/* Left Side: Custom Vector Illustration Icon Container */}
              <div className="w-24 h-24 rounded-3xl bg-[#F8F9FA] group-hover:bg-[#4B2A63]/5 flex items-center justify-center shrink-0 border border-slate-100 transition-colors duration-300">
                <div className="transition-transform duration-500 group-hover:scale-110">
                  {renderIllustration(idx)}
                </div>
              </div>

              {/* Right Side: Title & Description */}
              <div className="space-y-3.5 flex-1 text-center md:text-left">
                <div className="inline-flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD54F]" />
                  <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
                    STAGE 0{idx + 1}
                  </span>
                </div>
                <h3 className="text-lg md:text-xl font-black text-[#4B2A63] tracking-wide group-hover:text-slate-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm font-light leading-relaxed">
                  {item.desc}
                </p>
              </div>

              {/* Decorative Subtle Background Overlay Dot */}
              <div className="w-2 h-2 rounded-full bg-slate-200 group-hover:bg-[#FFD54F] transition-colors duration-300 absolute right-8 top-8 hidden md:block" />
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
