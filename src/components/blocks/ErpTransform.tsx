'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpTransformItem {
  title: string;
  desc: string;
  iconImage?: string;
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
  
  const defaultImages = [
    '/ErpOverview/transform-1.png',
    '/ErpOverview/transform-2.png',
    '/ErpOverview/transform-3.png',
  ];

  const items = (content?.items || [
    { 
      title: 'OPERATIONAL EXCELLENCE', 
      desc: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.' 
    },
    { 
      title: 'MANAGERIAL EFFECTIVENESS', 
      desc: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.' 
    },
    { 
      title: 'STRATEGIC INVESTMENT', 
      desc: 'OE can be defined as a state of excellence an organization attains if all its resources perform at their optimum levels following the processes laid down to increase the productivity of the organization. Operational excellence is often quantified in the form of cost reduction and the reduction in the number and cycle time of various processes. ebizframe ERP Software in India is the best tool for an enterprise to achieve operational excellence in any business vertical. It streamlines the processes across the enterprise, eliminating redundant data, reducing costs, and improving quality. ebizframe ERP Software in India also provides you with actionable insights so that you can take corrective measures to attain optimum performance for your business in the least time possible.' 
    },
  ]).map((item, idx) => ({
    ...item,
    iconImage: item.iconImage || defaultImages[idx % defaultImages.length],
  }));

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
    <section className="relative w-full py-16 bg-white overflow-hidden">
      {/* Background soft glowing blur */}
      <div className="absolute top-0 right-1/4 w-125 h-125 rounded-full bg-purple-100/40 blur-[120px] -z-10" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-4xl lg:[42px] font-extrabold text-[#462294] tracking-tight">
              {heading}
            </h2>
          </MotionSection>
          
          <MotionSection variant="fadeUp" delay={0.15}>
            <p className="text-slate-500 text-lg">
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
          className="space-y-4"
        >
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              variants={panelVariants}
              className="group bg-white rounded-[32px] px-6 py-4 border-2 border-gray-200 shadow-[0_4px_30px_rgba(0,0,0,0.015)] hover:shadow-[0_24px_60px_-15px_rgba(75,42,99,0.06)] transition-all duration-500 hover:-translate-y-1 flex flex-col lg:flex-row gap-8 items-center cursor-pointer"
            >
              {/* Left Side: Custom Image Container */}
              <div className=" rounded-3xl flex items-center justify-center shrink-0 transition-colors duration-300 overflow-hidden">
                <div className="w-full h-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                  {item.iconImage ? (
                    <img 
                      src={item.iconImage} 
                      alt={item.title} 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="w-8 h-8 rounded bg-[#4B2A63]/10" />
                  )}
                </div>
              </div>

              {/* Right Side: Title & Description */}
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-lg md:text-3xl font-medium text-[#777777] tracking-tight group-hover:text-slate-900 transition-colors duration-300">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-base text-justify">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
