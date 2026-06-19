import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface JudicialHeroContent {
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

  return (
    <section className="pt-40 pb-14 px-6" style={{ backgroundColor: bgColor }}>
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
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight prose prose-invert max-w-none"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            ) : (
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
                style={{ color: titleColor }}
                dangerouslySetInnerHTML={{ __html: title }}
              />
            )}

            {description.includes('<p>') ? (
              <div 
                className="text-base md:text-lg max-w-xl prose prose-invert max-w-none prose-p:my-2"
                style={{ color: descriptionColor }}
                dangerouslySetInnerHTML={{ __html: description }}
              />
            ) : (
              <p className="text-base md:text-lg max-w-xl" style={{ color: descriptionColor }}>
                {description}
              </p>
            )}

            <div>
              <Link
                href={buttonUrl}
                className="inline-block px-8 py-3 rounded-full font-medium hover:brightness-95 transition-all shadow-sm"
                style={{ backgroundColor: buttonBgColor, color: buttonTextColor }}
              >
                {buttonText}
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-end">
            <div className="relative w-full max-w-[900px] aspect-[4/3]">
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
