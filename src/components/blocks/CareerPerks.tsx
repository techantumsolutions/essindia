'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface PerkItem {
  text?: string;
}

interface CareerPerksProps {
  content?: {
    title?: string;
    tag?: string;
    perks?: PerkItem[];
    bgColor?: string;
    bgGradientFrom?: string;
    bgGradientVia?: string;
    bgGradientTo?: string;
    titleColor?: string;
    tagTextColor?: string;
    cardBgColor?: string;
    cardBorderColor?: string;
    cardTextColor?: string;
    cardHoverBorderColor?: string;
    cardHoverBgFrom?: string;
    cardHoverBgVia?: string;
    cardHoverBgTo?: string;
    cardHoverTextColor?: string;
  };
}

export default function CareerPerks({ content }: CareerPerksProps) {
  const title = content?.title || 'Perks & Benefits';
  const tag = content?.tag || 'We care about our people so they can take care of our clients';
  const perks =
    content?.perks && content.perks.length > 0
      ? content.perks
      : [
          { text: 'Health & Wellness Benefits' },
          { text: 'Performance Bonuses' },
          { text: 'Life Skill Certification Support' },
          { text: 'International Project Exposure' },
          { text: 'Flexible Work Arrangements' },
          { text: 'Fast-Track Growth Path' },
        ];

  const bgGradientFrom = content?.bgGradientFrom || '#F5F0FF';
  const bgGradientVia = content?.bgGradientVia || '#EDE9FE';
  const bgGradientTo = content?.bgGradientTo || '#E0E7FF';
  const bgColor = content?.bgColor || '';
  const titleColor = content?.titleColor || '#0f172a';
  const tagTextColor = content?.tagTextColor || '#475569';
  const cardBgColor = content?.cardBgColor || 'rgba(255,255,255,0.95)';
  const cardBorderColor = content?.cardBorderColor || 'rgba(226,232,240,0.8)';
  const cardTextColor = content?.cardTextColor || '#1e293b';
  const cardHoverBorderColor = content?.cardHoverBorderColor || 'rgba(75,42,99,0.8)';
  const cardHoverBgFrom = content?.cardHoverBgFrom || '#4B2A63';
  const cardHoverBgVia = content?.cardHoverBgVia || '#5B3179';
  const cardHoverBgTo = content?.cardHoverBgTo || '#6B3A8E';
  const cardHoverTextColor = content?.cardHoverTextColor || '#ffffff';

  return (
    <section
      className="py-16 md:py-24 px-6 relative overflow-hidden font-sans border-y"
      style={{
        background: bgColor
          ? bgColor
          : `linear-gradient(to bottom right, ${bgGradientFrom}, ${bgGradientVia}, ${bgGradientTo})`,
        borderColor: 'rgba(233, 213, 255, 0.6)',
      }}
    >
      {/* <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[650px] bg-purple-300/35 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-300/30 rounded-full blur-[120px] pointer-events-none" /> */}

      <div className="container mx-auto max-w-7xl relative z-10 text-center">
        <div className="max-w-3xl mx-auto mb-14">
          <h2
            className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4"
            style={{ color: titleColor }}
          >
            {title}
          </h2>
          <p
            className="max-w-2xl mx-auto text-base md:text-lg font-normal leading-relaxed"
            style={{ color: tagTextColor }}
          >
            {tag}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
          {perks.map((perk: PerkItem, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8, scale: 1.02 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
                delay: index * 0.05,
              }}
              className="backdrop-blur-md px-6 py-6.5 rounded-2xl shadow-[0_4px_25px_rgba(0,0,0,0.03)] relative overflow-hidden flex items-center justify-center text-center min-h-[96px] transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group cursor-pointer transform-gpu border"
              style={{
                backgroundColor: cardBgColor,
                borderColor: cardBorderColor,
                ['--perk-text' as string]: cardTextColor,
                ['--perk-hover-text' as string]: cardHoverTextColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = cardHoverBorderColor;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = cardBorderColor;
              }}
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none"
                style={{
                  background: `linear-gradient(to right, ${cardHoverBgFrom}, ${cardHoverBgVia}, ${cardHoverBgTo})`,
                }}
              />
              <span className="font-bold text-base md:text-[17px] leading-snug transition-colors duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] relative z-10 select-none text-[color:var(--perk-text)] group-hover:text-[color:var(--perk-hover-text)]">
                {typeof perk.text === 'string' ? perk.text.replace(/<[^>]*>/g, '') : perk.text}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
