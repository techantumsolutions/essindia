'use client';

import React from 'react';
import Image from 'next/image';

interface AssClientsContent {
  title?: string;
  logos?: string[];
}

export function AssClients({ content }: { content?: AssClientsContent }) {
  const title = content?.title || 'Trusted by Leading Enterprises';
  const logos = content?.logos || [
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 1.png',
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 2.png',
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 3.png',
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 4.png',
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 5.png',
    '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 6.png',
  ];

  return (
    <section className="p-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] text-center mb-12 leading-tight">
          {title}
        </h2>

        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {logos.map((logo: string, idx: number) => (
            <div key={idx} className="relative w-24 h-16 md:w-32 md:h-20 grayscale hover:grayscale-0 opacity-70 hover:opacity-100 transition-all duration-300">
              <Image src={logo} alt={`Client ${idx + 1}`} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
