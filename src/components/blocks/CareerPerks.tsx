'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CareerPerks({ content }: { content?: any }) {
  const {
    title = 'Perks & Benefits',
    subtitle = 'We care about our people so they can take care of our clients',
    perks = [
      { text: "Health & Wellness Benefits" },
      { text: "Performance Bonuses" },
      { text: "Life Skill Certification Support" },
      { text: "International Project Exposure" },
      { text: "Flexible Work Arrangements" },
      { text: "Fast-Track Growth Path" }
    ]
  } = content || {};

  return (
    <section className="py-14 px-6 bg-slate-50">
      <div className="container mx-auto max-w-7xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
        <p className="text-[#71717A] max-w-2xl mx-auto text-2xl font-light leading-none mb-8">
          {subtitle}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {perks.map((perk: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white px-6 py-4 rounded-xl shadow-sm border border-slate-100 flex items-center justify-center min-h-[80px] hover:shadow-md transition-shadow cursor-default"
            >
              <span className="font-semibold text-slate-800 text-[15px]">{perk.text}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
