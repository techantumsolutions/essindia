'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface ReportCard {
  image?: string;
  category?: string;
  title?: string;
  link?: string;
}

export interface EuropeReportsContent extends EuropeCommonSettings {
  sectionTitle?: string;
  sectionTitleColor?: string;
  cards?: ReportCard[];
}

const DEFAULT_CARDS: ReportCard[] = [
  {
    image: '/portfolio-1.png',
    category: 'Analyst Report',
    title: 'IDC MarketScape for Enterprise ERP Platforms in Europe',
    link: '/resources',
  },
  {
    image: '/portfolio-2.png',
    category: 'Whitepaper',
    title: 'Digital Transformation Roadmap for European Manufacturers',
    link: '/resources',
  },
  {
    image: '/portfolio-3.png',
    category: 'Case Study',
    title: 'How a European Retail Chain Unified 200+ Stores with ebizframe',
    link: '/case-studies',
  },
];

export function EuropeReports({ content }: { content?: EuropeReportsContent }) {
  const sectionTitle = content?.sectionTitle || "Learn why we're the trusted ERP leader in Europe";
  const sectionTitleColor = content?.sectionTitleColor || '#1e293b';
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 12);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#ffffff' }}>
      {sectionTitle && (
        <h2
          className="text-3xl sm:text-4xl font-bold text-center mb-12 tracking-tight"
          style={{ color: sectionTitleColor }}
        >
          {sectionTitle}
        </h2>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group flex flex-col rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg transition-shadow duration-300 bg-white"
          >
            {card.image && (
              <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title || `Report ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 p-6">
              {card.category && (
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3">
                  {card.category}
                </span>
              )}
              {card.title && (
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 flex-1 group-hover:text-[#4B2A63] transition-colors">
                  {card.link ? (
                    <Link href={card.link}>{card.title}</Link>
                  ) : (
                    card.title
                  )}
                </h3>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </EuropeSectionShell>
  );
}
