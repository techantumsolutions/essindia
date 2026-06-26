'use client';

import React from 'react';
import Link from 'next/link';

interface AssCtaContent {
  bgColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonText?: string;
  buttonUrl?: string;
  buttonBgColor?: string;
  buttonTextColor?: string;
}

export function AssCta({ content }: { content?: AssCtaContent }) {
  const bgColor = content?.bgColor || '#eff3f8';
  const title = content?.title || 'Future-Ready Oracle Database Strategy';
  const titleColor = content?.titleColor || '#5b45b2';
  const description = content?.description || 'Database upgrades often serve as a foundation for modernization initiatives, including migration to Oracle APEX or cloud infrastructure. We help define that roadmap strategically.';
  const descriptionColor = content?.descriptionColor || '#374151';
  const buttonText = content?.buttonText || 'Explore Your Upgrade Roadmap';
  const buttonUrl = content?.buttonUrl || '#';
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

        <Link
          href={buttonUrl}
          className="inline-block font-bold px-8 py-3.5 rounded-full hover:scale-105 hover:shadow-lg transition-all duration-300 text-sm shadow-md"
          style={{
            backgroundColor: buttonBgColor,
            color: buttonTextColor
          }}
        >
          {buttonText}
        </Link>
      </div>
    </section>
  );
}
