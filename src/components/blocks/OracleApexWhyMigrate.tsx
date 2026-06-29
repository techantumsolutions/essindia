'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OracleApexWhyMigrateContent {
  image?: string;
  tagText?: string;
  title?: string;
  description?: string;
  points?: string[];
}

export function OracleApexWhyMigrate({ content }: { content?: OracleApexWhyMigrateContent }) {
  const sideImage = content?.image || '/Migration-Oracle Forms to Oracle APEX/43cf0cf615146177fa1157dd0ba4a24f1252918e.png';
  const tagText = content?.tagText || 'Modern • Secure • Cloud-Native';
  const title = content?.title || 'WHY ENTERPRISES ARE MIGRATING ORACLE FORMS TO ORACLE APEX';
  const titleColor = '#27256B';
  const description = content?.description || 'The objective is not just platform replacement — it is operational optimization.';
  const defaultPoints = [
    'Client-server limitations restrict scalability',
    'Increasing maintenance complexity',
    'Limited integration with modern platforms',
    'Aging user interface impacting productivity',
    'Cloud migration challenges'
  ];
  const points = content?.points && content.points.length > 0 ? content.points : defaultPoints;

  return (
    <section className="py-14 bg-white font-sans relative">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Column: Image and Tag Pill */}
          <div className="lg:col-span-6 flex flex-col items-center lg:items-start space-y-6">
            {sideImage && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5 }}
                className="relative w-full aspect-[4/3] max-w-[500px] flex items-center justify-center bg-slate-50/50 rounded-2xl p-4"
              >
                <Image
                  src={sideImage}
                  alt={title}
                  fill
                  className="object-contain p-4"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 50vw"
                />
              </motion.div>
            )}

            {/* Tag Pill Block */}
            {tagText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="w-full max-w-[500px] flex justify-center lg:justify-start"
              >
                <div className="inline-flex items-center gap-2.5 border border-slate-200/80 bg-white rounded-xl px-5 py-3 shadow-sm">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                  <span className="text-sm font-semibold text-slate-700 tracking-wide">
                    {tagText}
                  </span>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column: Title, Description, and Points */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <h2
                className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight leading-tight"
                style={{ color: titleColor }}
              >
                {title}
              </h2>
              {description && (
                <p className="text-base sm:text-lg text-slate-500 font-light leading-relaxed">
                  {description}
                </p>
              )}
            </motion.div>

            {/* List of benefits/points */}
            <div className="space-y-3">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-slate-200/60 bg-white hover:shadow-md hover:border-slate-300 transition-all duration-300"
                >
                  {/* Self-contained Green Check Circle Icon */}
                  <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg className="w-3.5 h-3.5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm sm:text-base font-medium text-slate-700 leading-snug">
                    {point}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
