'use client';

import React from 'react';
import Image from 'next/image';

interface StatItem {
  value?: string;
  label?: string;
}

interface AssStatsContent {
  image?: string;
  badgeText?: string;
  title?: string;
  description?: string;
  stats?: StatItem[];
}

export function AssStats({ content }: { content?: AssStatsContent }) {
  const image = content?.image || '/App-After Sales Service/ChatGPT Image Jun 17, 2026, 05_47_51 PM 1.png';
  const badgeText = content?.badgeText || 'Achieve More';
  const title = content?.title || 'Go digital to sell more, faster and build strong customer relations';
  const description = content?.description || 'Empower your service teams with intelligent tools that reduce resolution time, boost first-time fix rates, and elevate customer satisfaction scores.';
  const stats = content?.stats || [
    { value: '98%', label: 'Customer Satisfaction' },
    { value: '3x', label: 'Faster Resolution' },
    { value: '60%', label: 'Cost Reduction' },
  ];

  return (
    <section className="p-14 px-6 bg-[#f8f9fb]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Image */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[520px] aspect-[4/3]">
              <Image src={image} alt="Stats" fill className="object-contain" />
            </div>
          </div>

          {/* Right Content */}
          <div className="lg:w-1/2 w-full">
            {badgeText && (
              <span className="inline-block text-sm font-semibold text-[#3b82f6] bg-[#eef2ff] px-4 py-1.5 rounded-full mb-5">
                {badgeText}
              </span>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-5 leading-tight">
              {title}
            </h2>

            {description.includes('<p>') ? (
              <div className="text-base text-slate-500 leading-relaxed mb-8 prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-base text-slate-500 leading-relaxed mb-8">{description}</p>
            )}

            {/* Stats Row */}
            <div className="flex flex-wrap gap-8">
              {stats.map((stat: StatItem, idx: number) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-black text-[#0f172a]">{stat.value}</div>
                  <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
