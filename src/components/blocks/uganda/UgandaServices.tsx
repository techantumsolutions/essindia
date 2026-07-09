'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface ServiceCard {
  image?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
}

export interface UgandaServicesContent {
  badgeText?: string;
  title?: string;
  cards?: ServiceCard[];
}

const DEFAULT_CARDS: ServiceCard[] = [
  {
    image: '/About-Uganda/Designer-rafiki.png',
    title: 'Custom Software Development',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    ctaText: 'Learn more',
    ctaUrl: '/contact-us',
  },
  {
    image: '/About-Uganda/Programming-rafiki.png',
    title: 'Web & Mobile App Development',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    ctaText: 'Learn more',
    ctaUrl: '/contact-us',
  },
  {
    image: '/About-Uganda/Notes-rafiki.png',
    title: 'Enterprise & ERP Solutions',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    ctaText: 'Learn more',
    ctaUrl: '/contact-us',
  },
  {
    image: '/About-Uganda/image 148.png',
    title: 'Cloud Application Development',
    description: 'With lots of unique blocks, you can easily build a page without coding. Build your next landing page.',
    ctaText: 'Learn more',
    ctaUrl: '/contact-us',
  },
];

const CARD_BACKGROUNDS = [
  'bg-[#52d08a]', // Green
  'bg-[#473ef2]', // Blue
  'bg-[#f24946]', // Red
  'bg-[#1d1b4b]', // Indigo
];

function CardItem({ card, index }: { card: ServiceCard; index: number }) {
  const { handleClick, modalNode } = useCtaAction(
    card.ctaUrl || '/contact-us',
    (card.ctaFormType || '') as CtaFormType
  );

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`flex flex-col rounded-2xl p-6 text-center text-white min-h-[380px] justify-between shadow-lg hover:translate-y-[-4px] transition-all duration-300 ${CARD_BACKGROUNDS[index % CARD_BACKGROUNDS.length]}`}
    >
      <div className="flex flex-col items-center">
        {card.image && (
          <div className="relative w-full aspect-[4/3] max-w-[180px] mb-6">
            <Image
              src={card.image}
              alt={card.title || 'Service Image'}
              fill
              className="object-contain"
              sizes="180px"
              priority
            />
          </div>
        )}
        {card.title && (
          <h3 className="text-lg sm:text-[20px] font-bold leading-snug mb-3 min-h-[56px] flex items-center justify-center">
            {card.title}
          </h3>
        )}
        {card.description && (
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-[240px]">
            {card.description}
          </p>
        )}
      </div>

      {card.ctaText && (
        <div className=" flex justify-center">
          <Link
            href={card.ctaUrl || '/contact-us'}
            onClick={card.ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
            className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
          >
            <span>{card.ctaText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}
      {modalNode}
    </motion.article>
  );
}

export function UgandaServices({ content }: { content?: UgandaServicesContent }) {
  const badgeText = content?.badgeText || 'OUR SERVICES';
  const title = content?.title || 'We provide great services for our customers based on needs';
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 4);

  return (
    <section className="w-full py-14 bg-white flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
        {badgeText && (
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-[#3b4b8a] mb-3">
            {badgeText}
          </span>
        )}
        {title && (
          <h2 className="text-2xl sm:text-[34px] font-bold text-[#111827] tracking-tight max-w-2xl mx-auto leading-tight">
            {title}
          </h2>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 max-w-7xl mx-auto">
          {cards.map((card, index) => (
            <CardItem key={index} card={card} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
