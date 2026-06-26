'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface OraclePartnerContent {
  image1?: string;
  text1?: string;
  title2?: string;
  description2?: string;
  image3?: string;
  text3?: string;
}

export function OraclePartner({ content }: { content?: OraclePartnerContent }) {
  const image1 = content?.image1 || '/migration-orcl datebase upgrade and optimization/1704524759_oracle erp-min 1.png';
  const text1 = content?.text1 || 'TRUSTED\nORACLE PARTNER';
  const title2 = content?.title2 || '25+';
  const description2 = content?.description2 || 'YEARS OF\nEXPERTISE';
  const image3 = content?.image3 || '/migration-orcl datebase upgrade and optimization/db-copy_svgrepo.com.png';
  const text3 = content?.text3 || 'ZERO-DOWNTIME\nMIGRATION EXPERTISET';

  return (
    <section className="py-14 bg-white border-b border-slate-300 shadow-[0_10px_20px_rgba(0,0,0,0.12)] relative z-10">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-center text-center">
          
          {/* Column 1: Image + Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            {image1 && (
              <div className="relative h-14 w-full max-w-[200px] flex items-center justify-center">
                <Image
                  src={image1}
                  alt={text1.replace('\n', ' ')}
                  width={150}
                  height={50}
                  className="object-contain max-h-12"
                  unoptimized
                />
              </div>
            )}
            <p className="text-sm font-semibold tracking-wider text-[#4B2A63] uppercase whitespace-pre-line leading-relaxed">
              {text1}
            </p>
          </motion.div>

          {/* Column 2: Title + Subtitle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col items-center justify-center space-y-2 border-y md:border-y-0 md:border-x border-slate-100 py-6 md:py-0"
          >
            <h2 className="text-5xl md:text-6xl font-extrabold text-red-500 tracking-tight leading-none">
              {title2}
            </h2>
            <p className="text-sm font-semibold tracking-wider text-[#4B2A63] uppercase whitespace-pre-line leading-relaxed">
              {description2}
            </p>
          </motion.div>

          {/* Column 3: Image + Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col items-center justify-center space-y-4"
          >
            {image3 && (
              <div className="relative h-12 w-12 flex items-center justify-center">
                <Image
                  src={image3}
                  alt={text3.replace('\n', ' ')}
                  width={48}
                  height={48}
                  className="object-contain"
                  unoptimized
                />
              </div>
            )}
            <p className="text-sm font-semibold tracking-wider text-[#4B2A63] uppercase whitespace-pre-line leading-relaxed">
              {text3}
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
