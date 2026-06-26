'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface StepItem {
  number: string;
  dotColor: string;
  cardBg: string;
  borderColor: string;
  icon: string;
  title: string;
  description: string;
  accentColor: string;
}

interface BiBusinessImpactContent {
  title?: string;
  subtitle?: string;
  description?: string;
  steps?: StepItem[];
}

export function BiBusinessImpact({ content }: { content?: BiBusinessImpactContent }) {
  const title = content?.title || 'Business Impact';
  const subtitle = content?.subtitle || "We don't build dashboards first. We start with business problems.";
  const description = content?.description || 'From identifying business challenges to measuring measurable outcomes, our AI-driven approach transforms raw data into meaningful business decisions. We focus on solving real business problems first – delivering actionable insights, smarter decisions, and measurable financial impact.';

  const defaultSteps: StepItem[] = [
    {
      number: '01',
      dotColor: '#f26522', // orange
      cardBg: '#fff1eb', // soft orange tint
      borderColor: 'rgba(242, 101, 34, 0.12)',
      icon: '/Business intilligence/Group.png',
      title: 'Problem',
      description: 'Identify the business gap',
      accentColor: '#f26522'
    },
    {
      number: '02',
      dotColor: '#fbb03b', // yellow/gold
      cardBg: '#fff9ee', // soft gold tint
      borderColor: 'rgba(251, 176, 59, 0.12)',
      icon: '/Business intilligence/question_svgrepo.com.png',
      title: 'Question',
      description: 'Ask the right question',
      accentColor: '#fbb03b'
    },
    {
      number: '03',
      dotColor: '#6b7a99', // slate blue
      cardBg: '#f1f3f6', // soft slate tint
      borderColor: 'rgba(107, 122, 153, 0.12)',
      icon: '/Business intilligence/idea_svgrepo.com.png',
      title: 'Insight',
      description: 'Generate real-time insight',
      accentColor: '#6b7a99'
    },
    {
      number: '04',
      dotColor: '#6f42c1', // purple
      cardBg: '#f5f2fa', // soft purple tint
      borderColor: 'rgba(111, 66, 193, 0.12)',
      icon: '/Business intilligence/security_svgrepo.com.png',
      title: 'Decision',
      description: 'Enable confident decision',
      accentColor: '#6f42c1'
    },
    {
      number: '05',
      dotColor: '#00a699', // teal
      cardBg: '#f0f9f8', // soft teal tint
      borderColor: 'rgba(0, 166, 153, 0.12)',
      icon: '/Business intilligence/analytics-reference_svgrepo.com.png',
      title: 'Financial Impact',
      description: 'Measure financial outcome',
      accentColor: '#00a699'
    }
  ];

  const steps = content?.steps && content.steps.length > 0 ? content.steps : defaultSteps;

  return (
    <section className="py-14 bg-white overflow-hidden font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left Column: Heading and Description */}
          <div className="flex-1 space-y-6 lg:sticky lg:top-32 text-left">
            {title && (
              <h3 className="text-[32px] font-bold text-[#4c327f] tracking-tight leading-none mb-1">
                {title}
              </h3>
            )}

            <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-normal text-[#1a1a1a] tracking-tight leading-tight">
              {subtitle}
            </h2>

            <p className="text-slate-500 font-light text-base sm:text-[17px] leading-relaxed max-w-xl pt-1">
              {description}
            </p>
          </div>

          {/* Right Column: Stepper Timeline */}
          <div className="flex-1 w-full relative">
            {/* Single continuous vertical line (Desktop only) */}
            <div className="absolute left-[19px] top-[48px] bottom-[48px] w-[1.5px] bg-[#e2e8f0] hidden md:block z-0" />
            <div className="space-y-3">
              {steps.map((step, idx) => {
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.04 }}
                    className="flex items-center w-full group relative"
                  >

                    {/* 1. Timeline & Option column (Desktop Only) */}
                    <div className="w-28 h-16 shrink-0 relative hidden md:block select-none">
                      {/* Horizontal Connecting Line - aligned perfectly behind squircle center */}
                      <div className="absolute left-[19px] w-20 h-[1.5px] bg-[#e2e8f0] top-[50%] -translate-y-[50%] z-0" />

                      {/* Squircle Node Dot */}
                      <div
                        className="absolute left-[9px] top-[50%] -translate-y-[50%] w-[22px] h-[22px] rounded-[7px] border-2 border-white shadow-sm transition-all duration-300 group-hover:scale-110 z-10"
                        style={{ backgroundColor: step.dotColor }}
                      />

                      {/* Option Text - Sitting on top of the horizontal line, centered horizontally */}
                      <div className="absolute left-[19px] w-20 bottom-[50%] mb-[2px] flex flex-col items-center justify-end leading-none z-10">
                        <span className="text-[9px] uppercase font-bold tracking-widest text-slate-400">
                          Option
                        </span>
                        <span className="text-xl font-black text-slate-900 mt-0.5">
                          {step.number}
                        </span>
                      </div>
                    </div>

                    {/* 2. Step Card (White background, light matching border, rounded-2xl) */}
                    <div
                      className="flex-1 flex items-center gap-5 p-3.5 sm:p-4 rounded-2xl border bg-white shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 ml-2 md:ml-0"
                      style={{
                        borderColor: step.borderColor
                      }}
                    >
                      {/* Round Icon Container inside card, soft tinted bg */}
                      <div
                        className="flex-shrink-0 w-16 h-16 rounded-xl flex items-center justify-center relative shadow-sm border border-white"
                        style={{ backgroundColor: step.cardBg }}
                      >
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9">
                          <Image
                            src={step.icon}
                            alt={step.title}
                            fill
                            className="object-contain"
                          />
                        </div>
                      </div>

                      {/* Card Content Text */}
                      <div className="text-left space-y-0.5">
                        <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 md:hidden block">
                          Option {step.number}
                        </span>
                        <h4 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                          {step.title}
                        </h4>
                        <p className="text-sm sm:text-base text-slate-500 font-light leading-snug">
                          {step.description}
                        </p>
                      </div>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
