'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BiIntroContent {
  badge?: string;
  title?: string;
  description?: string;
}

export function BiIntro({ content }: { content?: BiIntroContent }) {
  const badge = content?.badge || 'From raw data to actionable insights — instantly.';
  const title = content?.title || 'AI-Driven BI That Reveals Revenue Leakage, Expiry Risks &\nHidden Profit Opportunities';
  const description = content?.description || 'Identify slow-moving stock, revenue gaps, expiry risks, and operational inefficiencies with\nAI-powered Business Intelligence.';

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto max-w-7xl px-6 text-center">

        {/* Yellow Badge */}
        {badge && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.4 }}
            className="inline-block px-6 py-2.5 rounded-full text-xs font-bold tracking-wide bg-[#ffca28] text-black shadow-sm mb-6"
          >
            {badge}
          </motion.div>
        )}

        {/* Heading */}
        {title && (
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl sm:text-4xl lg:text-[40px] font-extralight text-[#5e35b1] tracking-tight leading-tight max-w-5xl mx-auto mb-6 whitespace-pre-line font-sans"
          >
            {title}
          </motion.h2>
        )}

        {/* Description */}
        {description && (
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-500 font-light max-w-3xl mx-auto leading-relaxed whitespace-pre-line"
          >
            {description}
          </motion.p>
        )}

      </div>
    </section>
  );
}
