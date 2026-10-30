'use client';

import React from 'react';

interface BiTitleContent {
  title?: string;
  bgColor?: string;
  titleColor?: string;
}

export function BiTitle({ content }: { content?: BiTitleContent }) {
  const title = content?.title || 'Business Intelligence';
  const bgColor = content?.bgColor || '#ffffff';
  const titleColor = content?.titleColor || '#1a1a1a';

  return (
    <section
      className="py-8 w-full font-sans transition-colors border-t border-b border-slate-100"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col text-center items-center">
          {title && (
            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight leading-tight"
              style={{ color: titleColor }}
            >
              {title}
            </h2>
          )}
        </div>
      </div>
    </section>
  );
}
