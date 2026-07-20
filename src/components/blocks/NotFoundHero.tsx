'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export interface NotFoundHeroContent {
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  codeText?: string;
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
  secondaryButtonBgColor?: string;
  secondaryButtonTextColor?: string;
  bgColor?: string;
}

export function NotFoundHero({ content }: { content?: NotFoundHeroContent }) {
  const badgeText = content?.badgeText || 'Page not found';
  const badgeBgColor = content?.badgeBgColor || '#ede9fe';
  const badgeTextColor = content?.badgeTextColor || '#4B2A63';
  const codeText = content?.codeText || '404';
  const title = content?.title || "We can't find that page";
  const titleColor = content?.titleColor || '#0f172a';
  const description =
    content?.description ||
    'The page you requested may have been moved, renamed, or no longer exists. Try heading home or exploring our solutions.';
  const descriptionColor = content?.descriptionColor || '#64748b';
  const primaryButtonText = content?.primaryButtonText || 'Back to Home';
  const primaryButtonUrl = content?.primaryButtonUrl || '/';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#4B2A63';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#ffffff';
  const secondaryButtonText = content?.secondaryButtonText || 'Contact Us';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '/contact-us';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || '#f1f5f9';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#0f172a';
  const bgColor = content?.bgColor || '#ffffff';

  return (
    <section className="relative overflow-hidden py-14" style={{ backgroundColor: bgColor }}>
      <div className="absolute top-24 left-10 w-72 h-72 bg-purple-100/40 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-slate-100/60 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <div className="container mx-auto max-w-3xl px-6 relative z-10 text-center space-y-6">
        {badgeText && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex px-4 py-1.5 rounded-full text-xs font-semibold"
            style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
          >
            {badgeText}
          </motion.span>
        )}

        {codeText && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-6xl sm:text-7xl font-thin tracking-tight text-[#4B2A63]/30"
            aria-hidden="true"
          >
            {codeText}
          </motion.p>
        )}

        {title && (
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight"
            style={{ color: titleColor }}
          >
            {title}
          </motion.h1>
        )}

        {description && (
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-base sm:text-lg leading-relaxed max-w-2xl mx-auto"
            style={{ color: descriptionColor }}
          >
            {description}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap justify-center gap-3 pt-2"
        >
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
              className="px-7 py-3 rounded-full text-sm font-bold transition-all hover:-translate-y-0.5"
              style={{ backgroundColor: secondaryButtonBgColor, color: secondaryButtonTextColor }}
            >
              {secondaryButtonText}
            </Link>
          )}
        </motion.div>
      </div>
    </section>
  );
}
