'use client';

import React from 'react';
import Image from 'next/image';

interface IntegrationCard {
  image: string;
  title: string;
}

interface FmcgIntegrationsContent {
  title?: string;
  subtitle?: string;
  cards?: IntegrationCard[];
}

export function FmcgIntegrations({ content }: { content?: FmcgIntegrationsContent }) {
  const title = content?.title || 'Data Sources We Integrate';
  const subtitle = content?.subtitle || 'Each industry card now states the operational value clearly instead of burying it in broad text.';

  const defaultCards: IntegrationCard[] = [
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'Google Products'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'Pricing Software'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'Accounting Software'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'CRM'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'MIS Reports'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'SCM Software'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'POS'
    },
    {
      image: '/BI-industy solution-FMGC/Rectangle 150.png',
      title: 'External Data'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl text-center space-y-6">

        {/* Header Block */}
        <div className="space-y-2 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 8-Card Grid (4 columns on lg, 2 columns on sm/md, 1 column on xs) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col group"
            >
              {/* Image Block */}
              {card.image && (
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-slate-50">
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              )}

              {/* Title Block */}
              <div className="py-5 px-6 border-t border-slate-100 text-center">
                <h3 className="text-base sm:text-lg font-bold text-[#2a2b6a]">
                  {card.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
