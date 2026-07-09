'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { EuropeCommonSettings, EuropeSectionShell } from './EuropeSectionShell';

import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

import { ArrowRight } from 'lucide-react';

interface CardItem {
  title?: string;
  description?: string;
}

export interface EuropeProductShowcaseContent extends EuropeCommonSettings {
  deviceImage?: string;
  badgeText?: string;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  cards?: CardItem[];
}

const DEFAULT_CARDS: CardItem[] = [
  { title: 'Trusted Branding', description: 'Trusted branding' },
  { title: 'Verified Sender ID', description: 'Verified sender ID' },
  { title: 'Richer Media', description: 'Richer media' },
  { title: 'Time-Saving Actions', description: 'Time-saving actions' },
];

export function EuropeProductShowcase({ content }: { content?: EuropeProductShowcaseContent }) {
  const deviceImage = content?.deviceImage || '/About-Europe/rcs-carousel-benefits-highlight%201.png';
  const badgeText = content?.badgeText || 'RCS FOR BUSINESS';
  const title = content?.title || 'Getting started with Albino is easier than ever';
  const description =
    content?.description ||
    'With lots of unique blocks, you can easily build a page without coding. Build your next landing page so quickly with Albino.';
  const buttonText = content?.buttonText || 'Meet our team';
  const buttonUrl = content?.buttonUrl || '/contact-us';
  const buttonFormType = (content?.buttonFormType || '') as CtaFormType;
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 4);

  const { handleClick: handleBtnClick, modalNode } = useCtaAction(buttonUrl, buttonFormType);

  return (
    <EuropeSectionShell content={{ ...content, backgroundColor: '#eef2f6' }}>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center min-h-[350px] lg:min-h-full"
        >
          <div className="relative w-full h-full min-h-[350px] lg:min-h-[500px]">
            {deviceImage && (
              <Image
                src={deviceImage}
                alt="ebizframe mobile app"
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 50vw"
                priority
              />
            )}
          </div>
        </motion.div>

        <div className="flex flex-col justify-center space-y-4 text-left">
          {badgeText && (
            <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#231f61]">
              {badgeText}
            </span>
          )}
          {title && (
            <h2 className="text-3xl sm:text-[40px] leading-[1.15] font-bold text-[#111827]">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-xl">
              {description}
            </p>
          )}
          {buttonText && (
            <Link
              href={buttonUrl}
              onClick={buttonFormType ? (e) => { e.preventDefault(); handleBtnClick(); } : undefined}
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg text-sm font-medium text-white bg-[#231f61] hover:bg-[#1a174d] transition-all shadow-md w-fit cursor-pointer"
            >
              {buttonText}
              <ArrowRight className="w-4 h-4" aria-hidden="true" />
            </Link>
          )}
          {modalNode}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {cards.map((card, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.08 }}
                className="bg-white rounded-xl p-5 border border-slate-100 shadow-sm"
              >
                {card.title && (
                  <h4 className="text-sm font-bold text-slate-900 mb-1.5">{card.title}</h4>
                )}
                {card.description && (
                  <p className="text-xs text-slate-500 leading-relaxed">{card.description}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </EuropeSectionShell>
  );
}
