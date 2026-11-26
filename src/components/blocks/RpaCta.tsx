'use client';

import React, { useState } from 'react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';
import { motion } from 'framer-motion';

interface RpaCtaContent {
  title?: string;
  titleColor?: string;
  buttonText?: string;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  pdfUrl?: string;
}

export function RpaCta({ content }: { content?: RpaCtaContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const title = content?.title || 'Download Our eBook - 50+ Industry Specific RPA Use Cases';
  const buttonText = content?.buttonText || 'Download Now';
  const buttonHoverBgColor = content?.buttonHoverBgColor;
  const buttonHoverTextColor = content?.buttonHoverTextColor;
  const pdfUrl = content?.pdfUrl;

  return (
    <section className="py-14 bg-[#f0f2f7] text-slate-800 font-sans relative">
      <div className="container mx-auto max-w-5xl px-6 text-center space-y-5">
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-light text-[#462295] tracking-tight leading-tight"
            style={content?.titleColor ? { color: content.titleColor } : undefined}
          >
            {title}
          </motion.h2>
        )}
        {buttonText && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="pt-2"
          >
            <button
              onClick={() => setIsModalOpen(true)}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={
                isBtnHovered && (buttonHoverBgColor || buttonHoverTextColor)
                  ? {
                      backgroundColor: buttonHoverBgColor || undefined,
                      color: buttonHoverTextColor || undefined,
                    }
                  : undefined
              }
              className={`bg-[#0D2C84] ${buttonHoverBgColor ? '' : 'hover:bg-[#0B2570]'} text-white px-8 py-4 rounded-full font-semibold transition-colors inline-flex items-center gap-2 text-base shadow-sm cursor-pointer`}
            >
              {buttonText}
            </button>
          </motion.div>
        )}
      </div>
    
      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}
