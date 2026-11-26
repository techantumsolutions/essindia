'use client';

import React from 'react';

export interface Landing1BrandsContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  logos?: string[];
}

const DEFAULT_CONTENT: Landing1BrandsContent = {
  badge: 'CLIENTS',
  title: 'Our Key Clients For Manufacturing ERP',
  description: 'Trusted By The Best In The Industry',
  logos: [
    '/Landing page1/assets/SVG.png',
    '/Landing page1/assets/SVG-1.png',
    '/Landing page1/assets/SVG-2.png',
    '/Landing page1/assets/SVG-3.png',
    '/Landing page1/assets/SVG-4.png',
    '/Landing page1/assets/SVG-5.png',
    '/Landing page1/assets/SVG-6.png',
    '/Landing page1/assets/SVG-7.png',
    '/Landing page1/assets/SVG-8.png',
  ],
};

export function Landing1Brands({ content }: { content?: Landing1BrandsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  return (
    <section className="py-14 bg-[#5026ac] text-center font-sans select-none relative overflow-hidden">
      {/* Decorative Radial background details */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/[0.05] rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        {/* Badge */}
        {data.badge && (
          <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#49288a] bg-white uppercase mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#49288a]" />
            {data.badge}
          </span>
        )}

        {/* Title */}
        {data.title && (
          <h2
            className="text-2xl md:text-[40px] font-extrabold text-white tracking-tight leading-tight max-w-4xl mx-auto mb-2"
            style={data.titleColor ? { color: data.titleColor } : undefined}
          >
            {data.title}
          </h2>
        )}

        {/* Description */}
        {data.description && (
          <p className="text-[#E9D5FF] text-sm md:text-base leading-relaxed max-w-xl mx-auto mb-14 font-medium">
            {data.description}
          </p>
        )}

        {/* Logos Grid */}
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10 max-w-5xl mx-auto">
          {data.logos?.map((logo, idx) => (
            <div
              key={idx}
              className="relative h-10 w-32 md:w-36 flex items-center justify-center group hover:scale-[1.05] transition-all duration-300"
            >
              <img
                src={logo}
                alt="Partner Brand Logo"
                className="max-h-full max-w-full object-contain opacity-90 group-hover:opacity-100 transition-all duration-300"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
