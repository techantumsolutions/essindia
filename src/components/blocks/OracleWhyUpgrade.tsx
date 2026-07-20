'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface OracleWhyUpgradeContent {
  image?: string;
  title?: string;
  description?: string;
  points?: string[];
}

export function OracleWhyUpgrade({ content }: { content?: OracleWhyUpgradeContent }) {
  const sideImage = content?.image || '/migration-orcl datebase upgrade and optimization/21c 1.png';
  const title = content?.title || 'WHY UPGRADE YOUR ORACLE DATABASE?';
  const description = content?.description || 'A modern database environment strengthens your entire ERP foundation.';
  const points = content?.points || [
    'End-of-life risks in legacy Oracle database versions',
    'Security patching requirements for unsupported Oracle databases',
    'Performance limitations in older Oracle database environments',
    'Compliance mandates for enterprise database systems',
    'Compatibility requirements for cloud infrastructure and modern platforms'
  ];

  return (
    <section className="py-14 bg-white border-b">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* Left Column: Image */}
          {sideImage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="relative w-full max-w-lg mx-auto aspect-[4/3] flex items-center justify-center"
            >
              <Image
                src={sideImage}
                alt={title}
                fill
                className="object-contain"
                unoptimized
              />
            </motion.div>
          )}

          {/* Right Column: Title, Description, and Points */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.5 }}
              className="space-y-3"
            >
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2e2a72] leading-tight font-sans">
                {title}
              </h2>
              <p className="text-sm sm:text-base text-slate-500 font-light">
                {description}
              </p>
            </motion.div>

            {/* List of benefits */}
            <div className="space-y-3">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-[#eceff1]/60 bg-[#f8fafc]/50 hover:bg-white hover:shadow-md hover:border-[#2e2a72]/10 transition-all duration-300"
                >
                  <div className="h-6 w-6 shrink-0 flex items-center justify-center bg-green-50 rounded-full">
                    <Check className="w-3.5 h-3.5 text-green-600" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-[#2e2a72]/90">
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
