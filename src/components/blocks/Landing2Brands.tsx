'use client';

import React from 'react';
import Image from 'next/image';

export interface Landing2BrandsContent {
  title?: string;
  logos?: string[];
}

const DEFAULT_LOGOS = [
  '/Landing Page-2/assets/jnj.png',
  '/Landing Page-2/assets/bsh.png',
  '/Landing Page-2/assets/microsoft.png',
  '/Landing Page-2/assets/bestseller.png',
];

const DEFAULT_CONTENT: Landing2BrandsContent = {
  title: 'Trusted by over 50,000 companies of all sizes',
  logos: DEFAULT_LOGOS,
};

export function Landing2Brands({ content }: { content?: Landing2BrandsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const logoList = data.logos && data.logos.length > 0 ? data.logos : DEFAULT_LOGOS;

  // Duplicate logo array to create a seamless infinite loop marquee
  const marqueeLogos = [...logoList, ...logoList, ...logoList];

  return (
    <section className="py-14 bg-[#462294] font-sans select-none px-6 text-white text-center overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        {/* Title */}
        {data.title && (
          <h3 className="text-white text-sm md:text-base font-bold tracking-wide mb-10 opacity-95">
            {data.title}
          </h3>
        )}

        {/* Auto-scrolling marquee track */}
        <div className="relative w-full overflow-hidden">
          {/* Edge gradient overlays matching section background */}
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-r from-[#462294] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-24 bg-gradient-to-l from-[#462294] to-transparent z-10 pointer-events-none" />

          <div className="flex items-center gap-12 md:gap-20 w-max animate-brands-marquee py-2 hover:[animation-play-state:paused]">
            {marqueeLogos.map((logoUrl, idx) => (
              <div key={idx} className="relative h-10 md:h-12 w-36 md:w-44 flex items-center justify-center shrink-0">
                <Image
                  src={logoUrl}
                  alt={`Client Logo ${(idx % logoList.length) + 1}`}
                  fill
                  className="object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Marquee Keyframes Animation */}
      <style jsx global>{`
        @keyframes brandsMarquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-33.333%);
          }
        }
        .animate-brands-marquee {
          animation: brandsMarquee 25s linear infinite;
        }
      `}</style>
    </section>
  );
}
