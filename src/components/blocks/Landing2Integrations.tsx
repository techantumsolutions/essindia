'use client';

import React from 'react';
import Image from 'next/image';

export interface Landing2IntegrationsContent {
  badge?: string;
  title?: string;
  logos?: string[];
}

const DEFAULT_LOGOS = [
  '/Landing Page-2/assets/integration-intercom.png',
  '/Landing Page-2/assets/integration-moodle.png',
  '/Landing Page-2/assets/integration-powerpoint.png',
  '/Landing Page-2/assets/integration-hubspot.png',
  '/Landing Page-2/assets/integration-notion.png',
  '/Landing Page-2/assets/integration-blackbox.png',
  '/Landing Page-2/assets/integration-docebo.png',
  '/Landing Page-2/assets/integration-articulate.png',
  '/Landing Page-2/assets/integration-360.png',
];

const DEFAULT_CONTENT: Landing2IntegrationsContent = {
  badge: 'INTEGRATIONS',
  title: 'Embed your videos into\nyour favorite tools',
  logos: DEFAULT_LOGOS,
};

export function Landing2Integrations({ content }: { content?: Landing2IntegrationsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const rawLogos = data.logos && data.logos.length > 0 ? data.logos : DEFAULT_LOGOS;

  // Multiply logos so single track is wide enough to fill screen seamlessly
  const logoList = rawLogos.length < 12 
    ? [...rawLogos, ...rawLogos, ...rawLogos, ...rawLogos] 
    : rawLogos;

  return (
    <section className="py-14 bg-[#e6e3f9] font-sans select-none px-6 text-center overflow-hidden">
      <div className="container mx-auto max-w-5xl mb-10">
        {/* Uppercase Purple Badge */}
        {data.badge && (
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#562ca0] mb-2 block">
            {data.badge}
          </span>
        )}

        {/* Section Big Title */}
        {data.title && (
          <h2 className="text-slate-900 text-3xl md:text-5xl font-bold tracking-tight leading-[1.15] whitespace-pre-line">
            {data.title}
          </h2>
        )}
      </div>

      {/* Auto Scrolling Infinite Marquee Container */}
      <div className="relative w-full overflow-hidden max-w-6xl mx-auto flex">
        {/* Left & Right Gradient Fades */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-[#e6e3f9] to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-[#e6e3f9] to-transparent z-10 pointer-events-none" />

        <div className="flex items-center gap-8 md:gap-12 shrink-0 animate-integrations-marquee py-2 pr-8 md:pr-12 hover:[animation-play-state:paused]">
          {logoList.map((logoUrl, idx) => (
            <div
              key={idx}
              className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 hover:scale-110 transition-transform cursor-pointer"
            >
              <Image
                src={logoUrl}
                alt={`Integration Tool ${(idx % rawLogos.length) + 1}`}
                width={56}
                height={56}
                className="object-contain w-full h-full mx-auto"
              />
            </div>
          ))}
        </div>

        {/* Duplicate track for seamless 100% infinite loop */}
        <div className="flex items-center gap-8 md:gap-12 shrink-0 animate-integrations-marquee py-2 pr-8 md:pr-12 hover:[animation-play-state:paused]" aria-hidden="true">
          {logoList.map((logoUrl, idx) => (
            <div
              key={`dup-${idx}`}
              className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center shrink-0 hover:scale-110 transition-transform cursor-pointer"
            >
              <Image
                src={logoUrl}
                alt={`Integration Tool ${(idx % rawLogos.length) + 1}`}
                width={56}
                height={56}
                className="object-contain w-full h-full mx-auto"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS Animation for smooth Infinite Marquee */}
      <style jsx global>{`
        @keyframes integrationsMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }
        .animate-integrations-marquee {
          animation: integrationsMarquee 15s linear infinite;
        }
      `}</style>
    </section>
  );
}
