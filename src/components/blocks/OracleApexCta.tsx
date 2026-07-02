'use client';

import React, { useState } from 'react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface OracleApexCtaContent {
  bgColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
  pdfUrl?: string;
}

export function OracleApexCta({ content }: { content?: OracleApexCtaContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bgColor = content?.bgColor || '#f0f2f7';
  const title = content?.title || 'Begin Your Modernization Assessment';
  const titleColor = content?.titleColor || '#5c3ea3';
  const description = content?.description || 'Engage with our experts to evaluate your Oracle Forms transformation roadmap and build a scalable digital foundation.';
  const descriptionColor = content?.descriptionColor || '#374151';
  const buttonText = content?.buttonText || 'Get start Now';
  const buttonBgColor = content?.buttonBgColor || '#ffca28';
  const buttonTextColor = content?.buttonTextColor || '#000000';
  const pdfUrl = content?.pdfUrl;

  return (
    <section className="py-14" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-4xl px-6 text-center space-y-6">

        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-3xl sm:text-4xl font-normal tracking-tight font-sans"
            style={{ color: titleColor }}
          >
            {title}
          </motion.h2>
        )}

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-sm sm:text-base font-bold max-w-3xl mx-auto leading-relaxed"
            style={{ color: descriptionColor }}
          >
            {description}
          </motion.p>
        )}

        {buttonText && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="pt-2"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="inline-block"
            >
              <button onClick={() => setIsModalOpen(true)} className="bg-[#4B2A63] text-white hover:bg-[#3A1F4D] px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2">
                {buttonText}
              </button>
            </motion.div>
          </motion.div>
        )}

      </div>
    
      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}
