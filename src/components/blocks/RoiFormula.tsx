'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface RoiFormulaContent {
  title?: string;
  paragraphs?: string[];
  image1?: string;
  image2?: string;
}

export function RoiFormula({ content }: { content?: RoiFormulaContent }) {
  const title = content?.title || 'How to calculate ROI';
  const paragraphs = content?.paragraphs || [
    'To calculate ROI, it is necessary to determine the net income or profit generated from the investment and divide it by the total cost incurred. The resulting figure is then multiplied by 100 to express it as a percentage. Here\'s the formula:',
    'ROI = (Net Income / Total Cost) x 100',
    'For instance, if an investment of $10,000 yields a net income of $2,000, the ROI can be calculated as follows:',
    'ROI = ($2,000 / $10,000) x 100 = 20%',
    'This indicates that the investment generated a return of 20 cents for every dollar invested.',
    'It\'s worth noting that there are variations of the ROI formula that may be used depending on the specific context or industry. Some variations include:',
    'ROI = (Net Income – Initial Investment) / Initial Investment x 100',
    'This formula calculates the ROI based on the initial investment rather than the total cost.',
    'ROI = (Current Value of Investment – Initial Investment) / Initial Investment x 100',
    'This formula considers the current value of the investment rather than the net income.',
    'Regardless of the formula used, the fundamental principle of ROI remains the same: it measures the financial return of an investment relative to its cost.'
  ];
  const image1 = content?.image1 || '';
  const image2 = content?.image2 || '';

  const hasCustomImages = !!(image1 || image2);

  return (
    <section className="py-14 bg-white relative border-b">
      <div className="container mx-auto max-w-7xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="space-y-3 text-left max-w-5xl"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#2b2a6c] tracking-tight">
            {title}
          </h2>

          <div className="space-y-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            {paragraphs.map((p, idx) => {
              const isFormulaLine = p.startsWith('ROI =');
              return (
                <p
                  key={idx}
                  className={isFormulaLine ? 'font-bold text-slate-800 text-base py-1 pl-3 border-l-2 border-[#2b2a6c]/40 font-mono' : ''}
                >
                  {p}
                </p>
              );
            })}
          </div>

          {/* Conditional rendering of either custom uploaded images OR native default equations */}
          {hasCustomImages ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="pt-10 w-full flex flex-col md:flex-row justify-center items-center gap-8"
            >
              {image1 && (
                <div className={`relative aspect-[3.5/1] w-full ${image2 ? 'md:w-1/2' : 'max-w-4xl'} h-[120px] sm:h-[160px] lg:h-[180px]`}>
                  <Image
                    src={image1}
                    alt="Formula 1"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
              {image2 && (
                <div className="relative aspect-[3.5/1] w-full md:w-1/2 h-[120px] sm:h-[160px] lg:h-[180px]">
                  <Image
                    src={image2}
                    alt="Formula 2"
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </motion.div>
          ) : (
            /* Native HTML/CSS fraction equations as default */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8 w-full max-w-5xl mx-auto">
              {/* Equation 1 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="flex items-center justify-center font-serif text-slate-800 text-sm sm:text-base md:text-lg py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 shadow-sm"
              >
                <span className="italic font-bold mr-2 text-[#2b2a6c]">ROI</span>
                <span className="mr-3 font-semibold text-slate-600">=</span>
                <span className="text-3xl font-light text-slate-400 mr-1">(</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 border-b border-slate-700 pb-1 text-center italic text-xs sm:text-sm md:text-base">
                    Sales increase – campaign cost
                  </span>
                  <span className="px-2 pt-1 text-center italic text-xs sm:text-sm md:text-base">
                    campaign cost
                  </span>
                </div>
                <span className="text-3xl font-light text-slate-400 ml-1">)</span>
                <span className="font-semibold ml-3 text-slate-700">&middot; 100</span>
              </motion.div>

              {/* Equation 2 */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="flex items-center justify-center font-serif text-slate-800 text-sm sm:text-base md:text-lg py-6 px-4 bg-slate-50/50 rounded-2xl border border-slate-100/80 shadow-sm"
              >
                <span className="italic font-bold mr-2 text-[#2b2a6c]">ROI</span>
                <span className="mr-3 font-semibold text-slate-600">=</span>
                <span className="text-3xl font-light text-slate-400 mr-1">(</span>
                <div className="flex flex-col items-center">
                  <span className="px-2 border-b border-slate-700 pb-1 text-center italic text-xs sm:text-sm md:text-base">
                    incremental benefits – software cost
                  </span>
                  <span className="px-2 pt-1 text-center italic text-xs sm:text-sm md:text-base">
                    software cost
                  </span>
                </div>
                <span className="text-3xl font-light text-slate-400 ml-1">)</span>
                <span className="font-semibold ml-3 text-slate-700">&middot; 100</span>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
