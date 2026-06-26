'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CardItem {
  description: string;
}

interface RoiExplanationContent {
  image?: string;
  title?: string;
  paragraphs?: string[];
  formulaText?: string;
  cards?: CardItem[];
}

export function RoiExplanation({ content }: { content?: RoiExplanationContent }) {
  const image = content?.image || '/BI-ROI caluculator/image 124.png';
  const title = content?.title || 'What is ROI?';
  const paragraphs = content?.paragraphs || [
    'Calculating Return on Investment (ROI) involves knowing the income generated as a result of the investment over a given period and the expenses associated with that investment.',
    'The formula consists of subtracting the investment expenses from the income and dividing that result by the initial investment expenses, and finally, multiplying the result by 100 to get the percentage value of ROI.'
  ];
  const formulaText = content?.formulaText || 'ROI = [(Income – Investment) / Investment] * 100';
  const cards = content?.cards || [
    { description: 'The numerator indicates the benefits obtained from the investment, and the denominator the investment expenses.' },
    { description: 'Marketing investments are accounted for as expenses. Therefore, the term investment expense is used interchangeably as investment.' },
    { description: 'A positive ROI indicates that the investment has been profitable, while a negative ROI indicates that the investment has been unprofitable.' }
  ];

  return (
    <section className="py-14 bg-white relative border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-16">

          {/* Left Column - Image */}
          {image && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6 }}
              className="flex-1 w-full relative h-[300px] sm:h-[400px] lg:h-auto rounded-2xl overflow-hidden shadow-lg border border-slate-100"
            >
              <Image
                src={image}
                alt={title}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            </motion.div>
          )}

          {/* Right Column - Text & Cards */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="flex-1 space-y-6 text-left"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-[#2b2a6c] tracking-tight">
              {title}
            </h2>

            <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              {paragraphs.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {formulaText && (
              <div className="text-xl sm:text-2xl font-bold text-slate-800 border-l-4 border-[#2b2a6c] pl-4 my-6 py-1">
                {formulaText}
              </div>
            )}

            {cards && cards.length > 0 && (
              <div className="space-y-3 pt-2">
                {cards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    whileHover={{ scale: 1.01, x: 4 }}
                    className="p-4 px-6 rounded-xl bg-[#9ea2c6] text-white text-xs sm:text-sm font-light shadow-sm leading-relaxed"
                  >
                    {card.description}
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
