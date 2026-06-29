'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface RpaCtaContent {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function RpaCta({ content }: { content?: RpaCtaContent }) {
  const title = content?.title || 'Download Our eBook - 50+ Industry Specific RPA Use Cases';
  const buttonText = content?.buttonText || 'Download Now';
  const buttonUrl = content?.buttonUrl || '#';

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
            <a
              href={buttonUrl}
              className="inline-block bg-[#fcc42c] hover:bg-[#ebaf1b] text-slate-900 px-8 py-3 rounded-full text-base font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200"
            >
              {buttonText}
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
}
