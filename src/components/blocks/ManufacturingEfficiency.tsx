'use client';

import React from 'react';
import { motion } from 'framer-motion';

const defaultCapabilities = [
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum',
  'Lorem ipsum'
];

export default function ManufacturingEfficiency({ content }: { content?: any }) {
  const sectionTitle = content?.sectionTitle || 'Lorem ipsum';
  const sectionSubtitle = content?.sectionSubtitle || 'Lorem Efficiency dolor sit amet,<br />Consectetur ipsum';
  const description = content?.description || 'Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
  const image = content?.image || '/Modules-manufacturing/Eifficiency.png';
  const capabilities = content?.metrics || defaultCapabilities;

  return (
    <section className="py-14 px-6 bg-[#f1f7fe] overflow-hidden">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-4"
          >
            <div className="space-y-2">
              <div className="text-[14px] font-bold text-slate-900">
                {sectionTitle}
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#27256b] leading-[1.1] tracking-tight" dangerouslySetInnerHTML={{ __html: sectionSubtitle }} />
              <p className="text-slate-600 text-[17px] max-w-xl pb-2">
                {description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {capabilities.map((item: string, i: number) => (
                <div
                  key={i}
                  className="bg-transparent border-[1px] border-[#27256b] px-4 py-2 rounded-xl text-center transition-all hover:bg-[#27256b]/5 flex items-center justify-center shadow-sm"
                >
                  <span className="text-[14px] font-bold text-black">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-end h-[320px] items-center"
          >
            <img
              src={image}
              alt="Dashboard Capabilities"
              className="w-full h-full object-contain scale-[1.25] lg:scale-[1.4]  drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
