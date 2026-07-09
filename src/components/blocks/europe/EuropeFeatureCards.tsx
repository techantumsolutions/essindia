'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface FeatureCard {
  image?: string;
  title?: string;
  description?: string;
}

export interface EuropeFeatureCardsContent extends EuropeCommonSettings {
  cards?: FeatureCard[];
}

const DEFAULT_CARDS: FeatureCard[] = [
  {
    image: '/About-Europe/Rectangle 4326.png',
    title: 'Production Management',
    description: 'Manage production with real-time work order tracking, advanced scheduling, and live monitoring, helping identify bottlenecks, optimize resource allocation, and ensure smooth, timely execution of manufacturing processes across all stages.',
  },
  {
    image: '/About-Europe/Rectangle 4342.png',
    title: 'Financial Management',
    description: 'Manage finances with integrated data, real-time budget tracking, and automated reporting, providing clear insights into cash flow, expenses, and profitability while enabling better financial control and faster decision-making.',
  },
  {
    image: '/About-Europe/Rectangle 4343.png',
    title: 'Reporting and Analytics',
    description: 'Generate real-time reports and customizable dashboards with key performance indicators, enabling data-driven insights, better decision-making, and complete visibility across all business operations and modules.',
  },
  {
    image: '/About-Europe/Rectangle 4344.png',
    title: 'Inventory Control',
    description: 'Track raw materials, work-in-progress, and finished goods with real-time visibility, automated reorder alerts, and accurate stock data, ensuring optimal inventory levels, reduced shortages, and efficient material management.',
  },
];

export function EuropeFeatureCards({ content }: { content?: EuropeFeatureCardsContent }) {
  const cards = content?.cards?.length ? content.cards : DEFAULT_CARDS;
  const [startIndex, setStartIndex] = useState(0);
  const showSlider = cards.length > 4;

  const next = () => {
    if (startIndex < cards.length - 4) {
      setStartIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#ffffff' }}>
      <div className="relative w-full space-y-6">
        {/* Slider Controls (rendered only if > 4 cards) */}
        {showSlider && (
          <div className="flex justify-end gap-2 mb-4">
            <button
              onClick={prev}
              disabled={startIndex === 0}
              className="p-3 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Previous cards"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={next}
              disabled={startIndex >= cards.length - 4}
              className="p-3 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-40 disabled:hover:bg-white"
              aria-label="Next cards"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        <div className="relative overflow-hidden w-full">
          <div 
            className={showSlider ? "flex transition-transform duration-500 ease-out gap-6 lg:gap-8" : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"}
            style={showSlider ? {
              transform: `translateX(-${startIndex * 25}%)`,
              width: `${(cards.length / 4) * 100}%`
            } : undefined}
          >
            {cards.map((card, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col"
                style={showSlider ? {
                  width: `calc(25% - 24px)`,
                  flexShrink: 0
                } : undefined}
              >
                {card.image && (
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50">
                    <Image
                      src={card.image}
                      alt={card.title || `Feature ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 25vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 py-6">
                  {card.title && (
                    <h3 className="text-xl font-bold text-slate-900 mb-3">{card.title}</h3>
                  )}
                  {card.description && (
                    <p className="text-sm text-slate-500 leading-relaxed flex-1">{card.description}</p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </EuropeSectionShell>
  );
}
