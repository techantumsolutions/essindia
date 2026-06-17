import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface StaffingHeroContent {
  badge?: string;
  title?: string;
  description?: string;
  primaryCta?: { label: string; url: string };
  image?: string;
}

interface StaffingHeroProps {
  content?: StaffingHeroContent;
}

export function StaffingHero({ content }: StaffingHeroProps) {
  const badge = content?.badge || "Staffing Services";
  const title = content?.title || "Smart IT Outsourcing &\nInfrastructure Management\nSolutions";
  const description = content?.description || "Streamline healthcare operations with an intelligent Hospital Management System designed to improve patient care, automate workflows, enhance clinical efficiency, and deliver real-time access across the healthcare ecosystem.";
  const primaryCta = content?.primaryCta || { label: "Talk to our IT Professionals", url: "#contact" };
  const image = content?.image || "/Staffing Services/image 54.png";

  return (
    <section className="pt-40 pb-14 px-6 bg-[#bac7d5]">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Content */}
          <div className="lg:w-1/2 w-full text-white">
            <span className="inline-block px-6 py-2.5 bg-white text-[#2a2d7c] border border-[#2a2d7c] font-semibold text-sm rounded-full mb-8">
              {badge}
            </span>

            <h1 className="text-4xl md:text-5xl font-light text-white mb-6 leading-[1.1] whitespace-pre-line">
              {title}
            </h1>

            <p className="text-white text-base md:text-lg leading-relaxed mb-10 max-w-2xl font-light">
              {description}
            </p>

            <div>
              <Link
                href={primaryCta.url}
                className="inline-block bg-white text-[#2a2d7c] font-bold px-8 py-3.5 rounded-full hover:bg-gray-50 transition-colors shadow-sm"
              >
                {primaryCta.label}
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
