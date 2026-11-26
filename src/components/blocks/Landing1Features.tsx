'use client';

import React from 'react';
import Link from 'next/link';
import { Sparkles } from 'lucide-react';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export interface FeatureItem {
  icon?: string;
  title: string;
  desc: string;
}

export interface Landing1FeaturesContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  features?: FeatureItem[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
}

const DEFAULT_FEATURES: FeatureItem[] = [
  {
    icon: '/Landing page1/assets/bot_svgrepo.com.png',
    title: 'AI Copilot',
    desc: 'Ask anything in plain English and get instant answers, reports and actions.',
  },
  {
    icon: '/Landing page1/assets/growth_svgrepo.com.png',
    title: 'Predictive Analytics',
    desc: 'Forecast demand, revenue and churn weeks before they happen.',
  },
  {
    icon: '/Landing page1/assets/lines-graph-file_svgrepo.com.png',
    title: 'Smart Reports',
    desc: 'Auto-generated narratives explain every variance for you.',
  },
  {
    icon: '/Landing page1/assets/voice-scan_svgrepo.com.png',
    title: 'Document AI',
    desc: 'Extract invoice and receipt data automatically with zero data entry.',
  },
  {
    icon: '/Landing page1/assets/mobile-chart_svgrepo.com.png',
    title: 'Mobile-First',
    desc: 'Approve POs, check stock and view dashboards on iOS & Android.',
  },
  {
    icon: '/Landing page1/assets/cloud-upload_svgrepo.com.png',
    title: 'Cloud Native',
    desc: '99.99% uptime SLA with enterprise-grade encryption and auto-backups.',
  },
];

const DEFAULT_CONTENT: Landing1FeaturesContent = {
  badge: 'BUILT FOR MODERN TEAMS',
  title: "Everything You Need. Nothing You Don't.",
  description: 'Clean interface, zero clutter. Pure performance for scaling companies.',
  features: DEFAULT_FEATURES,
  ctaText: 'Explore All Features',
  ctaUrl: '/contact',
};

export function Landing1Features({ content }: { content?: Landing1FeaturesContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl
  );

  return (
    <section className="py-14 bg-[#090D16] font-sans select-none border-b border-slate-800">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto mb-16">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-amber-400 bg-amber-400/10 border border-amber-400/20 uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {data.badge}
            </span>
          )}

          {data.title && (
            <h2
              className="text-3xl md:text-5xl font-bold text-white tracking-tight leading-tight"
              style={data.titleColor ? { color: data.titleColor } : undefined}
            >
              {data.title}
            </h2>
          )}

          {data.description && (
            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* 6 Grid items */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {data.features?.map((item, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-[#0F1626] border border-slate-800/80 hover:border-amber-400/40 transition-all duration-300 space-y-4 group"
            >
              {/* Icon Container */}
              <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center p-2.5 shrink-0 group-hover:scale-110 transition-transform">
                {item.icon ? (
                  <img src={item.icon} alt={item.title} className="w-full h-full object-contain" />
                ) : (
                  <Sparkles className="w-5 h-5 text-amber-400" />
                )}
              </div>
              <div className="space-y-2">
                <h4 className="text-base font-bold text-white tracking-wide">{item.title}</h4>
                <p className="text-slate-400 text-xs md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA Button */}
        {data.ctaText && (
          <div className="text-center pt-10">
            <a
              href={data.ctaUrl || '/contact-us'}
              onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 transition-colors shadow-md hover:shadow-lg cursor-pointer"
            >
              <span>{data.ctaText}</span>
              <span>→</span>
            </a>
          </div>
        )}

      </div>
      {modalNode}
    </section>
  );
}
