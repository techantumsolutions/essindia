'use client';

import React from 'react';

interface AssIntroContent {
  title?: string;
  paragraphs?: string[];
}

export function AssIntro({ content }: { content?: AssIntroContent }) {
  const title = content?.title || 'Upgrade Customer Support with After-Sales Service App';
  const paragraphs = content?.paragraphs || [
    'The After-Sales Service App enhances mobile service operations by allowing field teams to offer fast, informed, and personalized support—all from a single platform. This intelligent after-sales service software connects agents, mobile workers, assets, and customers, helping you deliver excellent on-site service seamlessly.',
    'With the After-Sales Service App, your field workforce gets easy access to the right information and step-by-step procedures needed to consistently provide high-quality service. From appointment scheduling to customer feedback, it gives you a complete view of the entire service process.'
  ];

  return (
    <section className="p-14 px-6 bg-[#f5f5f5] border-b">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#27256B] mb-8 leading-tight">
          {title}
        </h2>
        <div className="space-y-4">
          {paragraphs.map((para: string, idx: number) => (
            <p key={idx} className="text-[15px] md:text-base text-slate-600 leading-relaxed font-light">
              {typeof para === 'string' && para.includes('<p>')
                ? <span dangerouslySetInnerHTML={{ __html: para }} />
                : para
              }
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
