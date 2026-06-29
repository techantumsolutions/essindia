'use client';

import React from 'react';
import Image from 'next/image';

interface FuncItem {
  icon?: string;
  text?: string;
}

interface AssFunctionalitiesContent {
  badgeIcon?: string;
  badgeText?: string;
  title?: string;
  items?: FuncItem[];
  image?: string;
}

export function AssFunctionalities({ content }: { content?: AssFunctionalitiesContent }) {
  const badgeIcon = content?.badgeIcon || '/App-After Sales Service/Frame.png';
  const badgeText = content?.badgeText || 'Metadata Observability';
  const title = content?.title || 'Functionalities of After-Sales Service App';
  const items = content?.items || [
    { icon: '/App-After Sales Service/layer.png', text: 'Register customer complaints anytime, anywhere' },
    { icon: '/App-After Sales Service/layer.png', text: 'Assign complaints directly to service executives' },
    { icon: '/App-After Sales Service/layer.png', text: 'Access instant updates on complaint status' },
    { icon: '/App-After Sales Service/layer.png', text: 'Record customer feedback on service quality' },
    { icon: '/App-After Sales Service/layer.png', text: 'Create real-time reports on service operations' },
    { icon: '/App-After Sales Service/layer.png', text: 'Mark attendance directly through the app' },
    { icon: '/App-After Sales Service/layer.png', text: 'Track and manage service-related expenses efficiently' },
  ];
  const image = content?.image || '/App-After Sales Service/Frame 296.png';

  return (
    <section className="p-14 px-6 bg-[#f4f6f8]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row lg:items-stretch items-center gap-4 lg:gap-20">

          {/* Left Content */}
          <div className="lg:w-1/2 w-full">
            {/* Badge */}
            {badgeText && (
              <div className="inline-flex items-center gap-2 bg-[#002b6c] px-4 py-2 rounded-full text-white mb-2">
                {badgeIcon && (
                  <Image src={badgeIcon} alt="" width={16} height={16} className="object-contain invert brightness-0" />
                )}
                <span className="text-xs font-semibold tracking-wider">
                  {badgeText}
                </span>
              </div>
            )}

            <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-2">
              {title}
            </h2>

            <div className="space-y-2">
              {items.map((item: FuncItem, idx: number) => (
                <div key={idx} className="flex items-center gap-4 bg-white rounded-2xl p-3 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 transition-all hover:shadow-md hover:border-slate-200">
                  {item.icon && (
                    <div className="w-10 h-10 rounded-full bg-[#002b6c] flex items-center justify-center shrink-0">
                      <Image src={item.icon} alt="" width={18} height={18} className="object-contain invert brightness-0" />
                    </div>
                  )}
                  <span className="text-[15px] font-semibold text-slate-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end lg:self-stretch">
            <div className="relative w-full max-w-[600px] h-full min-h-[400px] lg:min-h-0 rounded-3xl border border-slate-100/80 bg-slate-50/50 p-6 flex items-center justify-center overflow-hidden">
              {/* Decorative glows */}
              <div className="absolute top-0 right-0 w-48 h-48 bg-purple-200/40 rounded-full filter blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-100/40 rounded-full filter blur-3xl pointer-events-none" />

              <div className="relative w-full h-full min-h-[350px] lg:min-h-0">
                <Image src={image} alt="Functionalities" fill className="object-contain z-10" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
