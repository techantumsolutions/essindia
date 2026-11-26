'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface RpaOverviewIntroContent {
  title?: string;
  titleColor?: string;
  description?: string;
}

export function RpaOverviewIntro({ content }: { content?: RpaOverviewIntroContent }) {
  const title = content?.title || 'Robotic Process Automation Solutions';
  const description = content?.description || 'At ESS, we help businesses streamline operations through intelligent RPA solutions tailored to their unique workflows and existing systems. From identifying automation opportunities to implementing scalable processes, we focus on improving efficiency, accuracy, visibility, and operational consistency. Whether organizations are beginning their automation journey or expanding across departments, our expert team ensures every solution integrates smoothly, delivers measurable business impact, and supports long-term digital transformation with confidence.';

  return (
    <section className="py-14 bg-[#eff6ff] font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="max-w-4xl mx-auto text-center space-y-5">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-[#27256b] tracking-tight leading-tight"
              style={content?.titleColor ? { color: content.titleColor } : undefined}
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-600 font-light text-base sm:text-lg leading-relaxed"
            >
              {typeof description === 'string' && (description.includes('<p>') || description.includes('<')) ? (
                <div dangerouslySetInnerHTML={{ __html: description }} />
              ) : (
                description
              )}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
