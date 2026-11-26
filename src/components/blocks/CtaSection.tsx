'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export default function CtaSection({ content }: { content?: any }) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const {
    title = 'Ready To Start Your Career Journey?',
    titleColor,
    subtitle = 'Join our team and be part of an innovative culture that values your growth and contributions.',
    ctaText = 'Join Us',
    ctaHoverBgColor,
    ctaHoverTextColor,
    button1Url = '',
    button1FormType = '',
    button1PdfUrl,
    pdfUrl,
  } = content || {};

  const formType = (button1FormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(button1Url, formType, button1PdfUrl || pdfUrl);

  return (
    <section className="py-12 px-6 border-t border-b bg-white">
      <div className="container mx-auto max-w-7xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2
            className="text-2xl md:text-4xl font-bold text-[#0D1A5C] mb-4"
            style={titleColor ? { color: titleColor } : undefined}
          >
            {title}
          </h2>
          <p className="max-w-2xl mx-auto text-xl font-medium leading-none mb-6">
            {subtitle}
          </p>
          <button
            type="button"
            onClick={handleClick}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            style={
              isBtnHovered && (ctaHoverBgColor || ctaHoverTextColor)
                ? {
                  backgroundColor: ctaHoverBgColor || undefined,
                  color: ctaHoverTextColor || undefined,
                }
                : undefined
            }
            className={`bg-[#0D1A5C] ${ctaHoverBgColor ? '' : 'hover:bg-[#07103a]'} text-white px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2 cursor-pointer`}
          >
            {ctaText}
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
      {modalNode}
    </section>
  );
}
