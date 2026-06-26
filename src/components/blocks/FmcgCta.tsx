'use client';

import React from 'react';
import Link from 'next/link';

interface FmcgCtaContent {
  title?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function FmcgCta({ content }: { content?: FmcgCtaContent }) {
  const title = content?.title || 'Enable Digital Transformation of Your Business with Our Wide Range of IT Services';
  const buttonText = content?.buttonText || 'TALK TO OUR EXPERTS';
  const buttonUrl = content?.buttonUrl || '/contact';

  return (
    <section className="py-14 px-6 bg-[#eff3f8] border-b border-slate-100">
      <div className="container mx-auto max-w-4xl text-center space-y-8">

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-normal text-[#3c158e] leading-tight max-w-3xl mx-auto">
          {title}
        </h2>

        {/* Action Button */}
        <div>
          <Link
            href={buttonUrl}
            className="inline-block bg-[#fcc42c] hover:bg-[#ebae21] text-[#131e3d] font-bold text-xs sm:text-sm px-8 py-4 rounded-full shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-[2px]"
          >
            {buttonText}
          </Link>
        </div>

      </div>
    </section>
  );
}
