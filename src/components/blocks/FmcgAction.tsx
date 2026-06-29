'use client';

import React from 'react';
import Image from 'next/image';

interface ActionCard {
  badge: string;
  title: string;
  description: string;
  image: string;
  badgeBorderColor?: string; // internal styling helper
  badgeTextColor?: string;   // internal styling helper
  badgeBgColor?: string;     // internal styling helper
}

interface FmcgActionContent {
  title?: string;
  description?: string;
  cards?: ActionCard[];
}

export function FmcgAction({ content }: { content?: FmcgActionContent }) {
  const title = content?.title || 'AI in BI | From Data to Action';
  const description = content?.description || 'Our BI solution is powered by EVA, an AI-powered assistant embedded into our BI dashboards. It empowers users by allowing them to interact and communicate directly with their data. Users can ask questions in plain English and instantly receive clear, actionable insights. You can also attach external files such as PDFs and industry reports to provide additional context.';

  const defaultCards: ActionCard[] = [
    {
      badge: '01',
      title: 'What Changed',
      description: 'AI instantly highlights unusual shifts in sales, inventory, or performance.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 2.png',
      badgeBorderColor: '#ff9800',
      badgeTextColor: '#ff9800',
      badgeBgColor: '#fff8f0'
    },
    {
      badge: '02',
      title: 'Why It Changed',
      description: 'AI explains the key factors driving those changes, such as demand, pricing, or supply issues.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 3.png',
      badgeBorderColor: '#2196f3',
      badgeTextColor: '#2196f3',
      badgeBgColor: '#f0f8ff'
    },
    {
      badge: '03',
      title: 'What To Do Next',
      description: 'AI suggests actionable insights so leaders can respond quickly and confidently.',
      image: '/BI-industy solution-FMGC/b0d035cf-91e0-4b0d-a119-6140c8620504 4.png',
      badgeBorderColor: '#4caf50',
      badgeTextColor: '#4caf50',
      badgeBgColor: '#f1f9f1'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  // Static styling helpers mapped to index if not customized
  const getBadgeStyles = (card: ActionCard, idx: number) => {
    if (card.badgeBorderColor) {
      return {
        borderColor: card.badgeBorderColor,
        color: card.badgeTextColor,
        backgroundColor: card.badgeBgColor
      };
    }
    const colorMaps = [
      { border: '#ff9800', text: '#ff9800', bg: '#fff8f0' },
      { border: '#2196f3', text: '#2196f3', bg: '#f0f8ff' },
      { border: '#4caf50', text: '#4caf50', bg: '#f1f9f1' }
    ];
    const map = colorMaps[idx % colorMaps.length];
    return {
      borderColor: map.border,
      color: map.text,
      backgroundColor: map.bg
    };
  };

  const getCardStyles = (idx: number) => {
    const cardColorMaps = [
      { border: '#ffe8d6', bg: 'linear-gradient(135deg, #ffffff 0%, #fffbf7 100%)' },
      { border: '#d6eaff', bg: 'linear-gradient(135deg, #ffffff 0%, #f7faff 100%)' },
      { border: '#e0f5e0', bg: 'linear-gradient(135deg, #ffffff 0%, #f8fdf8 100%)' }
    ];
    const map = cardColorMaps[idx % cardColorMaps.length];
    return {
      borderColor: map.border,
      backgroundImage: map.bg
    };
  };

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl text-center space-y-12">

        {/* Header Title & Description */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {cards.map((card, idx) => {
            const badgeStyle = getBadgeStyles(card, idx);
            const cardStyle = getCardStyles(idx);
            return (
              <div
                key={idx}
                className="border rounded-3xl p-8 relative flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[380px] group"
                style={cardStyle}
              >
                <div className="space-y-4 relative z-10">
                  {/* Badge */}
                  {card.badge && (
                    <div
                      className="w-10 h-10 rounded-lg border-2 flex items-center justify-center text-sm font-bold"
                      style={badgeStyle}
                    >
                      {card.badge}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="text-xl font-bold text-[#2a2b6a]">
                    {card.title}
                  </h3>

                  {/* Description */}
                  <p className="text-slate-500 text-sm leading-relaxed max-w-[240px]">
                    {card.description}
                  </p>
                </div>

                {/* Card Image at Bottom Right */}
                {card.image && (
                  <div className="absolute bottom-4 right-4 w-40 h-40">
                    <div className="relative w-full h-full">
                      <Image
                        src={card.image}
                        alt={card.title}
                        fill
                        className="object-contain object-bottom transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
