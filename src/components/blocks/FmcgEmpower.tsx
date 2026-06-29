'use client';

import React from 'react';
import Image from 'next/image';

interface EmpowerCard {
  icon: string;
  title: string;
  description: string;
}

interface FmcgEmpowerContent {
  title?: string;
  subtitle?: string;
  cards?: EmpowerCard[];
}

export function FmcgEmpower({ content }: { content?: FmcgEmpowerContent }) {
  const title = content?.title || 'How Business Intelligence Empowers Leaders?';
  const subtitle = content?.subtitle || 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.';

  const defaultCards: EmpowerCard[] = [
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-1.png',
      title: 'Real-Time Store Sales Visibility',
      description: 'Business Intelligence brings store sales data from POS systems into live dashboards. FMCG leaders can monitor performance during the day and take action before sales opportunities are lost.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com.png',
      title: 'Single Source of Sales and Inventory Data',
      description: 'Business Intelligence unifies sales and inventory data into one consistent view. This removes confusion between teams and enables faster, more confident decisions.'
    },
    {
      icon: '/BI-industy solution-FMGC/box_svgrepo.com.png',
      title: 'SKU-Level Inventory Visibility Across Markets',
      description: 'Business Intelligence provides clear visibility into inventory at SKU and market levels. Leaders can quickly identify slow-moving products, stock gaps, and excess inventory.'
    },
    {
      icon: '/BI-industy solution-FMGC/analytics_svgrepo.com-2.png',
      title: 'Real-Time Demand Forecasting',
      description: 'Business Intelligence continuously updates forecasts using current sales trends and demand signals. This helps FMCG teams respond quickly to market changes instead of relying only on past data.'
    },
    {
      icon: '/BI-industy solution-FMGC/my-qr-code_svgrepo.com.png',
      title: 'Automated Sales and Inventory Reporting',
      description: 'Business Intelligence automates reporting across systems and eliminates manual spreadsheets. Teams get timely, accurate insights without delays or errors.'
    },
    {
      icon: '/BI-industy solution-FMGC/supply-chain-optimization-02_svgrepo.com.png',
      title: 'Early Detection of Supply Issues',
      description: 'Business Intelligence monitors supply and distribution data continuously. Potential disruptions and stock risks become visible before stockouts occur.'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  return (
    <section className="py-14 px-6 bg-[#eff3f8] border-b border-slate-100">
      <div className="container mx-auto max-w-7xl text-center space-y-12">
        
        {/* Header Block */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2a2b6a] leading-tight">
            {title}
          </h2>
          <p className="text-slate-500 text-sm sm:text-base leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-left">
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="bg-white border border-[#2b2a6c]/10 rounded-3xl p-8 space-y-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-start group"
            >
              {/* Icon */}
              {card.icon && (
                <div className="w-12 h-12 relative flex-shrink-0 flex items-center justify-start">
                  <Image
                    src={card.icon}
                    alt={card.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              )}

              {/* Text info */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-[#1e293b] leading-snug">
                  {card.title}
                </h3>
                <p className="text-slate-500 text-xs sm:text-sm leading-relaxed">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
