'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { COUNTRY_MAP } from '@/lib/countries';

export default function CareerOffices({ content }: { content?: any }) {
  const {
    title = '35+ offices globally',
    subtitle = 'With offices in 30 global locations and customers\nspread across 35+ countries.',
    countries = [
      { countryCode: 'at' },
      { countryCode: 'fr' },
      { countryCode: 'ie' },
      { countryCode: 'pt' },
      { countryCode: 'es' },
      { countryCode: 'be' },
      { countryCode: 'de' },
      { countryCode: 'pl' },
      { countryCode: 'ro' },
      { countryCode: 'gb' },
      { countryCode: 'au' },
      { countryCode: 'my' },
      { countryCode: 'il' },
      { countryCode: 'ca' },
      { countryCode: 'us' },
      { countryCode: 'in' },
      { countryCode: 'sg' },
      { countryCode: 'ma' },
    ]
  } = content || {};

  return (
    <section className="py-14 px-6 bg-[#f4f4f4]">
      <div className="container mx-auto  max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-[28px] md:text-4xl font-bold text-slate-900 mb-2">{title}</h2>
          <p
            className="text-[#71717A] max-w-2xl mx-auto text-2xl font-light leading-none"
            dangerouslySetInnerHTML={{ __html: subtitle.replace(/\n/g, '<br />') }}
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-x-8 gap-y-8  mx-auto pl-4 md:pl-0">
          {countries.map((country: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-default"
            >
              <span className={`fi fi-${country.countryCode} text-lg shadow-sm rounded-sm`}></span>
              <span className="text-[15px] font-normal text-slate-700">
                {COUNTRY_MAP[country.countryCode] || country.name || country.countryCode.toUpperCase()}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
