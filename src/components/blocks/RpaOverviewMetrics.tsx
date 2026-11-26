'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface StatCard {
  icon?: string;
  title?: string;
  description?: string;
}

export interface RpaOverviewMetricsContent {
  subtitle?: string;
  subtitleColor?: string;
  cards?: StatCard[];
}

export function RpaOverviewMetrics({ content }: { content?: RpaOverviewMetricsContent }) {
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

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 bg-[#eff6ff] font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">
        {/* Subtitle / Stepper Header */}
        {subtitle && (
          <div className="text-center mb-10">
            <motion.h3
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-lg sm:text-xl font-bold text-slate-800 tracking-tight"
              style={content?.subtitleColor ? { color: content.subtitleColor } : undefined}
            >
              {subtitle}
            </motion.h3>
          </div>
        )}

        {/* 3 Metric Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
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
                <div className="w-14 h-14 relative flex items-center justify-center bg-blue-50/50 rounded-xl overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI(card.icon.trim())}
                    alt={card.title || 'Metric Icon'}
                    className="w-8 h-8 object-contain"
                  />
                </div>
              )}
              <div className="space-y-1">
                <span className="text-3xl font-extrabold text-[#27256b] block">
                  {card.title}
                </span>
                <span className="text-sm font-medium text-slate-500 block uppercase tracking-wider">
                  {typeof card.description === 'string' && (card.description.includes('<p>') || card.description.includes('<')) ? (
                    <span dangerouslySetInnerHTML={{ __html: card.description }} />
                  ) : (
                    card.description
                  )}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
