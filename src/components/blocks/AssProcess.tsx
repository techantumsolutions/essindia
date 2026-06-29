'use client';

import React from 'react';
import Image from 'next/image';

interface ProcessStep {
  image?: string;
  title?: string;
  description?: string;
}

interface AssProcessContent {
  title?: string;
  steps?: ProcessStep[];
}

export function AssProcess({ content }: { content?: AssProcessContent }) {
  const title = content?.title || 'End-to-End After-Sales Service Journy';
  const steps = content?.steps || [
    { image: '/App-After Sales Service/Process 1.png', title: 'Customer Complaint', description: 'Customer raises a complaint through the app, web, or support channel.' },
    { image: '/App-After Sales Service/Process 2.png', title: 'Assignment', description: 'The system auto-assigns the complaint to the most suitable technician.' },
    { image: '/App-After Sales Service/Process 3.png', title: 'Technician Visit', description: 'Technician is notified, visits the site, and inspects the reported issue.' },
    { image: '/App-After Sales Service/Process 4.png', title: 'Resolution', description: 'Technician resolves the issue and updates the status in real-time.' },
    { image: '/App-After Sales Service/Process 5.png', title: 'Feedback', description: 'Customer shares feedback and rates the service experience.' },
  ];

  return (
    <section className="p-14 px-6 bg-[#ffffff]">
      <div className="container mx-auto max-w-7xl">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl lg:text-[40px] font-bold text-[#0a1128] text-center mb-6 leading-tight">
          {title}
        </h2>

        {/* Process Flow */}
        <div className="relative">
          {/* Flow bar container (desktop only) */}
          <div className="hidden lg:block relative w-full max-w-7xl mx-auto h-20 mb-6">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-[10%] right-[10%] h-[2px] bg-[#181263] -translate-y-1/2" />

            {/* Step numbers and intermediate connection dots */}
            <div className="absolute inset-0 flex items-center justify-between px-[8%]">
              {steps.map((_, idx) => (
                <React.Fragment key={idx}>
                  {/* Step number container */}
                  <div className="relative z-10 flex items-center justify-center w-14 h-14">
                    {/* Outer dashed circle */}
                    <div className="absolute inset-0 rounded-full border border-dashed border-[#27256b]/40" />
                    {/* Inner solid circle */}
                    <div className="w-10 h-10 rounded-full bg-[#181263] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                      {String(idx + 1).padStart(2, '0')}
                    </div>
                  </div>

                  {/* Intermediate connection dot */}
                  {idx < steps.length - 1 && (
                    <div className="w-3.5 h-3.5 rounded-full border-2 border-[#e28a1a] bg-white z-10 shadow-sm" />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {steps.map((step: ProcessStep, idx: number) => (
              <div key={idx} className="flex flex-col items-center bg-white rounded-2xl border border-slate-200 pt-3 pb-6 shadow-[0_4px_25px_rgba(0,0,0,0.015)] transition-all hover:shadow-md hover:border-slate-200">
                {/* Mobile/Tablet step number (hidden on desktop) */}
                <div className="lg:hidden relative flex items-center justify-center w-14 h-14 mb-4">
                  <div className="absolute inset-0 rounded-full border border-dashed border-[#27256b]/40" />
                  <div className="w-10 h-10 rounded-full bg-[#0a1128] text-white font-bold text-sm flex items-center justify-center shadow-sm">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                </div>

                {/* Step Image */}
                <div className="relative w-full aspect-square max-w-[150px] mb-6 flex items-center justify-center">
                  {step.image && (
                    <Image src={step.image} alt={step.title || ''} fill className="object-contain" />
                  )}
                </div>

                {/* Title */}
                <h3 className="text-[17px] font-bold text-[#0a1128] text-center mb-2.5 leading-snug">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-500 text-center leading-relaxed font-normal">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
