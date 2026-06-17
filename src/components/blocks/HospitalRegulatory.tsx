import React from 'react';
import Image from 'next/image';

interface RegulatoryPoint {
  label: string;
}

interface HospitalRegulatoryContent {
  heading?: string;
  description?: string;
  points?: RegulatoryPoint[];
  image1?: string;
}

interface HospitalRegulatoryProps {
  content?: HospitalRegulatoryContent;
}

export function HospitalRegulatory({ content }: HospitalRegulatoryProps) {
  const heading = content?.heading || "Regulatory Standards\nCompliance";
  const description = content?.description || "ebizframeRx is highly compliant and adheres to all global standards including HIPAA, HL7, and ICD-10. This ensures interoperability, robust data exchange, and regulatory alignment for hospital operations. The core architecture uses advanced security protocols to keep sensitive healthcare data safe and confidential.";

  const defaultPoints = [
    { label: "Enhanced Clinical Data Exchange" },
    { label: "High Availability & Scalability" },
    { label: "Role-Based Access Control (RBAC)" },
    { label: "Stringent Data Security Policies" },
    { label: "Centralized Access Management" },
    { label: "Comprehensive Auditing Systems" }
  ];

  const points = content?.points || defaultPoints;
  const image1 = content?.image1 || "/Hospital Management/Frame 270.png";

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col-reverse lg:flex-row items-center gap-12 lg:gap-20">

          {/* Left Image Composition */}
          <div className="lg:w-1/2 w-full">
            <div className="relative w-full aspect-[4/3] lg:aspect-auto lg:h-[500px]">
              <Image src={image1} alt="Regulatory compliance highlight" fill className="object-contain" />
            </div>
          </div>

          {/* Right Text & Points */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6 whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {points.map((point, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#2a2d7c]/30 text-[#2a2d7c] font-bold text-sm px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2a2d7c]/60 transition-all flex items-center justify-start text-left"
                >
                  {point.label}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
