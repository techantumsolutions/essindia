'use client';

import React from 'react';

interface AssIntroContent {
  title?: string;
  paragraph1?: string;
  paragraph2?: string;
  paragraphs?: string[];
}

export function AssIntro({ content }: { content?: AssIntroContent }) {
  const title = content?.title || 'Upgrade Customer Support with After-Sales Service App';
  
  const defaultP1 = 'The After-Sales Service App enhances mobile service operations by allowing field teams to offer fast, informed, and personalized support—all from a single platform. This intelligent after-sales service software connects agents, mobile workers, assets, and customers, helping you deliver excellent on-site service seamlessly.';
  const defaultP2 = 'With the After-Sales Service App, your field workforce gets easy access to the right information and step-by-step procedures needed to consistently provide high-quality service. From appointment scheduling to customer feedback, it gives you a complete view of the entire service process.';

  const p1 = content?.paragraph1 ?? content?.paragraphs?.[0] ?? defaultP1;
  const p2 = content?.paragraph2 ?? content?.paragraphs?.[1] ?? defaultP2;

  const paragraphsList = [p1, p2].filter(Boolean);

  return (
    <section className="p-14 px-6 bg-[#f5f5f5] border-b">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#27256B] mb-8 leading-tight">
          {title}
        </h2>
        <div className="space-y-4">
          {paragraphsList.map((para: string, idx: number) => (
            typeof para === 'string' && (para.includes('<p>') || para.includes('<')) ? (
              <div key={idx} className="text-[15px] md:text-base text-slate-600 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: para }} />
            ) : (
              <p key={idx} className="text-[15px] md:text-base text-slate-600 leading-relaxed font-light">
                {para}
              </p>
            )
          ))}
        </div>
      </div>
    </section>
  );
}
