'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface StepItem {
  number?: string;
  image?: string;
  title?: string;
  description?: string;
}

interface OracleMigrationFlowContent {
  title?: string;
  steps?: StepItem[];
}

export function OracleMigrationFlow({ content }: { content?: OracleMigrationFlowContent }) {
  const sectionTitle = content?.title || '';
  const steps = content?.steps || [
    {
      number: '01',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 1.png',
      title: 'Oracle Database Version Upgrade (11g → 19c / 21c)',
      description: 'Controlled database version migration with rollback strategy.'
    },
    {
      number: '02',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 2.png',
      title: 'Oracle Database Performance Tuning',
      description: 'Query optimization, indexing strategy, and workload balancing.'
    },
    {
      number: '03',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 3.png',
      title: 'Security Hardening',
      description: 'Patch management, user access controls, and compliance alignment.'
    },
    {
      number: '04',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 4.png',
      title: 'Backup & Disaster Recovery Validation',
      description: 'Data protection and business continuity planning.'
    },
    {
      number: '05',
      image: '/migration-orcl datebase upgrade and optimization/ChatGPT Image Jun 18, 2026, 12_29_01 PM 5.png',
      title: 'High Availability Configuration',
      description: 'Clustering and failover readiness for mission-critical systems.'
    }
  ];

  return (
    <section className="py-14 bg-white relative border-b">
      <div className="container mx-auto max-w-7xl px-6">
        {sectionTitle && (
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-[#2e2a72] sm:text-4xl">{sectionTitle}</h2>
          </div>
        )}

        {/* Stepper Timeline container */}
        <div className="relative">

          {/* Horizontal line for desktop (lg and up) */}
          <div className="absolute top-[24px] left-[10%] right-[10%] h-[2px] bg-[#5e35b1] hidden lg:block z-0" />

          {/* Arrow markers positioned mathematically midway between column centers */}
          <div className="absolute top-[24px] left-0 right-0 h-0 hidden lg:block z-10 pointer-events-none">
            <span className="absolute left-[20%] -translate-y-1/2 -translate-x-1/2 flex items-center justify-center bg-white p-0.5">
              <svg className="w-2.5 h-2.5 text-[#5e35b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="absolute left-[40%] -translate-y-1/2 -translate-x-1/2 flex items-center justify-center bg-white p-0.5">
              <svg className="w-2.5 h-2.5 text-[#5e35b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="absolute left-[60%] -translate-y-1/2 -translate-x-1/2 flex items-center justify-center bg-white p-0.5">
              <svg className="w-2.5 h-2.5 text-[#5e35b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
            <span className="absolute left-[80%] -translate-y-1/2 -translate-x-1/2 flex items-center justify-center bg-white p-0.5">
              <svg className="w-2.5 h-2.5 text-[#5e35b1]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-6 relative z-20">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center group"
              >
                {/* Step Number Circle */}
                {step.number && (
                  <div className="h-12 w-12 rounded-full border border-[#5e35b1] bg-white flex items-center justify-center text-[#2e2a72] font-bold text-lg mb-6 transition-all duration-300 group-hover:bg-[#5e35b1] group-hover:text-white select-none">
                    {step.number}
                  </div>
                )}

                {/* Card box */}
                <div className="w-full flex flex-col items-center bg-white border border-slate-100 hover:border-[#5e35b1]/20 hover:shadow-xl hover:-translate-y-1 rounded-2xl p-6 transition-all duration-300 h-full text-center shadow-sm">

                  {/* Icon wrap with purple background */}
                  {step.image && (
                    <div className="h-24 w-24 rounded-2xl bg-[#f0ebfa] flex items-center justify-center p-3 mb-6 transition-transform duration-300 group-hover:scale-110">
                      <div className="relative w-full h-full">
                        <Image
                          src={step.image}
                          alt={step.title || 'Step Icon'}
                          fill
                          className="object-contain"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}

                  {/* Step Title */}
                  <h3 className="text-base font-bold text-[#2e2a72] leading-snug min-h-[48px] flex items-center justify-center font-sans">
                    {step.title}
                  </h3>

                  {/* Short Solid Divider Line */}
                  <div className="w-8 h-[1.5px] bg-[#5e35b1] my-4" />

                  {/* Step Description */}
                  <p className="text-xs text-slate-500 font-light leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
