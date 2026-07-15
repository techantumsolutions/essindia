'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface JudicialHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  bgColor?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  buttonBgColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonUrl?: string;
  image?: string;
}

interface JudicialHeroProps {
  content?: JudicialHeroContent;
}

export function JudicialHero({ content }: JudicialHeroProps) {
  const bgColor = content?.bgColor || '#9da2c9';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeText = content?.badgeText || 'Judicial Automation';
  const badgeTextColor = content?.badgeTextColor || '#2a2d7c';
  const title = content?.title || 'Intelligent IT & Judicial<br />Automation Solutions';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Streamline legal operations, modernize enterprise infrastructure, and optimize business performance with secure, scalable, and technology-driven solutions from ESS.';
  const descriptionColor = content?.descriptionColor || 'rgba(255,255,255,0.9)';
  const buttonBgColor = content?.buttonBgColor || '#2a2d7c';
  const buttonText = content?.buttonText || 'Get started';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonUrl = content?.buttonUrl || '#';
  const image = content?.image || '/Judicial Automation/Rectangle 196.png';

  
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: bgColor });

  return (
    <section className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6" style={bgStyles}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-6 text-white">
            {badgeText && (
              <div 
                className="inline-block font-semibold px-4 py-2 rounded-full text-sm"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
              >
                {badgeText}
              </div>
            )}
            
             {title.includes('<p>') ? (
              <div 
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6 prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.1] mb-6"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-base sm:text-lg max-w-xl leading-relaxed mb-8 prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base sm:text-lg max-w-xl leading-relaxed mb-8" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div>
              <Link
                href={buttonUrl}
                className="inline-block px-6 py-3 rounded-full font-bold hover:brightness-95 transition-all shadow-md text-sm text-center min-w-[140px]"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                {buttonText}
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-end w-full">
            <div className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={image}
                alt="Judicial Automation Illustration"
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
