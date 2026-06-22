'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface ErpIntroContent {
  title?: string;
  description?: string;
}

interface ErpIntroProps {
  content?: ErpIntroContent;
}

export function ErpIntro({ content }: ErpIntroProps) {
  const title = content?.title || 'Optimizing operations with real-time visibility';
  const description = content?.description || 'ERP systems have become essential to run, scale, and transform business operations. A modern ERP unifies diverse functions—from finance and inventory management to manufacturing planning and HR—into a singular ecosystem.\n\nThis integration eliminates data silos, helping businesses maintain accuracy, improve compliance, and streamline operations to keep pace with an evolving market.';

  return (
    <section className="relative w-full py-16 bg-[#e8ecf0] overflow-hidden border-b border-slate-100">
      {/* Dynamic Background Accents */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-100/30 rounded-full blur-3xl -z-10" />
      {/* <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl -z-10" /> */}

      <div className="container mx-auto px-4 md:px-8 max-w-5xl text-center">
        <MotionSection variant="fadeUp" className="space-y-4">
          {/* Main Heading */}
          <h2 className="text-3xl md:text-4xl lg:text-[42px] leading-[1.2] font-[400] tracking-tight">
            {title}
          </h2>

          {/* Styled Separator Line */}
          {/* <div className="flex justify-center items-center gap-1.5 py-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[#4B2A63]" />
            <div className="w-12 h-[2px] rounded-full bg-gradient-to-r from-transparent via-[#4B2A63] to-transparent" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#4B2A63]" />
          </div> */}

          {/* Description Paragraphs */}
          <div className="">
            {description.includes('<p>') ? (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-gray-500 text-base md:text-lg font-light leading-6 text-justify md:text-center prose prose-sm max-w-none prose-p:my-2"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-gray-500 text-base md:text-lg font-light leading-6 text-justify md:text-center whitespace-pre-wrap"
              >
                {description}
              </motion.p>
            )}
          </div>
        </MotionSection>
      </div>
    </section>
  );
}
