'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface IndustryCard {
  image?: string;
  title?: string;
  description?: string;
}

export interface UgandaIndustriesContent {
  subtitle?: string;
  title?: string;
  description?: string;
  cards?: IndustryCard[];
}

const DEFAULT_CARDS: IndustryCard[] = [
  {
    image: '/About-Uganda/Frame 284.png',
    title: 'Manufacturing',
    description: 'Plan production, monitor quality, and control material costs.',
  },
  {
    image: '/About-Uganda/Frame 283.png',
    title: 'Distribution',
    description: 'Keep inventory, dispatch, and dealer orders synchronized.',
  },
  {
    image: '/About-Uganda/Frame 282.png',
    title: 'Retail and Trading',
    description: 'Connect sales, procurement, collections, and branch stock.',
  },
  {
    image: '/About-Uganda/Frame 281.png',
    title: 'Services',
    description: 'Manage projects, people, billing, and business performance.',
  },
];

export function UgandaIndustries({ content }: { content?: UgandaIndustriesContent }) {
  const subtitle = content?.subtitle || 'ESS for Industry';
  const title = content?.title || 'Built for Ugandan businesses with\ncomplex operating models.';
  const description = content?.description || 'The page now makes industry relevance visible early, with practical scenarios instead of a long navigation list.';
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 4);

  return (
    <section className="w-full py-14 bg-white flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
        {subtitle && (
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            {subtitle}
          </span>
        )}
        {title && (
          <h2 className="text-2xl sm:text-[34px] font-bold text-[#1d1b4b] mb-4 tracking-tight max-w-3xl mx-auto leading-tight whitespace-pre-line">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-all duration-300 aspect-[4/5] min-h-[360px] flex flex-col justify-end text-left p-6 text-white group"
            >
              {card.image && (
                <Image
                  src={card.image}
                  alt={card.title || 'Industry Image'}
                  fill
                  className="object-cover transition-transform duration-550 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 25vw"
                  priority
                />
              )}
              {/* Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#101344]/95 via-[#101344]/50 to-transparent z-10" />

              <div className="relative z-20">
                {card.title && (
                  <h3 className="text-lg sm:text-[22px] font-extrabold mb-2 tracking-tight">
                    {card.title}
                  </h3>
                )}
                {card.description && (
                  <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
                    {card.description}
                  </p>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
