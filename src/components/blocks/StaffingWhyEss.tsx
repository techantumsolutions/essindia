import React from 'react';
import Image from 'next/image';

interface PillPoint {
  label: string;
}

interface StaffingWhyEssContent {
  heading?: string;
  description?: string;
  pills?: PillPoint[];
  image?: string;
}

interface StaffingWhyEssProps {
  content?: StaffingWhyEssContent;
}

export function StaffingWhyEss({ content }: StaffingWhyEssProps) {
  const heading = content?.heading || "Why ESS is the perfect partner\nfor your IT Outsourcing needs?";
  const description = content?.description || "ebizframeRx HMS offers a comprehensive healthcare management platform designed to streamline hospital operations, improve patient care, and enhance overall efficiency through integrated, secure, and intelligent healthcare solutions.";

  const defaultPills = [
    { label: "Experience with Fortune 10 clients" },
    { label: "Access top IT Talent" },
    { label: "Offshore/Onsite/Global deployment Capabilities" },
    { label: "Shared and dedicated ODC" },
    { label: "Strong Domain Knowledge" },
    { label: "High speed communication" },
    { label: "All hours availability to suit your time zone" }
  ];

  const pills = content?.pills || defaultPills;
  const image = content?.image || "/Staffing Services/image 54.png";

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Text & Pills */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-4xl font-extrabold text-[#2a2d7c] mb-6 whitespace-pre-line leading-tight">
              {heading}
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {pills.map((pill, idx) => (
                <div
                  key={idx}
                  className="bg-white border border-[#2a2d7c]/40 text-[#2a2d7c] font-semibold text-[15px] px-6 py-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-start text-left"
                >
                  {pill.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Image */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-square lg:h-[600px] rounded-[40px] overflow-hidden shadow-sm">
              <Image
                src={image}
                alt="Why choose ESS"
                fill
                className="object-cover"
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
