import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface HospitalHeroContent {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryCta?: { label: string; url: string };
  secondaryCta?: { label: string; url: string };
  image?: string;
}

interface HospitalHeroProps {
  content?: HospitalHeroContent;
}

export function HospitalHero({ content }: HospitalHeroProps) {
  const badge = content?.badge || "Hospital Management";
  const title = content?.title || "Smart Hospital<br />Management System (HMS)<br />for Connected Healthcare";
  const subtitle = content?.subtitle || "A comprehensive healthcare solution that integrates clinical, financial, and operational systems to deliver better patient care, streamline workflows, and ensure regulatory compliance across medical institutions.";
  const primaryCta = content?.primaryCta || { label: "Get started", url: "#" };
  const secondaryCta = content?.secondaryCta || { label: "Explore features", url: "#" };
  const image = content?.image || "/Hospital Management/Rectangle 197.png";

  return (
    <section className="bg-[#320965] text-white pt-40 pb-14 px-6 relative overflow-hidden">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Content */}
          <div className="lg:w-1/2 space-y-6">
            <div className="inline-block bg-white text-[#2a2d7c] font-semibold px-5 py-2 rounded-full text-sm shadow-sm">
              {badge}
            </div>
            <h1
              className="text-4xl md:text-5xl font-light leading-tight"
              dangerouslySetInnerHTML={{ __html: title }}
            />
            <p className="text-base md:text-lg text-white/90 max-w-xl leading-relaxed">
              {subtitle}
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href={primaryCta.url}
                className="inline-block bg-white text-[#2a2d7c] px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors shadow-lg"
              >
                {primaryCta.label}
              </Link>
              <Link
                href={secondaryCta.url}
                className="inline-block bg-transparent border border-white text-white px-8 py-3 rounded-full font-medium hover:bg-white/10 transition-colors"
              >
                {secondaryCta.label}
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
