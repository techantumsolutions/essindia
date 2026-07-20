'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import { ThankYouPdfHandler } from '@/components/forms/ThankYouPdfHandler';

export interface ThankYouHeroContent {
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryButtonBgColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  pdfNotice?: string;
  bgColor?: string;
}

export function ThankYouHero({ content }: { content?: ThankYouHeroContent }) {
  const badgeText = content?.badgeText || 'Success';
  const badgeBgColor = content?.badgeBgColor || '#dcfce7';
  const badgeTextColor = content?.badgeTextColor || '#166534';
  const title = content?.title || 'Thank you for reaching out';
  const titleColor = content?.titleColor || '#0f172a';
  const description =
    content?.description ||
    'We have received your details. Our team will get back to you shortly.';
  const descriptionColor = content?.descriptionColor || '#64748b';
  const primaryButtonText = content?.primaryButtonText || 'Back to Home';
  const primaryButtonUrl = content?.primaryButtonUrl || '/';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#4B2A63';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#ffffff';
  const secondaryButtonText = content?.secondaryButtonText || 'Explore Solutions';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/solutions';
  const pdfNotice =
    content?.pdfNotice ||
    'If a document was requested, it will open in a new tab in a few seconds.';
  const bgColor = content?.bgColor || '#ffffff';

  return (
    <section className="relative overflow-hidden py-14" style={{ backgroundColor: bgColor }}>
      <div className="absolute top-24 left-10 w-72 h-72 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-violet-100/40 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-3xl px-6 relative z-10 text-center space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600"
        >
          <CheckCircle2 className="w-9 h-9" aria-hidden="true" />
        </motion.div>

        {badgeText && (
          <span
            className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {badgeText}
          </span>
        )}

        {title && (
          <h1
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: titleColor }}
          >
            {title}
          </h1>
        )}

        {description && (
          <p className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: descriptionColor }}>
            {description}
          </p>
        )}

        <Suspense fallback={null}>
          <ThankYouPdfHandler delayMs={5000} notice={pdfNotice} />
        </Suspense>

        <div className="flex flex-wrap justify-center gap-3 pt-2">
          {primaryButtonText && (
            <Link
              href={primaryButtonUrl}
              className="px-7 py-3 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: primaryButtonBgColor, color: primaryButtonTextColor }}
            >
              {primaryButtonText}
            </Link>
          )}
          {secondaryButtonText && (
            <Link
              href={secondaryButtonUrl}
              className="px-7 py-3 rounded-full text-sm font-bold bg-slate-100 text-slate-800 transition-all hover:-translate-y-0.5"
            >
              {secondaryButtonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
