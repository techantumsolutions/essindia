'use client';

import React from 'react';
import Link from 'next/link';

interface AssCtaContent {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonUrl?: string;
}

export function AssCta({ content }: { content?: AssCtaContent }) {
  const title = content?.title || 'Ready to transform your after-sales service?';
  const description = content?.description || 'Get started with our intelligent service platform and deliver exceptional customer experiences.';
  const buttonText = content?.buttonText || 'Schedule a Demo';
  const buttonUrl = content?.buttonUrl || '#contact';

  return (
    <section className="p-14 px-6 bg-gradient-to-r from-[#1a1f4e] to-[#2d1b69]">
      <div className="container mx-auto max-w-4xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-5 leading-tight">
          {title}
        </h2>

        {description.includes('<p>') ? (
          <div className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
        ) : (
          <p className="text-base text-slate-300 leading-relaxed mb-8 max-w-2xl mx-auto">{description}</p>
        )}

        <Link
          href={buttonUrl}
          className="inline-block font-bold px-8 py-3.5 rounded-full bg-white text-[#1a1f4e] hover:bg-slate-100 transition-colors shadow-lg text-sm"
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
