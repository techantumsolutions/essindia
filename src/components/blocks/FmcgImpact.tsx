'use client';

import React from 'react';
import Image from 'next/image';

interface ImpactCard {
  image: string;
  title: string;
}

interface FmcgImpactContent {
  title?: string;
  cards?: ImpactCard[];
}

export function FmcgImpact({ content }: { content?: FmcgImpactContent }) {
  const title = content?.title || 'FMCG BI That Delivers Measurable Financial Impact';

  const defaultCards: ImpactCard[] = [
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 1.png',
      title: 'Reduce stock-outs by 20–40%'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 2.png',
      title: 'Cut slow-moving inventory by 10–15%'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 3.png',
      title: 'Improve scheme and promotion ROI'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 4.png',
      title: 'Increase secondary sales across markets'
    },
    {
      image: '/BI-industy solution-FMGC/ChatGPT Image Jun 17, 2026, 07_04_49 PM 5.png',
      title: 'Release working capital from excess inventory'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 px-6 bg-white border-b ">
      <div className="container mx-auto max-w-7xl text-center space-y-12">

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight max-w-2xl mx-auto">
          {title}
        </h2>

        {/* Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-100 rounded-2xl p-6 flex flex-col items-center justify-between text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 min-h-[220px] group"
            >
              {/* Icon Container */}
              {card.image && (
                <div className="w-28 h-28 rounded-full bg-slate-50 flex items-center justify-center border border-slate-100 relative overflow-hidden shrink-0">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-contain p-4 transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              {/* Line Divider */}
              <div className="w-8 h-[2px] bg-slate-300 my-4" />

              {/* Title */}
              <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">
                {card.title}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
