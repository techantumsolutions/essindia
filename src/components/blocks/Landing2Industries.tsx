'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface IndustryCardItem {
  name: string;
  image: string;
  href?: string;
}

export interface Landing2IndustriesContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  industries?: IndustryCardItem[];
}

const DEFAULT_INDUSTRIES: IndustryCardItem[] = [
  { name: 'Steel', image: '/Landing Page-2/assets/Rectangle 18110.png', href: '/industry-solutions' },
  { name: 'Pharma', image: '/Landing Page-2/assets/Rectangle 18111.png', href: '/industry-solutions' },
  { name: 'Corrugated Boxes', image: '/Landing Page-2/assets/Rectangle 18112.png', href: '/industry-solutions' },
  { name: 'Trading Flour Mill', image: '/Landing Page-2/assets/Rectangle 18113.png', href: '/industry-solutions' },
  { name: 'Retail', image: '/Landing Page-2/assets/Rectangle 18114.png', href: '/solutions/retail' },
  { name: 'Food And Beverage', image: '/Landing Page-2/assets/Rectangle 18115.png', href: '/industry-solutions' },
  { name: 'FMCG', image: '/Landing Page-2/assets/Rectangle 18116.png', href: '/solutions/fmcg/fmcg-overview' },
  { name: 'Oil & Gas', image: '/Landing Page-2/assets/Rectangle 18117.png', href: '/industry-solutions' },
  { name: 'Manufacturing', image: '/Landing Page-2/assets/Rectangle 18119.png', href: '/industry-solutions/manufacturing' },
  { name: 'Printing & Publishing', image: '/Landing Page-2/assets/Rectangle 18120.png', href: '/industry-solutions' },
  { name: 'Construction', image: '/Landing Page-2/assets/Rectangle 18121.png', href: '/industry-solutions' },
  { name: 'Engineering', image: '/Landing Page-2/assets/Rectangle 18118.png', href: '/industry-solutions' },
];

const DEFAULT_CONTENT: Landing2IndustriesContent = {
  badge: 'INDUSTRIES',
  title: 'Wide Array of Industries',
  industries: DEFAULT_INDUSTRIES,
};

export function Landing2Industries({ content }: { content?: Landing2IndustriesContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  const industryList = data.industries && data.industries.length > 0 ? data.industries : DEFAULT_INDUSTRIES;

  return (
    <section className="py-14 bg-white font-sans select-none px-6">
      <div className="container mx-auto max-w-6xl text-center">
        {/* Uppercase Purple Badge */}
        {data.badge && (
          <span className="text-xs md:text-sm font-bold uppercase tracking-widest text-[#562ca0] mb-2 block">
            {data.badge}
          </span>
        )}

        {/* Section Title */}
        {data.title && (
          <h2
            className="text-slate-900 text-3xl md:text-5xl font-extrabold tracking-tight leading-[1.15] mb-12"
            style={data.titleColor ? { color: data.titleColor } : undefined}
          >
            {data.title}
          </h2>
        )}

        {/* Grid of 12 Industry Tiles (6 columns x 2 rows on Desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 md:gap-6">
          {industryList.map((ind, idx) => {
            const cardContent = (
              <div className="flex flex-col items-center group cursor-pointer">
                {/* Rounded Square Image Box */}
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden shadow-sm border border-slate-100/60 mb-3 bg-slate-50 group-hover:shadow-md group-hover:scale-[1.03] transition-all duration-300">
                  <Image
                    src={ind.image || '/Landing Page-2/assets/Rectangle 18110.png'}
                    alt={ind.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Industry Label */}
                <span className="text-slate-900 font-bold text-sm md:text-[15px] tracking-tight group-hover:text-[#562ca0] transition-colors text-center leading-snug">
                  {ind.name}
                </span>
              </div>
            );

            return ind.href ? (
              <Link key={idx} href={ind.href} className="block">
                {cardContent}
              </Link>
            ) : (
              <div key={idx}>{cardContent}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
