'use client';

import React from 'react';

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
    <section className="p-12 px-6 bg-[#ffffff] border-b">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0f172a] text-center mb-6 md:mb-8 lg:mb-16 leading-tight whitespace-pre-line">
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-4">

          {/* Left Benefits */}
          <div className="lg:w-[30%] w-full space-y-6">
            {leftItems.map((item: BenefitItem, idx: number) => {
              const color = leftColors[idx % leftColors.length];
              const iconSrc = typeof item.icon === 'string' ? item.icon.trim() : '';
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-150/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-300 hover:-translate-y-1 group cursor-pointer"
                >
                  {iconSrc ? (
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI(iconSrc)}
                        alt=""
                        className="w-[18px] h-[18px] object-contain invert brightness-0"
                      />
                    </div>
                  ) : null}
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-950 transition-colors leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Center Image with Dashed indicators */}
          <div className="lg:w-[40%] w-full flex justify-center py-6 group cursor-pointer">
            <div className="relative w-full max-w-[450px] aspect-square flex items-center justify-center">
              {/* Dashed outer circle */}
              <div className="absolute inset-0 rounded-full border border-dashed border-blue-200 opacity-80 transition-colors duration-500 group-hover:border-blue-400" />

              {/* 8 indicators on the circle */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />

              {/* Diagonals (45 deg) */}
              <div className="absolute top-[14.6%] left-[14.6%] -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute top-[14.6%] right-[14.6%] translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute bottom-[14.6%] left-[14.6%] -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />
              <div className="absolute bottom-[14.6%] right-[14.6%] translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-blue-500 rounded-full shadow-sm transition-transform duration-500 group-hover:scale-125" />

              {image ? (
                <div className="relative w-[80%] h-[80%] flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={encodeURI(image.trim())}
                    alt="Benefits Mockup"
                    className="w-full h-full object-contain z-10 transition-transform duration-500 ease-out group-hover:scale-105"
                  />
                </div>
              ) : null}
            </div>
          </div>

          {/* Right Benefits */}
          <div className="lg:w-[30%] w-full space-y-6">
            {rightItems.map((item: BenefitItem, idx: number) => {
              const color = rightColors[idx % rightColors.length];
              const iconSrc = typeof item.icon === 'string' ? item.icon.trim() : '';
              return (
                <div
                  key={idx}
                  className="flex items-center gap-4 bg-white rounded-2xl px-5 py-4 shadow-sm border border-slate-150/80 transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/15 hover:border-blue-300 hover:-translate-y-1 group cursor-pointer"
                >
                  {iconSrc ? (
                    <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center shrink-0 shadow-sm transition-transform duration-300 group-hover:scale-110`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={encodeURI(iconSrc)}
                        alt=""
                        className="w-[18px] h-[18px] object-contain invert brightness-0"
                      />
                    </div>
                  ) : null}
                  <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-950 transition-colors leading-relaxed">
                    {item.text}
                  </p>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
}

export default AssBenefits;
