'use client';

import React from 'react';
import Image from 'next/image';

interface BenefitItem {
  icon?: string;
  text?: string;
}

interface AssBenefitsContent {
  title?: string;
  image?: string;
  leftItems?: BenefitItem[];
  rightItems?: BenefitItem[];
}

export function AssBenefits({ content }: { content?: AssBenefitsContent }) {
  const title = content?.title || 'Benefits of\nAfter-Sales Service App';
  const image = content?.image || '/App-After Sales Service/image 117.png';
  const leftItems = content?.leftItems || [
    { icon: '/App-After Sales Service/Frame.png', text: 'Enhance customer satisfaction through faster resolution' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Boost service executive productivity with streamlined tasks' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Boost service executive productivity with streamlined tasks' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Track complaint status with complete transparency' },
  ];
  const rightItems = content?.rightItems || [
    { icon: '/App-After Sales Service/Frame.png', text: 'Ensure service quality with built-in checks' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Send real-time updates directly to customers' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Gain real-time visibility into complaint progress' },
    { icon: '/App-After Sales Service/Frame.png', text: 'Reduce operating costs with digital workflows' },
  ];

  const leftColors = ['bg-blue-600', 'bg-purple-600', 'bg-green-600', 'bg-orange-600'];
  const rightColors = ['bg-teal-600', 'bg-pink-600', 'bg-sky-600', 'bg-amber-600'];

  return (
    <section className="p-14 px-6 bg-[#ffffff] border-b">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0f172a] text-center mb-16 leading-tight whitespace-pre-line">
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

          {/* Left Benefits */}
          <div className="lg:w-[30%] w-full space-y-6">
            {leftItems.map((item: BenefitItem, idx: number) => {
              const color = leftColors[idx % leftColors.length];
              return (
                <div key={idx} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:shadow-md hover:border-slate-200">
                  {item.icon && (
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Image src={item.icon} alt="" width={18} height={18} className="object-contain invert brightness-0" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>

          {/* Center Image with Dashed indicators */}
          <div className="lg:w-[40%] w-full flex justify-center py-6">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              {/* Dashed outer circle */}
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-200 opacity-80" />

              {/* 8 indicators on the circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />

              {/* Diagonals (45 deg) */}
              <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />
              <div className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm" />

              <div className="relative w-[80%] h-[80%]">
                <Image src={image} alt="Benefits Mockup" fill className="object-contain z-10" />
              </div>
            </div>
          </div>

          {/* Right Benefits */}
          <div className="lg:w-[30%] w-full space-y-6">
            {rightItems.map((item: BenefitItem, idx: number) => {
              const color = rightColors[idx % rightColors.length];
              return (
                <div key={idx} className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:shadow-md hover:border-slate-200">
                  {item.icon && (
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0 shadow-sm`}>
                      <Image src={item.icon} alt="" width={18} height={18} className="object-contain invert brightness-0" />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-slate-800 leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}
