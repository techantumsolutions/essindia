'use client';

import React from 'react';
import Link from 'next/link';
import { IndianRupee, ShieldCheck, Shuffle, TrendingUp, UserCheck, Clock } from 'lucide-react';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface WhyEssFeatureItem {
  title: string;
  description: string;
  iconType?: string;
  icon?: string;
  image?: string;
}

export interface Landing2WhyEssContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  features?: WhyEssFeatureItem[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_FEATURES: WhyEssFeatureItem[] = [
  {
    title: 'Cost-Saving',
    description: 'Reduce operational costs and increase profitability with an efficient ERP.',
    iconType: 'rupee',
  },
  {
    title: 'Complete Security',
    description: 'Enterprise-grade security to protect your data and ensure business continuity.',
    iconType: 'security',
  },
  {
    title: 'Flexibility',
    description: 'Adapt and scale your ERP as your business evolves and grows.',
    iconType: 'flexibility',
  },
  {
    title: 'Scalability',
    description: 'Easily scale operations, users, and modules without compromising performance.',
    iconType: 'analytics',
  },
  {
    title: 'Peace of Mind Ensured',
    description: 'Reliable, automated, and always available – so you can focus on what matters.',
    iconType: 'user',
  },
  {
    title: 'Faster Time to Value',
    description: 'Quick implementation and faster adoption to deliver results from day one.',
    iconType: 'time',
  },
];

const DEFAULT_CONTENT: Landing2WhyEssContent = {
  badge: 'WHY ESS',
  title: 'Integrated ERP Modules for Smarter\nBusiness Management',
  features: DEFAULT_FEATURES,
  ctaText: 'GET FREE DEMO',
  ctaUrl: '/contact-us',
};

function renderFeatureIcon(feat: WhyEssFeatureItem) {
  const iconSrc = feat.icon || feat.image || feat.iconType;

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
        alt={feat.title || 'Feature Icon'}
        className="w-7 h-7 object-contain"
      />
    );
  }

  const iconProps = { className: 'w-7 h-7 text-[#562ca0] stroke-[2]' };
  switch (iconSrc) {
    case 'security':
      return <ShieldCheck {...iconProps} />;
    case 'flexibility':
      return <Shuffle {...iconProps} />;
    case 'analytics':
      return <TrendingUp {...iconProps} />;
    case 'user':
      return <UserCheck {...iconProps} />;
    case 'time':
      return <Clock {...iconProps} />;
    case 'rupee':
    default:
      return <IndianRupee {...iconProps} />;
  }
}

export function Landing2WhyEss({ content }: { content?: Landing2WhyEssContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const items = data.features && data.features.length > 0 ? data.features : DEFAULT_FEATURES;

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl || (data as any).pdfUrl
  );

  return (
    <section className="py-14 bg-white font-sans select-none px-6">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Uppercase Purple Badge */}
        {data.badge && (
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#562ca0] mb-2 block">
            {data.badge}
          </span>
        )}

        {/* Section Big Title */}
        {data.title && (
          <h2
            className="text-slate-900 text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] mb-12 max-w-4xl mx-auto whitespace-pre-line"
            style={data.titleColor ? { color: data.titleColor } : undefined}
          >
            {data.title}
          </h2>
        )}

        {/* Grid of 6 Feature Cards (3 Columns x 2 Rows) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-12">
          {items.map((feat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-8 border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(86,44,160,0.08)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center group"
            >
              {/* Soft Purple Light Circle Background for Icon */}
              <div className="w-16 h-16 rounded-full bg-[#f3efff] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-[#ebf] transition-all duration-300">
                {renderFeatureIcon(feat)}
              </div>

              {/* Feature Title */}
              <h3 className="text-slate-900 text-xl font-bold tracking-tight mb-3">
                {feat.title}
              </h3>

              {/* Feature Description */}
              <p className="text-slate-600 text-sm md:text-[15px] font-medium leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* Solid Purple Bottom CTA Button */}
        {data.ctaText && (
          <div>
            <a
              href={data.ctaUrl || '/contact-us'}
              onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
              className="inline-flex items-center justify-center bg-[#462294] hover:bg-[#381a79] text-white px-10 py-4 rounded-md font-bold text-xs md:text-sm tracking-wider uppercase transition-all shadow-md hover:shadow-lg cursor-pointer"
            >
              {data.ctaText}
            </a>
          </div>
        )}
      </div>
      {modalNode}
    </section>
  );
}
