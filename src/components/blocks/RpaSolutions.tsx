'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface SolutionItem {
  title: string;
}

interface RpaSolutionsContent {
  title?: string;
  description?: string;
  solutions?: SolutionItem[];
  image?: string;
}

export function RpaSolutions({ content }: { content?: RpaSolutionsContent }) {
  const title = content?.title || 'Our Most Popular AI Powered RPA BOTs';
  const description = content?.description || 'Our Most Popular AI Powered RPA BOTs are designed to automate repetitive business processes, improve operational speed, and enhance workflow accuracy across departments.';
  const image = content?.image || '/RPA-Robotic Process Automation (RPA)/AI bot.png';

  const defaultSolutions: SolutionItem[] = [
    { title: 'Invoice Automation BOT' },
    { title: 'Reports Reconciliation BOT' },
    { title: 'Sales Order Processing BOT' },
    { title: 'Bank Statements Reconciliation BOT' },
    { title: 'IT Backup Monitoring Validating BOT' },
    { title: 'Debtor\'s Statement Reconciliation BOT' },
    { title: 'CV Screening and Shortlisting BOT' },
    { title: 'HSN Code Reconciliation BOT' }
  ];

  const solutions = content?.solutions && content.solutions.length > 0 ? content.solutions : defaultSolutions;

  return (
    <section className="py-14 bg-[#f1f7fe] font-sans">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Core Layout Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left Column: Text description and 2-column grid of BOT pills */}
          <div className="lg:col-span-7 space-y-3 text-left">
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="text-3xl sm:text-4xl font-bold text-[#3e3d7b] leading-tight"
              >
                {title}
              </motion.h2>
            )}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-slate-500 font-light text-sm sm:text-base leading-relaxed"
              >
                {description}
              </motion.p>
            )}

            {/* Responsive 2-column list of BOT pills */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4">
              {solutions.map((sol, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="bg-white border border-[#3e3d7b]/10 rounded-2xl px-5 py-4 flex items-center justify-start shadow-sm hover:shadow hover:border-[#3e3d7b]/25 transition-all duration-300 min-h-[56px]"
                >
                  <span className="text-sm font-bold text-[#3e3d7b]">
                    {sol.title}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Visual illustration */}
          <div className="lg:col-span-5 w-full relative flex justify-center">
            {image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.96 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.2 }}
                className="relative w-full aspect-[1.1/1] max-w-[500px]"
              >
                <Image
                  src={image}
                  alt={title || 'RPA Solution Illustration'}
                  fill
                  className="object-contain"
                />
              </motion.div>
            )}
          </div>

        </div>

      </div>
    </section>
  );
}
