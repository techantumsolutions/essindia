'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface EmpowermentCard {
  icon: string;
  title: string;
  description: string;
}

interface BiEmpowermentContent {
  title?: string;
  subtitle?: string;
  cards?: EmpowermentCard[];
}

export function BiEmpowerment({ content }: { content?: BiEmpowermentContent }) {
  const title = content?.title || 'How Business Intelligence Empowers Leaders?';
  const subtitle = content?.subtitle || 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.';

  const defaultCards: EmpowermentCard[] = [
    {
      icon: '/Business intilligence/checklist-check-list-list_svgrepo.com.png',
      title: 'Faster, Confident Decision-Making',
      description: 'Leaders get clear answers when they need them, without questioning the numbers. Decisions are made quickly on trusted insights, enabling teams to act early, reduce risk, and capture opportunities.'
    },
    {
      icon: '/Business intilligence/handshake-deal_svgrepo.com.png',
      title: 'A Single Source of Truth Everyone Can Trust',
      description: 'Everyone works from the same accurate data, eliminating conflicting numbers and repeated validations. Teams spend less time reconciling reports and more time taking action, improving alignment and speed.'
    },
    {
      icon: '/Business intilligence/analytics-graph_svgrepo.com.png',
      title: 'Clear Visibility Into Business Health',
      description: 'Leaders see the full picture of performance in one place, without digging through multiple reports. Risks are identified early, strengths stand out, and decisions are made with clarity on where to focus.'
    },
    {
      icon: '/Business intilligence/analytics-graphic_svgrepo.com.png',
      title: 'Better Alignment and Accountability Across Teams',
      description: 'Teams stay aligned around shared goals with clear visibility into performance. Progress and ownership are easy to track, accountability improves, and issues are addressed early.'
    },
    {
      icon: 'Clock',
      title: 'Less Time Spent on Reporting, More Time on Strategy',
      description: 'Manual reporting is reduced, and updates reach leaders on time without follow-ups. Teams spend less time preparing reports and more time analyzing data, planning actions, and executing strategy.'
    },
    {
      icon: '/Business intilligence/statistics_svgrepo.com.png',
      title: 'Improved Profitability and Operational Control',
      description: 'Leaders gain clear visibility into costs, margins, and performance. Inefficiencies surface early, resources are used better, and opportunities are acted on faster, strengthening margins and control.'
    }
  ];

  const cards = content?.cards && content.cards.length > 0 ? content.cards : defaultCards;

  // Helper to render Lucide or PNG icon
  const renderIcon = (iconName: string) => {
    if (!iconName) return null;
    if (iconName.startsWith('/') || iconName.includes('.')) {
      return (
        <div className="relative w-12 h-12 flex-shrink-0">
          <Image src={iconName} alt="" fill className="object-contain" />
        </div>
      );
    }
    const IconComponent = (LucideIcons as any)[iconName];
    if (IconComponent) {
      return <IconComponent className="w-12 h-12 text-white stroke-[1.5] flex-shrink-0" />;
    }
    // Fallback icon
    return <LucideIcons.HelpCircle className="w-12 h-12 text-white stroke-[1.5] flex-shrink-0" />;
  };

  return (
    <section className="py-14 bg-[#e3e9f2] font-sans">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-6 space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#4c327f] tracking-tight">
            {title}
          </h2>
          <p className="text-slate-600 font-light text-base sm:text-[17px] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* 3 Column Grid of Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              whileHover={{ y: -5 }}
              className="bg-[#27256b] rounded-xl p-3 flex flex-col justify-start items-start text-left shadow-md hover:shadow-lg transition-all duration-300 border border-indigo-950/20"
            >
              <div className="mb-6 flex-shrink-0">
                {renderIcon(card.icon)}
              </div>
              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                {card.title}
              </h3>
              <p className="text-[14px] sm:text-[15px] text-[#ccd0f5] font-light leading-relaxed">
                {card.description}
              </p>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
