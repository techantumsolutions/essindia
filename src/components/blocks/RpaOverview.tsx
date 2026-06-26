'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface StatCard {
  icon?: string;
  title?: string;
  description?: string;
}

interface PartnerLogo {
  image?: string;
  name?: string;
}

interface RpaOverviewContent {
  title?: string;
  description?: string;
  subtitle?: string;
  cards?: StatCard[];
  logos?: PartnerLogo[];
}

export function RpaOverview({ content }: { content?: RpaOverviewContent }) {
  const title = content?.title || 'Robotic Process Automation Solutions';
  const description = content?.description || 'At ESS, we help businesses streamline operations through intelligent RPA solutions tailored to their unique workflows and existing systems. From identifying automation opportunities to implementing scalable processes, we focus on improving efficiency, accuracy, visibility, and operational consistency. Whether organizations are beginning their automation journey or expanding across departments, our expert team ensures every solution integrates smoothly, delivers measurable business impact, and supports long-term digital transformation with confidence.';
  const subtitle = content?.subtitle || 'A successful RPA Journey Starts with Selecting the Right Implementation Partner';

  const defaultCards: StatCard[] = [
    {
      icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png',
      title: '500+',
      description: 'Automated Processes'
    },
    {
      icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png',
      title: '1M+',
      description: 'Automated Transactions'
    },
    {
      icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png',
      title: '1000+',
      description: 'Saved Manhours'
    }
  ];

  const defaultLogos: PartnerLogo[] = [
    { image: '/RPA-Robotic Process Automation (RPA)/image 58.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 59.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 60.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 61.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 62.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 63.png' }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;
  const logos = content?.logos && content.logos.length > 0 ? content.logos : defaultLogos;

  return (
    <section className="py-14 bg-[#eff6ff] font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Top Text Details */}
        <div className="max-w-4xl mx-auto text-center space-y-5 mb-14">
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
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-600 font-light text-base sm:text-lg leading-relaxed"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Subtitle / Stepper Header */}
        {subtitle && (
          <div className="text-center mb-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight"
            >
              {subtitle}
            </motion.h3>
          </div>
        )}

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 flex flex-col items-center text-center space-y-4 hover:shadow-md transition-shadow duration-300"
            >
              {card.icon && (
                <div className="w-14 h-14 relative flex items-center justify-center bg-blue-50/50 rounded-xl">
                  <div className="w-8 h-8 relative">
                    <Image
                      src={card.icon}
                      alt={card.title || 'Metric Icon'}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-[#27256b] block">
                  {card.title}
                </span>
                <span className="text-sm font-medium text-slate-500 block uppercase tracking-wider">
                  {card.description}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Partner Logos Grid */}
        {logos.length > 0 && (
          <div className="border-t border-blue-100/50 pt-10">
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
              {logos.map((logo, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: idx * 0.04 }}
                  className="relative w-24 h-10 md:w-28 md:h-12 hover:scale-110 transition-all duration-300 select-none"
                >
                  {logo.image && (
                    <Image
                      src={logo.image}
                      alt={logo.name || 'Partner Logo'}
                      fill
                      className="object-contain"
                    />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
