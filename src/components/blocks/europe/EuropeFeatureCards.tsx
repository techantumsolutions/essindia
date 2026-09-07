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
  // Determine cards visible based on window width (1 on mobile < 640px, 2 on tablet < 1024px, 3 on desktop >= 1024px)
  const [visibleCount, setVisibleCount] = React.useState(3);

  React.useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setVisibleCount(1);
      } else if (window.innerWidth < 1024) {
        setVisibleCount(2);
      } else {
        setVisibleCount(3);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const maxIndex = Math.max(0, cards.length - visibleCount);

  const next = () => {
    if (startIndex < maxIndex) {
      setStartIndex(prev => prev + 1);
    }
  };

  const prev = () => {
    if (startIndex > 0) {
      setStartIndex(prev => prev - 1);
    }
  };

  const canGoLeft = startIndex > 0;
  const canGoRight = startIndex < maxIndex;

  // Calculate slide step percentage
  // Mobile: 100% + gap, Tablet: 50% + gap, Desktop: 33.333% + gap
  const stepPercent = visibleCount === 1 ? 100 : visibleCount === 2 ? 50 : 33.3333;
  const gapPx = visibleCount === 1 ? 24 : visibleCount === 2 ? 12 : 16;

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#ffffff' }}>
      <div className="relative w-full px-12 sm:px-14 lg:px-16">
        
        {/* Left Arrow Button (visible only if there are cards to the left) */}
        {canGoLeft && (
          <button
            type="button"
            onClick={prev}
            className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-slate-200 bg-white/90 text-slate-700 hover:bg-white hover:scale-110 shadow-md transition-all flex items-center justify-center cursor-pointer"
            aria-label="Previous card"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Right Arrow Button (visible only if there are more cards to the right) */}
        {canGoRight && (
          <button
            type="button"
            onClick={next}
            className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full border border-slate-200 bg-white/90 text-slate-700 hover:bg-white hover:scale-110 shadow-md transition-all flex items-center justify-center cursor-pointer"
            aria-label="Next card"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}

        {/* Cards Carousel Container */}
        <div className="relative overflow-hidden w-full py-2">
          <div 
            className="flex transition-transform duration-500 ease-out gap-6"
            style={{
              transform: `translateX(calc(-${startIndex * stepPercent}% - ${startIndex * gapPx}px))`,
            }}
          >
            {cards.map((card, index) => (
              <motion.article
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex flex-col w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0"
              >
                {card.image && (
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-50 border border-slate-100 rounded-xl">
                    <Image
                      src={card.image}
                      alt={card.title || `Feature ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                )}
                <div className="flex flex-col flex-1 py-5">
                  {card.title && (
                    <h3 className="text-xl font-bold text-slate-900 mb-2 leading-snug">{card.title}</h3>
                  )}
                  {card.description && (
                    <p className="text-sm text-slate-500 leading-relaxed flex-1 font-light">{card.description}</p>
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
