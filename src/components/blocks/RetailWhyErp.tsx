'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

export interface RetailWhyErpContent {
  title?: string;
  paragraph?: string;
  paragraphs?: string[];
  imagePath?: string;
}

export function RetailWhyErp({ content }: { content: RetailWhyErpContent }) {
  const {
    title = 'Why ebizframe ERP?',
    paragraph = 'ebizframe ERP is a complete cloud-based ERP software solution which covers Sales, Procurement, Manufacturing, Finance, HR, Project Management, Quality, Plant Maintenance and much more. Thus ebizframe caters to all your business management needs in a single unified system, eliminating data silos. With its highly modular architecture, robust database, and ease-of-use, it is uniquely positioned to deliver tangible value. ebizframe empowers businesses to scale rapidly, adapt to shifting market conditions and maintain peak operational efficiency without complex custom coding.',
    paragraphs,
    imagePath = '/industry-solution-Retail/process_ERP_Retail.png',
  } = content || {};

  const allParagraphs = paragraphs && paragraphs.length > 0 ? paragraphs : (paragraph ? [paragraph] : []);

  return (
    <section className="py-20 bg-[#fbfcfd]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-16">
          
          {/* Left Diagram */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full md:w-1/2 flex justify-center"
          >
            <img 
              src={imagePath} 
              alt="ERP Process Diagram" 
              className="max-w-md w-full h-auto object-contain drop-shadow-lg"
            />
          </motion.div>

          {/* Right Content */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full md:w-1/2 space-y-4"
          >
            <FormattedText content={title} as="h2" className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6 tracking-tight" />
            {allParagraphs.map((para, idx) => (
              <FormattedText key={idx} content={para} className="text-lg text-slate-600 leading-relaxed text-justify md:text-left" />
            ))}
          </motion.div>
          
        </div>
      </div>
    </section>
  );
}
