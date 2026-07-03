'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface FeatureCard {
  image?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

export interface EuropeFeatureCardsContent extends EuropeCommonSettings {
  cards?: FeatureCard[];
}

const DEFAULT_CARDS: FeatureCard[] = [
  {
    image: '/industry-solution-Retail/industry-1.png',
    title: 'Production Management',
    description: 'Plan, schedule, and monitor manufacturing operations with real-time visibility across plants and production lines.',
    buttonText: 'Learn More',
    buttonLink: '/solutions',
  },
  {
    image: '/industry-solution-Retail/industry-2.png',
    title: 'Financial Management',
    description: 'Unify accounting, budgeting, and compliance with multi-currency support tailored for European regulatory frameworks.',
    buttonText: 'Learn More',
    buttonLink: '/solutions',
  },
  {
    image: '/industry-solution-Retail/industry-3.png',
    title: 'Supply Chain & Logistics',
    description: 'Optimize procurement, warehousing, and distribution with end-to-end traceability across your European network.',
    buttonText: 'Learn More',
    buttonLink: '/solutions',
  },
  {
    image: '/industry-solution-Retail/img-2.png',
    title: 'Business Intelligence',
    description: 'Turn operational data into actionable insights with dashboards designed for finance, operations, and leadership teams.',
    buttonText: 'Learn More',
    buttonLink: '/solutions',
  },
];

export function EuropeFeatureCards({ content }: { content?: EuropeFeatureCardsContent }) {
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 12);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: content?.backgroundColor || '#ffffff' }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
        {cards.map((card, index) => (
          <motion.article
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            className="flex flex-col"
          >
            {card.image && (
              <div className="relative aspect-square w-full bg-slate-50">
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
                <h3 className="text-lg font-bold text-slate-900 mb-3">{card.title}</h3>
              )}
              {card.description && (
                <p className="text-sm text-slate-500 leading-relaxed flex-1 mb-4">{card.description}</p>
              )}
              {card.buttonText && (
                <Link
                  href={card.buttonLink || '#'}
                  className="inline-flex items-center text-sm underline font-semibold text-blue-600 hover:text-[#4B2A63] transition-colors mt-auto"
                >
                  {card.buttonText}
                </Link>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </EuropeSectionShell>
  );
}
