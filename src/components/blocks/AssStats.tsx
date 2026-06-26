'use client';

import React from 'react';

interface StatItem {
  value?: string;
  label?: string;
}

interface AssStatsContent {
  stats?: StatItem[];
}

export function AssStats({ content }: { content?: AssStatsContent }) {
  const stats = content?.stats || [
    { value: '100%', label: 'increase in customer Satisfaction' },
    { value: '80%', label: 'increase in field productivity' },
    { value: '60%', label: 'Reduction in inventory carrying costs' },
  ];

  return (
    <section className="p-6 px-6 bg-[#ffffff] border-b">
      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-0">
          {stats.map((stat: StatItem, idx: number) => (
            <React.Fragment key={idx}>
              <div
                className="flex-1 flex flex-col items-center justify-center text-center px-6 py-6 transition-all hover:scale-105 duration-300"
              >
                <span className="text-5xl md:text-6xl font-light text-[#171c76] tracking-tight mb-4">
                  {stat.value}
                </span>
                <span className="text-[15px] md:text-base text-slate-600 font-normal max-w-[200px] leading-relaxed">
                  {stat.label}
                </span>
              </div>
              {idx < stats.length - 1 && (
                <div className="hidden md:block w-[1px] h-20 bg-[#e2e8f0] self-center" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
