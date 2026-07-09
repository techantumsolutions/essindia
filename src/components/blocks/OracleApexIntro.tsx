'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface OracleApexIntroContent {
  title?: string;
  paragraphs?: string[];
  buttonText?: string;
  buttonUrl?: string;
  buttonFormType?: string;
}

export function OracleApexIntro({ content }: { content?: OracleApexIntroContent }) {
  const title = content?.title || 'Strategic Modernization for Enterprise Critical Systems';
  const defaultParagraphs = [
    'Many enterprises across France, Europe, the United States, and India continue to run business-critical operations on legacy Oracle Forms environments. While stable, these systems limit scalability, integration capability, user experience, and cloud readiness.',
    '<strong>Modernization today requires more than code conversion.</strong>',
    'We help enterprises migrate Oracle Forms applications to Oracle APEX, transforming legacy systems into high-performance, web-based enterprise platforms aligned with modern business requirements.'
  ];
  const paragraphs = content?.paragraphs && content.paragraphs.length > 0 ? content.paragraphs : defaultParagraphs;
  const buttonText = content?.buttonText || 'Plan Your Migration';
  const buttonUrl = content?.buttonUrl || '#';
  const buttonFormType = (content?.buttonFormType || '') as CtaFormType;
  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);
  return (
    <section className="py-14 px-6 bg-[#F5F5F5] font-sans relative">
      <div className="container mx-auto max-w-4xl text-center space-y-8">
        
        {/* Title */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-3xl md:text-4xl font-bold text-[#2D1A70] tracking-tight leading-tight"
          >
            {title}
          </motion.h2>
        )}

        {/* Paragraphs */}
        <div className="space-y-5">
          {paragraphs.map((para: string, idx: number) => (
            <motion.p
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.05 + idx * 0.05 }}
              className="text-[15px] sm:text-base md:text-lg text-slate-600 leading-relaxed font-light"
            >
              {typeof para === 'string' ? (
                <span dangerouslySetInnerHTML={{ __html: para }} />
              ) : (
                para
              )}
            </motion.p>
          ))}
        </div>

        {/* Button */}
        {buttonText && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="pt-2"
          >
            <a
              href={buttonUrl}
              className="inline-block bg-[#2D1A70] hover:bg-[#3e2794] text-white px-8 py-3.5 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200"
            >
              {buttonText}
            </a>
          </motion.div>
        )}

      </div>
      {modalNode}
    </section>
  );
}
