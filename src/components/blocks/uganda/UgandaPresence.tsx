'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface StatItem {
  title?: string;
  description?: string;
}

export interface UgandaPresenceContent {
  image?: string;
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { title: '20+', description: 'Countries served across Africa and beyond' },
  { title: '1,200+', description: 'Enterprise implementations and rollouts' },
  { title: 'Modular', description: 'Adopt what you need now, expand when ready' },
  { title: 'Localizable', description: 'Workflows tailored for policy, tax, and operations' },
];

export function UgandaPresence({ content }: { content?: UgandaPresenceContent }) {
  const image = content?.image || '/About-Uganda/Frame%20303.png';
  const stats = (content?.stats?.length ? content.stats : DEFAULT_STATS).slice(0, 4);

  return (
    <section className="w-full py-14 bg-[#f8fafc] flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        {/* Map Image container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative w-full aspect-[21/9] max-w-5xl mx-auto mb-12"
        >
          {image && (
            <Image
              src={image}
              alt="Uganda presence map"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 80vw"
              priority
            />
          )}
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center max-w-6xl mx-auto">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col items-center"
            >
              {stat.title && (
                <span className="text-2xl sm:text-[32px] font-semibold text-[#3b4b8a] tracking-tight">
                  {stat.title}
                </span>
              )}
              {stat.description && (
                <p className="text-xs sm:text-sm font-semibold text-slate-800 tracking-tight leading-relaxed mt-2 max-w-[220px]">
                  {stat.description}
                </p>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
