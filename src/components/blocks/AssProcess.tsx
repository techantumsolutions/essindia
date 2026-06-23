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
  const title = content?.title || 'How It Works';
  const steps = content?.steps || [
    { image: '/App-After Sales Service/Process 1.png', title: 'Register Complaint', description: 'Customer raises a complaint through the app or portal' },
    { image: '/App-After Sales Service/Process 2.png', title: 'Auto Assignment', description: 'Complaint is automatically assigned to the nearest service executive' },
    { image: '/App-After Sales Service/Process 3.png', title: 'On-Site Service', description: 'Executive visits the customer location and resolves the issue' },
    { image: '/App-After Sales Service/Process 4.png', title: 'Feedback Collection', description: 'Customer provides feedback on the service quality' },
    { image: '/App-After Sales Service/Process 5.png', title: 'Report & Analyse', description: 'Generate reports to analyse trends and improve service' },
  ];

  return (
    <section className="p-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] text-center mb-14 leading-tight">
          {title}
        </h2>

        {/* Process Steps */}
        <div className="relative">
          {/* Connection Line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#3b82f6] opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step: ProcessStep, idx: number) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                {/* Step Image */}
                <div className="relative w-28 h-28 mb-5 rounded-2xl overflow-hidden bg-[#f8f9fb] group-hover:shadow-lg transition-shadow">
                  {step.image && (
                    <Image src={step.image} alt={step.title || ''} fill className="object-contain p-3" />
                  )}
                </div>

                {/* Step Number */}
                <div className="w-8 h-8 rounded-full bg-[#3b82f6] text-white text-xs font-bold flex items-center justify-center mb-3">
                  {idx + 1}
                </div>

                <h3 className="text-sm font-bold text-[#0f172a] mb-1.5">{step.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
