'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';
import { CmsHeading } from '@/components/cms/CmsHeading';
import { FileText } from 'lucide-react';

interface ReportCard {
  image?: string;
  category?: string;
  title?: string;
  link?: string;
}

export interface EuropeReportsContent extends EuropeCommonSettings {
  sectionTitle?: string;
  sectionTitleColor?: string;
  headingTag?: string;
  cards?: ReportCard[];
}

const DEFAULT_CARDS: ReportCard[] = [
  {
    image: '/About-Europe/Container.png',
    title: 'ESS INDIA is a 2026 Gartner® Magic Quadrant™ Leader for CPaaS',
  },
  {
    image: '/About-Europe/Container-1.png',
    title: 'ESS INDIA named a Leader in IDC MarketScape for Communications Engagement',
  },
  {
    image: '/About-Europe/Container-2.png',
    title: 'The AI Production Paradox',
  },
];

export function EuropeReports({ content }: { content?: EuropeReportsContent }) {
  const sectionTitle = content?.sectionTitle || "Learn why we're the trusted CPaaS leader";
  const sectionTitleColor = '#111827';
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 3);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: '#ffffff' }}>
      {sectionTitle && (
        <CmsHeading
          tag={undefined}
          fallback="h2"
          className="text-3xl sm:text-[38px] font-bold text-center mb-12 tracking-tight"
          style={{ color: sectionTitleColor }}
        >
          {sectionTitle}
        </CmsHeading>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {cards.map((card, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className="group flex flex-col bg-transparent"
          >
            {card.image && (
              <div className="relative aspect-[16/10] w-full bg-slate-50 overflow-hidden rounded-lg">
                <Image
                  src={card.image}
                  alt={card.title || `Report ${index + 1}`}
                  fill
                  className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
            )}
            <div className="flex flex-col flex-1 pt-4 text-left">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
                <FileText className="w-4 h-4 text-slate-700" />
                <span>Reports</span>
              </div>
              {card.title && (
                <h3 className="text-lg font-bold text-slate-900 leading-snug mb-4 flex-1">
                  {card.title}
                </h3>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </EuropeSectionShell>
  );
}
