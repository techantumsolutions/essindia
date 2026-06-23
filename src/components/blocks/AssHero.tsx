'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AssHeroContent {
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  button1BgColor?: string;
  button1BorderColor?: string;
  button1Text?: string;
  button1TextColor?: string;
  button1Url?: string;
  button2BgColor?: string;
  button2BorderColor?: string;
  button2Text?: string;
  button2TextColor?: string;
  button2Url?: string;
  image?: string;
}

export function AssHero({ content }: { content?: AssHeroContent }) {
  const bgColor = content?.bgColor || '#161f38';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || '#ffffff';
  const badgeText = content?.badgeText || 'After Sales Service';
  const badgeTextColor = content?.badgeTextColor || '#2a2b6a';
  const title = content?.title || 'Transform Customer\nSupport with Smart\nAfter-Sales Service';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Digitize service operations, improve field productivity, and deliver faster customer resolution with a connected after-sales platform.';
  const descriptionColor = content?.descriptionColor || '#cbd5e1';
  const button1BgColor = content?.button1BgColor || '#2a2b6a';
  const button1BorderColor = content?.button1BorderColor || '#2a2b6a';
  const button1Text = content?.button1Text || 'Request Demo';
  const button1TextColor = content?.button1TextColor || '#ffffff';
  const button1Url = content?.button1Url || '#contact';
  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'Explore Features';
  const button2TextColor = content?.button2TextColor || '#2a2b6a';
  const button2Url = content?.button2Url || '#features';
  const image = content?.image || '/App-After Sales Service/002b2026-6c0c-4820-958f-344b26611bc6 1.png';

  return (
    <section className="pt-40 pb-14 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Content */}
          <div className="lg:w-1/2 w-full">
            {badgeText && (
              <span
                className="inline-block px-5 py-2 border font-semibold text-sm rounded-full mb-8"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderColor: badgeBorderColor }}
              >
                {badgeText}
              </span>
            )}

            {title.includes('<p>') ? (
              <div
                className="text-4xl md:text-5xl lg:text-[62px] font-extralight mb-6 leading-[1.12] tracking-tight whitespace-pre-line prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1
                className="text-4xl md:text-5xl lg:text-[62px] font-light mb-6 leading-[1.12] tracking-tight whitespace-pre-line"
                style={{ color: titleColor }}
              >
                {title}
              </h1>
            )}

            {description.includes('<p>') ? (
              <div
                className="text-base md:text-lg leading-relaxed mb-10 max-w-xl font-light prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-xl font-light" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap gap-4">
              <Link
                href={button1Url}
                className="inline-block font-bold px-7 py-3 rounded-full border-2 hover:brightness-110 transition-all text-sm"
                style={{ backgroundColor: button1BgColor, color: button1TextColor, borderColor: button1BorderColor }}
              >
                {button1Text}
              </Link>
              <Link
                href={button2Url}
                className="inline-block font-bold px-7 py-3 rounded-full border-2 hover:brightness-110 transition-all text-sm"
                style={{ backgroundColor: button2BgColor, color: button2TextColor, borderColor: button2BorderColor }}
              >
                {button2Text}
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[620px] aspect-[4/3]">
              <Image
                src={image}
                alt="After Sales Service Dashboard"
                fill
                className="object-contain"
                priority
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
