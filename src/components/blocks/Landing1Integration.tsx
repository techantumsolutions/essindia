'use client';

import React from 'react';

export interface Landing1IntegrationContent {
  badge?: string;
  title?: string;
  description?: string;
  image?: string;
}

const DEFAULT_CONTENT: Landing1IntegrationContent = {
  badge: 'INTEGRATION',
  title: 'Apps & Integration',
  description: "We understand the hussle of replacing the long used tools in your process. That's why we integrate tools you use in your day-to-day work.",
  image: '/Landing page1/assets/apps intigtation.png',
};

export function Landing1Integration({ content }: { content?: Landing1IntegrationContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  return (
    <section className="py-12 border-t border-b bg-[#F8FAFC] text-slate-900 font-sans select-none">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {data.badge}
            </span>
          )}
          {data.title && (
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Centered Image */}
        {data.image && (
          <div className="relative max-w-5xl mx-auto mt-6 flex justify-center items-center">
            <img
              src={data.image}
              alt="Apps and Integration Network Map"
              className="w-full h-auto object-contain max-h-[500px]"
              loading="lazy"
            />
          </div>
        )}

      </div>
    </section>
  );
}
