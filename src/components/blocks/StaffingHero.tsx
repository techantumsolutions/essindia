import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StaffingHeroContent {
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
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

interface StaffingHeroProps {
  content?: StaffingHeroContent;
}

export function StaffingHero({ content }: StaffingHeroProps) {
  const bgColor = content?.bgColor || '#bac7d5';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || '#2a2d7c';
  const badgeText = content?.badgeText || 'Staffing Services';
  const badgeTextColor = content?.badgeTextColor || '#2a2d7c';
  const title = content?.title || 'Smart IT Outsourcing &\nInfrastructure Management\nSolutions';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'Streamline healthcare operations with an intelligent Hospital Management System designed to improve patient care, automate workflows, enhance clinical efficiency, and deliver real-time access across the healthcare ecosystem.';
  const descriptionColor = content?.descriptionColor || '#ffffff';
  const buttonBgColor = content?.buttonBgColor || '#ffffff';
  const buttonText = content?.buttonText || 'Talk to our IT Professionals';
  const buttonTextColor = content?.buttonTextColor || '#2a2d7c';
  const buttonUrl = content?.buttonUrl || '#contact';
  const image = content?.image || '/Staffing Services/image 54.png';

  return (
    <section className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="lg:w-1/2 w-full text-white">
            {badgeText && (
              <span 
                className="inline-block px-6 py-2.5 border font-semibold text-sm rounded-full mb-8"
                style={{ backgroundColor: badgeBgColor, color: badgeTextColor, borderColor: badgeBorderColor }}
              >
                {badgeText}
              </span>
            )}

            {title.includes('<p>') ? (
              <div 
                className="text-4xl md:text-5xl font-light mb-6 leading-[1.1] whitespace-pre-line prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1 
                className="text-4xl md:text-5xl font-light mb-6 leading-[1.1] whitespace-pre-line"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-light prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-light" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div>
              <Link
                href={buttonUrl}
                className="inline-block font-bold px-8 py-3.5 rounded-full hover:brightness-95 transition-all shadow-sm"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                {buttonText}
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 w-full flex justify-center lg:justify-end">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
              <Image
                src={image}
                alt="Staffing Services Hero"
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
