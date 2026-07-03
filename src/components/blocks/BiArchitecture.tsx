'use client';

import React from 'react';
import Image from 'next/image';

interface BiArchitectureContent {
  title?: string;
  description?: string;
  image?: string;
}

export function BiArchitecture({ content }: { content?: BiArchitectureContent }) {
  const title = content?.title || 'Business Intelligence Architecture';
  const description = content?.description || 'Data from different sources is brought together into a central Data Warehouse, where it is organized and aligned to create reliable KPIs. This trusted data powers dashboards and insights and also enables AI-driven capabilities.';
  const image = content?.image || '/Business intilligence/1cda2c6dff9b61013b46587de886637aad3247ff.png';
  const isGif = typeof image === 'string' && image.toLowerCase().endsWith('.gif');

  return (
    <section className="py-14 bg-white font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-4 space-y-2">
          <h2 className="text-3xl sm:text-4xl lg:text-[40px] font-bold text-[#4c327f] tracking-tight">
            {title}
          </h2>
          <p className="text-slate-500 font-light text-base sm:text-[17px] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Big Image Display */}
        {image && (
          <div className="relative w-full max-w-7xl mx-auto rounded-3xl overflow-hidden shadow-md bg-white border border-slate-100 p-0">
            <div className="relative w-full aspect-[16/9] lg:aspect-[1.8] min-h-[300px]">
              <Image
                src={image}
                alt={title}
                fill
                className="object-contain"
                priority
                unoptimized={isGif}
              />
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
