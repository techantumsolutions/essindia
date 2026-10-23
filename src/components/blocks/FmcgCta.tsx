'use client';

import React, { useState } from 'react';
import { CtaLeadModal } from '@/components/ui/CtaLeadModal';
import Link from 'next/link';

interface FmcgCtaContent {
  title?: string;
  buttonText?: string;
  buttonHoverBgColor?: string;
  buttonHoverTextColor?: string;
  pdfUrl?: string;
}

export function FmcgCta({ content }: { content?: FmcgCtaContent }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBtnHovered, setIsBtnHovered] = useState(false);

  const title = content?.title || 'Enable Digital Transformation of Your Business with Our Wide Range of IT Services';
  const buttonText = content?.buttonText || 'TALK TO OUR EXPERTS';
  const buttonHoverBgColor = content?.buttonHoverBgColor;
  const buttonHoverTextColor = content?.buttonHoverTextColor;
  const pdfUrl = content?.pdfUrl;

  return (
    <section className="py-12 px-6 bg-[#eff3f8] border-b border-slate-100">
      <div className="container mx-auto max-w-4xl text-center space-y-8">

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#3c158e] leading-tight max-w-3xl mx-auto">
          {title}
        </h2>

        {/* Action Button */}
        <div>
          <button
            onClick={() => setIsModalOpen(true)}
            onMouseEnter={() => setIsBtnHovered(true)}
            onMouseLeave={() => setIsBtnHovered(false)}
            style={
              isBtnHovered && (buttonHoverBgColor || buttonHoverTextColor)
                ? {
                  backgroundColor: buttonHoverBgColor || undefined,
                  color: buttonHoverTextColor || undefined,
                }
                : undefined
            }
            className={`bg-[#4B2A63] ${buttonHoverBgColor ? '' : 'hover:bg-[#3A1F4D]'} text-white px-8 py-3 rounded-full font-medium transition-colors inline-flex items-center gap-2 cursor-pointer`}
          >
            {buttonText}
          </button>
        </div>

      </div>

      <CtaLeadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} pdfUrl={pdfUrl} />
    </section>
  );
}
