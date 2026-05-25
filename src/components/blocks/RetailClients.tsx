'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface RetailClientsContent {
  title?: string;
  logos?: string[];
}
export function RetailClients({ content }: { content: RetailClientsContent }) {
  const {
    title = 'Lorem ipsum dolor sit amet',
    logos = [
      '/industry-solution-Retail/image 37.png',
      '/industry-solution-Retail/image 45.png',
      '/industry-solution-Retail/image 46.png',
      '/industry-solution-Retail/image 47.png',
      '/industry-solution-Retail/image 48.png',
    ],
  } = content || {};

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold text-indigo-900 mb-10 text-center md:text-left"
        >
          {title}
        </motion.h3>
        
        <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-16">
          {logos.map((logo, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, filter: 'grayscale(100%)' }}
              whileInView={{ opacity: 1, filter: 'grayscale(0%)' }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="w-24 md:w-32 h-16 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
            >
              <img src={logo} alt={`Client Logo ${idx + 1}`} className="max-w-full max-h-full object-contain" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
