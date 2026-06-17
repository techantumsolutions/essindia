import React from 'react';
import Image from 'next/image';

interface FeaturePoint {
  label: string;
}

interface HospitalFeaturesContent {
  heading?: string;
  description?: string;
  features?: FeaturePoint[];
  image1?: string;
}

interface HospitalFeaturesProps {
  content?: HospitalFeaturesContent;
}

export function HospitalFeatures({ content }: HospitalFeaturesProps) {
  const heading = content?.heading || "Salient Features of\nebizframeRx HMS";
  const description = content?.description || "ebizframeRx HMS is a comprehensive workflow management software tailored to streamline hospital operations, improve profitability, and enhance patient care delivery with automated, responsive, and data-driven solutions.";

  const defaultFeatures = [
    { label: "High Performance & Scalability" },
    { label: "User friendly administration" },
    { label: "Portable across a variety of platforms" },
    { label: "Auto logging of transactions" },
    { label: "Seamless integration with financial HIS" },
    { label: "Comprehensive connectivity" },
    { label: "HIPAA and HL7 compliant" }
  ];

  const features = content?.features || defaultFeatures;
  const image1 = content?.image1 || "/Hospital Management/Frame 269.png";

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Text & Features */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6 whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#2a2d7c]/30 text-[#2a2d7c] font-bold text-sm px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2a2d7c]/60 transition-all flex items-center justify-start text-left"
                >
                  {feature.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <Image src={image1} alt="Feature highlight" fill className="object-contain" />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
