'use client';

import React from 'react';
import Image from 'next/image';

interface ChallengeCard {
  icon: string;
  title: string;
  description: string;
}

interface FmcgChallengesContent {
  title?: string;
  cards?: ChallengeCard[];
}

export function FmcgChallenges({ content }: { content?: FmcgChallengesContent }) {
  const title = content?.title || 'Why Smart FMCG Leaders Still Make Slow Decisions';
  
  const defaultCards: ChallengeCard[] = [
    {
      icon: '/BI-industy solution-FMGC/data_svgrepo.com.png',
      title: 'Store Sales Data Arrives Late',
      description: 'Daily store sales data is often available only after business hours or the next day. By the time leadership reviews performance, the opportunity to correct low sales or stock issues has already passed.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics-board-bussiness_svgrepo.com.png',
      title: 'Sales And Inventory Data Don’t Match',
      description: 'Sales data from POS systems, and inventory data from warehouses or stores frequently show different numbers. Teams spend time verifying data instead of acting on it, slowing down decision-making.'
    },
    {
      icon: '/BI-industy solution-FMGC/announcement-marketing-outline-2_svgrepo.com.png',
      title: 'Limited SKU-Level Inventory Visibility',
      description: 'Retailers lack a clear view of inventory at the individual SKU and store level. This leads to fast-moving products going out of stock in some locations while excess inventory builds in others.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-3.png',
      title: 'Forecasts Miss Real-Time Demand Changes',
      description: 'Demand forecasts rely heavily on historical data and do not adjust quickly to promotions, local events, or sudden changes in customer behavior. As a result, stock planning becomes inaccurate.'
    },
    {
      icon: '/BI-industy solution-FMGC/product_svgrepo.com.png',
      title: 'Manual Sales and Inventory Reporting',
      description: 'Sales and inventory reports are often created manually using spreadsheets. This process is time-consuming, error-prone, and delays access to critical performance insights.'
    },
    {
      icon: '/BI-industy solution-FMGC/favorite-chart_svgrepo.com.png',
      title: 'Supply Issues Identified After Stockouts',
      description: 'Supply or distribution problems are usually discovered only after products are already unavailable on shelves. This results in lost sales and poor customer experience.'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 px-6 bg-white border-b border-slate-100">
      <div className="container mx-auto max-w-7xl text-center space-y-12">
        
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight max-w-3xl mx-auto">
          {title}
        </h2>

        {/* 3x2 Grid layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-8 text-center pt-4">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="space-y-4 max-w-sm mx-auto flex flex-col items-center group"
            >
              {/* Icon */}
              {card.icon && (
                <div className="w-14 h-14 relative flex-shrink-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* Title */}
              <h3 className="text-lg font-bold text-[#1e293b]">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-xs sm:text-sm leading-relaxed font-light">
                {card.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
