'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FrameworkLogo {
  image?: string;
  name?: string;
}

interface RpaFrameworksContent {
  title?: string;
  logos?: FrameworkLogo[];
}

export function RpaFrameworks({ content }: { content?: RpaFrameworksContent }) {
  const title = content?.title || 'ESS brings expertise on frameworks';

  const defaultLogos: FrameworkLogo[] = [
    { image: '/RPA-Robotic Process Automation (RPA)/image 64.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 65.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 66.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 67.png' }
  ];

  const logos = content?.logos && content.logos.length > 0 ? content.logos : defaultLogos;

  return (
    <section className="py-14 bg-white font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6 text-center space-y-4">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl font-medium text-slate-700 tracking-tight"
          >
            {title}
          </motion.h3>
        )}

        {logos.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {logos.map((logo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.05 }}
                className="relative w-36 h-12 hover:scale-105 transition-transform duration-300 select-none"
              >
                {logo.image && (
                  <Image
                    src={logo.image}
                    alt={logo.name || 'Framework Logo'}
                    fill
                    className="object-contain"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
