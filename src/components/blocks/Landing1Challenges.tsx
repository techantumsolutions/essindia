'use client';

import React from 'react';
import { Hand, Link2, BarChart3, Package, Clock, EyeOff } from 'lucide-react';

export interface ChallengeItem {
  iconType?: string;
  icon?: string;
  image?: string;
  title: string;
  desc: string;
  solution?: string;
}

export interface Landing1ChallengesContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  challenges?: ChallengeItem[];
}

const DEFAULT_CHALLENGES: ChallengeItem[] = [
  {
    iconType: 'manual',
    title: 'Manual Operations',
    desc: 'Teams waste hours on repetitive data entry, reconciliations and spreadsheets that never agree.',
    solution: 'Solved by ESS ERP',
  },
  {
    iconType: 'disconnected',
    title: 'Disconnected Systems',
    desc: 'Finance, sales and inventory live in silos. Data doesn\'t flow, and neither do decisions.',
    solution: 'Solved by ESS ERP',
  },
  {
    iconType: 'reports',
    title: 'No Real-Time Reports',
    desc: 'Leadership waits days for month-end reports. By the time you see the numbers, they\'re history.',
    solution: 'Solved by ESS ERP',
  },
  {
    iconType: 'inventory',
    title: 'Inventory Issues',
    desc: 'Stockouts, overstock and dead inventory tie up working capital and erode customer trust.',
    solution: 'Solved by ESS ERP',
  },
  {
    iconType: 'approval',
    title: 'Approval Delays',
    desc: 'Paper-based approvals delay purchase orders, leaves and expenses across departments.',
    solution: 'Solved by ESS ERP',
  },
  {
    iconType: 'visibility',
    title: 'Poor Customer Visibility',
    desc: 'No single view of every customer touchpoint — sales, service, payments and complaints.',
    solution: 'Solved by ESS ERP',
  },
];

const DEFAULT_CONTENT: Landing1ChallengesContent = {
  badge: 'THE CHALLENGE',
  title: 'Business challenges slowing your growth?',
  description: 'Most mid-market enterprises lose 20-30% of productivity to the same six problems. ESS ERP is built to eliminate them.',
  challenges: DEFAULT_CHALLENGES,
};

const renderIcon = (item: ChallengeItem) => {
  const iconSrc = item.icon || item.image || item.iconType;

  if (
    iconSrc &&
    (iconSrc.startsWith('/') ||
      iconSrc.startsWith('http://') ||
      iconSrc.startsWith('https://') ||
      iconSrc.startsWith('data:') ||
      /\.(png|jpg|jpeg|svg|webp|gif)$/i.test(iconSrc))
  ) {
    return (
      <img
        src={iconSrc}
        alt={item.title || 'Challenge Icon'}
        className="w-5 h-5 object-contain"
      />
    );
  }

  const iconClass = "w-5 h-5 text-red-500";
  switch (iconSrc) {
    case 'manual':
      return <Hand className={iconClass} />;
    case 'disconnected':
      return <Link2 className={iconClass} />;
    case 'reports':
      return <BarChart3 className={iconClass} />;
    case 'inventory':
      return <Package className={iconClass} />;
    case 'approval':
      return <Clock className={iconClass} />;
    case 'visibility':
      return <EyeOff className={iconClass} />;
    default:
      return <Hand className={iconClass} />;
  }
};

export function Landing1Challenges({ content }: { content?: Landing1ChallengesContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  return (
    <section className="py-14 bg-[#F8F9FA] font-sans select-none border-b border-slate-100">
      <div className="container mx-auto px-6 max-w-6xl">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-red-500 bg-purple-100/60 border border-purple-200/50 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {data.badge}
            </span>
          )}
          {data.title && (
            <h2
              className="text-3xl md:text-[42px] font-bold text-[#0D1F3D] leading-tight tracking-tight"
              style={data.titleColor ? { color: data.titleColor } : undefined}
            >
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Challenges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.challenges?.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-5 md:p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Icon Circle */}
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                  {renderIcon(item)}
                </div>
                {/* Title */}
                <h4 className="text-lg font-bold text-[#0D1F3D]">{item.title}</h4>
                {/* Description */}
                <p className="text-slate-500 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>

              {/* Solution Tag */}
              {item.solution && (
                <div className="pt-3.5 border-t border-slate-50 mt-4 flex items-center gap-2">
                  <span className="text-xs font-semibold text-red-500 tracking-wide">
                    — {item.solution}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
