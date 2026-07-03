'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

export interface EuropePromoCtaContent extends EuropeCommonSettings {
  smallTitle?: string;
  smallTitleColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonBgColor?: string;
  buttonBorderColor?: string;
  buttonUrl?: string;
}

export function EuropePromoCta({ content }: { content?: EuropePromoCtaContent }) {
  const smallTitle = content?.smallTitle || 'Webinar';
  const smallTitleColor = content?.smallTitleColor || '#3b82f6';
  const title = content?.title || 'Monitor everything that matters to your European operations';
  const titleColor = content?.titleColor || '#1e293b';
  const description =
    content?.description ||
    'Join our experts for a live session on how ebizframe ERP helps European enterprises achieve operational excellence, compliance, and growth.';
  const descriptionColor = content?.descriptionColor || '#64748b';
  const buttonText = content?.buttonText || 'Register Now';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonBgColor = content?.buttonBgColor || '#4B2A63';
  const buttonBorderColor = content?.buttonBorderColor || '#4B2A63';
  const buttonUrl = content?.buttonUrl || '/contact';

  const align = content?.textAlignment || 'center';

  return (
    <EuropeSectionShell
      content={{
        ...content,
        backgroundColor: content?.backgroundColor || '#e8eef5',
        textAlignment: align,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className={`max-w-3xl space-y-5 ${align === 'center' ? 'mx-auto text-center' : align === 'right' ? 'ml-auto text-right' : 'text-left'}`}
      >
        {smallTitle && (
          <p className="text-sm font-bold uppercase tracking-widest" style={{ color: smallTitleColor }}>
            {smallTitle}
          </p>
        )}
        {title && (
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight" style={{ color: titleColor }}>
            {title}
          </h2>
        )}
        {description && (
          <p className="text-base sm:text-lg leading-relaxed" style={{ color: descriptionColor }}>
            {description}
          </p>
        )}
        {buttonText && (
          <div className={align === 'center' ? 'flex justify-center' : align === 'right' ? 'flex justify-end' : ''}>
            <Link
              href={buttonUrl}
              className="inline-flex px-8 py-3.5 rounded-full text-sm font-bold border transition-all hover:-translate-y-0.5 shadow-md hover:shadow-lg"
              style={{
                backgroundColor: buttonBgColor,
                borderColor: buttonBorderColor,
                color: buttonTextColor,
              }}
            >
              {buttonText}
            </Link>
          </div>
        )}
      </motion.div>
    </EuropeSectionShell>
  );
}
