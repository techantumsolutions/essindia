'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CareerWhyJoin({ content }: { content?: any }) {
  const {
    title = 'Why Join ESS?',
    subtitle = 'With offices in 30 global locations and customers\nspread across 35+ countries.',
    mapImage = '/Career-Page/Group 1.png',
    stats = [
      { value: '500+', label: 'Team Members' },
      { value: '12+', label: 'Global Offices' },
      { value: '35+', label: 'Countries Represented' },
      { value: '95%', label: 'Employee Retention' },
    ]
  } = content || {};

  return (
    <section className="py-14 px-6 bg-slate-50 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p
            className="text-[#71717A] max-w-2xl mx-auto text-2xl font-light leading-none"
            dangerouslySetInnerHTML={{ __html: subtitle.replace(/\n/g, '<br />') }}
          />
        </div>

        <div className="relative flex justify-center mb-16">
          <motion.img
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            src={mapImage}
            alt="Global Locations Map"
            className="w-full max-w-4xl object-contain relative z-10"
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center -mt-4 relative z-20">
          {stats.map((stat: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-[40px] md:text-[44px] font-light text-[#2D3339] mb-1">{stat.value}</div>
              <div className="text-[15px] font-normal text-[#4A64A2]">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
