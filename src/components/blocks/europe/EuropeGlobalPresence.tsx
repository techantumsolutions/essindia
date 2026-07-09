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
  { number: '30+', label: 'Years of Expertise' },
  { number: '15+', label: 'Industry Sectors' },
  { number: '500+', label: 'Enterprise Clients' },
  { number: '98%', label: 'Client Satisfaction' },
];

export function EuropeGlobalPresence({ content }: { content?: EuropeGlobalPresenceContent }) {
  const image = content?.image || '/About-Europe/image 141.png';
  const title = content?.title || 'Discover why over 200,000 businesses trust the Sinch Super Network';
  const titleColor = '#ffffff';
  const subtitle = content?.subtitle || 'The ESS India Super Network';
  const subtitleColor = '#94a3b8';
  const description =
    content?.description ||
    "Meet the network that powers other networks. It's the most direct, secure, and reliable tier-1 network for messaging, voice, and email.";
  const descriptionColor = '#94a3b8';
  const statistics = (content?.statistics?.length ? content.statistics : DEFAULT_STATS).slice(0, 4);

  return (
    <EuropeSectionShell
      content={{
        ...content,
        backgroundColor: '#111827',
        sectionPaddingTop: content?.sectionPaddingTop || 'pt-16',
        sectionPaddingBottom: content?.sectionPaddingBottom || 'pb-16',
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
            <p className="text-sm font-normal text-slate-400 tracking-wide">
              {subtitle}
            </p>
          )}
          {title && (
            <h2 className="text-3xl sm:text-[38px] leading-[1.2] font-semibold text-white">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm leading-relaxed" style={{ color: descriptionColor }}>
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
                  <div className="text-3xl sm:text-4xl font-bold mb-1 text-[#f5c234]">
                    {stat.number}
                  </div>
                )}
                {stat.label && (
                  <div className="text-sm font-medium text-white">{stat.label}</div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EuropeSectionShell>
  );
}
