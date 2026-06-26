'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface BenefitItem {
  title: string;
  image: string;
}

interface RpaBenefitsContent {
  title?: string;
  subtitle?: string;
  benefits?: BenefitItem[];
}

export function RpaBenefits({ content }: { content?: RpaBenefitsContent }) {
  const title = content?.title || 'Benefits of RPA';
  const subtitle = content?.subtitle || 'Robotic Process Automation (RPA) helps businesses automate repetitive tasks, reduce manual errors, and improve operational efficiency.';

  const defaultBenefits: BenefitItem[] = [
    { title: '0% error rate in the automated process', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 164.png' },
    { title: 'Great reductions in cycle times', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 165.png' },
    { title: 'Can utilize manpower for more productive tasks', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 166.png' },
    { title: 'Up to 80% cost reduction', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 167.png' },
    { title: 'Non-intrusive solution framework', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 168.png' },
    { title: 'Reduced cost of operations', image: '/RPA-Robotic Process Automation (RPA)/Rectangle 169.png' }
  ];

  const benefits = content?.benefits && content.benefits.length > 0 ? content.benefits : defaultBenefits;

  return (
    <section className="py-14 bg-white font-sans">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-3 mb-6">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-[#27256b] tracking-tight leading-tight"
            >
              {title}
            </motion.h2>
          )}
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-500 font-light text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
            >
              {subtitle}
            </motion.p>
          )}
        </div>

        {/* 6 Benefits Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {benefits.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              className="group flex flex-col rounded-2xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200/60 transition-all duration-300 bg-white"
            >
              {/* Top part: Image */}
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-50">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                )}
              </div>

              {/* Bottom part: Yellow Banner */}
              <div className="bg-[#f2bd1d] flex-1 flex items-center justify-center p-5 min-h-[76px] text-center border-t border-yellow-400/20">
                <span className="text-[#27256b] font-bold text-sm sm:text-base leading-snug px-1">
                  {item.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

