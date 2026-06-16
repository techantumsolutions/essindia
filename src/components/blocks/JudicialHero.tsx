import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface JudicialHeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; url: string };
  image?: string;
}

interface JudicialHeroProps {
  content?: JudicialHeroContent;
}

export function JudicialHero({ content }: JudicialHeroProps) {
  const badge = content?.badge || "Judicial Automation";
  const title = content?.title || "Intelligent IT & Judicial<br />Automation Solutions";
  const subtitle = content?.subtitle || "Streamline legal operations, modernize enterprise infrastructure, and optimize business performance with secure, scalable, and technology-driven solutions from ESS.";
  const primaryCta = content?.primaryCta || { label: "Get started", url: "#" };
  const image = content?.image || "/Judicial Automation/More solutions-Judicial Automation.png";

  return (
    <section className="bg-[#9da2c9] text-white pt-40 pb-14 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block bg-white text-[#2a2d7c] font-semibold px-4 py-2 rounded-full text-sm">
              {badge}
            </div>
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-light leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-base md:text-lg max-w-xl text-white/90">
              {subtitle}
            </p>
            <div>
              <Link 
                href={primaryCta.url}
                className="inline-block bg-[#2a2d7c] text-white px-8 py-3 rounded-full font-medium hover:bg-[#1f215e] transition-colors"
              >
                {primaryCta.label}
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 flex justify-end">
            <div className="relative w-full max-w-[600px] aspect-[4/3]">
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
