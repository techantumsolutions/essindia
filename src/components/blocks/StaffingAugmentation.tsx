import React from 'react';

interface StaffingAugmentationContent {
  heading?: string;
  paragraph1?: string;
  paragraph2?: string;
}

interface StaffingAugmentationProps {
  content?: StaffingAugmentationContent;
}

export function StaffingAugmentation({ content }: StaffingAugmentationProps) {
  const heading = content?.heading || "staff-Augmentation";
  const paragraph1 = content?.paragraph1 || "Outsourced IT services help organizations realign focus around core competencies while IT relies on a dependable partner. ESS acts as a seamlessly integrated arm of the organization, providing robust IT environments. Preventive maintenance services keep running business operations with maximized efficiency. Used as a predictable IT optimization solution, it helps optimize internal operations, improve efficiency, and lower costs.";
  const paragraph2 = content?.paragraph2 || "With over 25 years of software development expertise, Eastern Software Solutions offers predictive staff augmentation and customized IT outsourcing services tailored to the client's needs. ESS places IT developers and professionals quickly to meet business demands efficiently. This specific IT team extension supports multiple projects in full-time/ad-hoc/on-demand/outsourced bases, offering ESS a competitive edge to resolve IT bottlenecks while optimizing internal operations with top-tier performance.";

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-8 text-center">
            {heading}
          </h2>
          <div className="space-y-6 text-gray-500 text-sm md:text-base leading-relaxed">
            <p>{paragraph1}</p>
            <p>{paragraph2}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
