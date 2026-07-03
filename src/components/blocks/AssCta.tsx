'use client';

import React, { useState } from 'react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';
import Link from 'next/link';

interface AssCtaContent {
  bgColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonText?: string;
  pdfUrl?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export function AssCta({ content }: { content?: AssCtaContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bgColor = content?.bgColor || '#eff3f8';
  const title = content?.title || 'Future-Ready Oracle Database Strategy';
  const titleColor = content?.titleColor || '#5b45b2';
  const description = content?.description || 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.';
  const descriptionColor = content?.descriptionColor || '#374151';
  const buttonText = content?.buttonText || 'Explore Your Upgrade Roadmap';
  const pdfUrl = content?.pdfUrl;
  const buttonBgColor = content?.buttonBgColor || '#fcc42c';
  const buttonTextColor = content?.buttonTextColor || '#000000';

  return (
    <section
      className="py-10 px-6 border-b transition-colors duration-300"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto max-w-4xl text-center">
        <h2
          className="text-3xl md:text-4xl font-normal mb-5 leading-tight tracking-tight"
          style={{ color: titleColor }}
        >
          {title}
        </h2>

        {description.includes('<p>') ? (
          <div
            className="text-sm md:text-base font-bold leading-relaxed mb-8 max-w-3xl mx-auto prose max-w-none"
            style={{ color: descriptionColor }}
            dangerouslySetInnerHTML={{ __html: description }}
          />
        ) : (
          <p
            className="text-sm md:text-base font-bold leading-relaxed mb-8 max-w-3xl mx-auto"
            style={{ color: descriptionColor }}
          >
            {description}
          </p>
        )}

        <button onClick={() => setIsModalOpen(true)} className="bg-[#4B2A63] text-white hover:bg-[#3A1F4D] px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2">
          {buttonText}
        </button>
      </div>
    
      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}
