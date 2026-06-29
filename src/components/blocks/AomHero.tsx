'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AomHeroContent {
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

export function AomHero({ content }: { content?: AomHeroContent }) {
  const bgColor = content?.bgColor || '#0f172a';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Enterprise Mobility Solutions';
  const badgeTextColor = content?.badgeTextColor || '#2a2b6a';

  const title = content?.title || 'Empowering Businesses Through Enterprise Mobility';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Empower your workforce with intelligent mobile applications that streamline operations, improve collaboration, and enable real-time business access from anywhere.';
  const descriptionColor = content?.descriptionColor || '#cbd5e1';

  const button1BgColor = content?.button1BgColor || '#1a1f4e';
  const button1BorderColor = content?.button1BorderColor || '#1a1f4e';
  const button1Text = content?.button1Text || 'Get started';
  const button1TextColor = content?.button1TextColor || '#ffffff';
  const button1Url = content?.button1Url || '#';

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'Explore ROI Calculator';
  const button2TextColor = content?.button2TextColor || '#2a2b6a';
  const button2Url = content?.button2Url || '#';

  const rightImage = content?.image || '/App- App over view (mobile app)/f3273dba-dc3e-435a-bf5b-2c68d5a7ccd1 1.png';

  // We use a beautiful radial gradient mesh if default or custom bg
  const hasCustomBg = content?.bgColor && content.bgColor !== '#0f172a';
  const bgStyles = hasCustomBg
    ? { backgroundColor: bgColor }
    : { backgroundImage: 'radial-gradient(100% 100% at 50% 0%, #06b6d4 0%, #0284c7 40%, #0f172a 100%)' };

  return (
    <section
      className="pt-20 pb-14 px-6 relative overflow-hidden flex items-center min-h-[600px] text-white"
      style={bgStyles}
    >
      {/* Decorative lights */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/10 rounded-full" />

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">

          {/* Left Content Column */}
          <div className="flex-1 text-left space-y-3 lg:max-w-2xl">
            {badgeText && (
              <span
                className="inline-block px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider border-2 border-[#1a1f4e] shadow-md"
                style={{
                  backgroundColor: badgeBgColor,
                  borderColor: badgeBorderColor,
                  color: badgeTextColor
                }}
              >
                {badgeText}
              </span>
            )}

            <h1
              className="text-4xl sm:text-5xl font-light tracking-tight leading-tight"
              style={{ color: titleColor }}
            >
              {title}
            </h1>

            <p
              className="text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ color: descriptionColor }}
            >
              {description}
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              {button1Text && (
                <Link
                  href={button1Url}
                  className="px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-transform duration-300 hover:-translate-y-0.5 border "
                  style={{
                    backgroundColor: button1BgColor,
                    borderColor: button1BorderColor,
                    color: button1TextColor
                  }}
                >
                  {button1Text}
                </Link>
              )}

              {button2Text && (
                <Link
                  href={button2Url}
                  className="px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-transform duration-300 hover:-translate-y-0.5 border"
                  style={{
                    backgroundColor: button2BgColor,
                    borderColor: button2BorderColor,
                    color: button2TextColor
                  }}
                >
                  {button2Text}
                </Link>
              )}
            </div>
          </div>

          {/* Right Image Column */}
          {rightImage && (
            <div className="flex-1 w-full max-w-md lg:max-w-xl relative aspect-square lg:aspect-auto lg:h-[500px] shrink-0">
              <div className="w-full h-full relative animate-[float_6s_ease-in-out_infinite]">
                <Image
                  src={rightImage}
                  alt={title}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          )}

        </div>
      </div>

      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
      `}</style>
    </section>
  );
}
