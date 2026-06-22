import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HospitalHeroContent {
  bgColor?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  primaryButtonText?: string;
  primaryButtonUrl?: string;
  primaryButtonBgColor?: string;
  primaryButtonTextColor?: string;
  secondaryButtonText?: string;
  secondaryButtonUrl?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonTextColor?: string;
  image?: string;
}

interface HospitalHeroProps {
  content?: HospitalHeroContent;
}

export function HospitalHero({ content }: HospitalHeroProps) {
  const bgColor = content?.bgColor || '#320965';
  const badgeText = content?.badgeText || 'Hospital Management';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#2a2d7c';
  const title = content?.title || 'Smart Hospital<br />Management System (HMS)<br />for Connected Healthcare';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'A comprehensive healthcare solution that integrates clinical, financial, and operational systems to deliver better patient care, streamline workflows, and ensure regulatory compliance across medical institutions.';
  const descriptionColor = content?.descriptionColor || 'rgba(255,255,255,0.9)';
  const primaryButtonText = content?.primaryButtonText || 'Get started';
  const primaryButtonUrl = content?.primaryButtonUrl || '#';
  const primaryButtonBgColor = content?.primaryButtonBgColor || '#ffffff';
  const primaryButtonTextColor = content?.primaryButtonTextColor || '#2a2d7c';
  const secondaryButtonText = content?.secondaryButtonText || 'Explore features';
  const secondaryButtonUrl = content?.secondaryButtonUrl || '#';
  const secondaryButtonBgColor = content?.secondaryButtonBgColor || 'transparent';
  const secondaryButtonTextColor = content?.secondaryButtonTextColor || '#ffffff';
  const image = content?.image || '/Hospital Management/Rectangle 197.png';

  return (
    <section className="pt-40 pb-14 px-6 relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="lg:w-1/2 space-y-6">
            <div 
              className="inline-block font-semibold px-5 py-2 rounded-full text-sm shadow-sm"
              style={{ backgroundColor: badgeBgColor, color: badgeTextColor }}
            >
              {badgeText}
            </div>
            
            {title.includes('<p>') ? (
              <div 
                className="text-4xl md:text-5xl font-light leading-tight prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1
                className="text-4xl md:text-5xl font-light leading-tight"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-base md:text-lg max-w-xl leading-relaxed prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base md:text-lg max-w-xl leading-relaxed" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={primaryButtonUrl}
                className="inline-block px-8 py-3 rounded-full font-medium hover:brightness-90 transition-all shadow-lg"
                style={{ backgroundColor: primaryButtonBgColor, color: primaryButtonTextColor }}
              >
                {primaryButtonText}
              </Link>
              <Link
                href={secondaryButtonUrl}
                className="inline-block border px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
                style={{ backgroundColor: secondaryButtonBgColor, color: secondaryButtonTextColor, borderColor: secondaryButtonTextColor }}
              >
                {secondaryButtonText}
              </Link>
            </div>
          </div>

          {/* Image */}
          <div className="lg:w-1/2 flex justify-end">
            <div className="relative w-full max-w-[800px] aspect-square lg:aspect-[4/3] flex items-center justify-center">
              <Image
                src={image}
                alt="Hospital Management System Illustration"
                fill
                className="object-contain drop-shadow-2xl"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
