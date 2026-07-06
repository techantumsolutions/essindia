'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

interface Statistic {
  number?: string;
  label?: string;
}

export interface EuropeGlobalPresenceContent extends EuropeCommonSettings {
  image?: string;
  title?: string;
  titleColor?: string;
  subtitle?: string;
  subtitleColor?: string;
  description?: string;
  descriptionColor?: string;
  statistics?: Statistic[];
}

const DEFAULT_STATS: Statistic[] = [
  { number: '30+', label: 'Years Experience' },
  { number: '15+', label: 'Global Offices' },
  { number: '200,000+', label: 'Businesses Served' },
  { number: '35+', label: 'Countries' },
];

export function EuropeGlobalPresence({ content }: { content?: EuropeGlobalPresenceContent }) {
  const image = content?.image || '/Career-Page/Group 1.png';
  const title = content?.title || 'Discover why over 200,000 businesses trust ebizframe ERP';
  const titleColor = content?.titleColor || '#ffffff';
  const subtitle = content?.subtitle || 'Global Presence';
  const subtitleColor = content?.subtitleColor || '#fbbf24';
  const description =
    content?.description ||
    'With offices across Europe, Asia, and the Americas, ESS delivers localized expertise backed by a proven global ERP platform.';
  const descriptionColor = content?.descriptionColor || '#cbd5e1';
  const statistics = content?.statistics?.length ? content.statistics : DEFAULT_STATS;

  return (
    <EuropeSectionShell
      content={{
        ...content,
        backgroundColor: content?.backgroundColor || '#0d0720',
        sectionPaddingTop: content?.sectionPaddingTop || 'pt-24',
        sectionPaddingBottom: content?.sectionPaddingBottom || 'pb-24',
      }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative aspect-square max-w-lg mx-auto lg:mx-0 w-full"
        >
          {image && (
            <Image
              src={image}
              alt="Global presence map"
              fill
              className="object-contain"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          )}
        </motion.div>

        <div className="space-y-6">
          {subtitle && (
            <p className="text-sm font-bold uppercase tracking-widest" style={{ color: subtitleColor }}>
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-4xl font-bold leading-tight" style={{ color: titleColor }}>
              {title}
            </h2>
          )}
          {description && (
            <p className="text-base leading-relaxed" style={{ color: descriptionColor }}>
              {description}
            </p>
          )}

          <div className="grid grid-cols-2 gap-6 pt-4">
            {statistics.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-left"
              >
                {stat.number && (
                  <div className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: subtitleColor }}>
                    {stat.number}
                  </div>
                )}
                {stat.label && (
                  <div className="text-sm text-slate-300">{stat.label}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EuropeSectionShell>
  );
}
