import React from 'react';
import Image from 'next/image';

interface TechSpecPoint {
  label: string;
}

interface HospitalTechSpecsContent {
  heading?: string;
  description?: string;
  specs?: TechSpecPoint[];
  image1?: string;
  image2?: string;
  image3?: string;
}

interface HospitalTechSpecsProps {
  content?: HospitalTechSpecsContent;
}

export function HospitalTechSpecs({ content }: HospitalTechSpecsProps) {
  const heading = content?.heading || "Technical Specifications\nof ebizframeRx HMS";
  const description = content?.description || "ebizframeRx is built on modern, scalable architectures specifically tailored for enterprise hospital operations. The core technological stack guarantees reliable, seamless, and lightning-fast responsiveness under high concurrency, making it easy to integrate with a multitude of medical devices and other digital health platforms.";

  const defaultSpecs = [
    { label: "Tiered Application Architecture Specifications" },
    { label: "IIS 8.0 Application Server" },
    { label: "My SQL DB & Database Server" },
    { label: "HTML5, CSS3, JavaScript Web\nApplication Development" },
    { label: "Auto-scaled Backend Application" },
    { label: "AI/ML Powered Data Analytics &\nReport UI" },
    { label: "Windows 2019 Enterprise\nServer and above" },
    { label: "Sub-millisecond latency on UI queries" }
  ];

  const specs = content?.specs || defaultSpecs;
  let image1 = content?.image1 || "/Hospital Management/image 74.png";
  if (image1 === "/Hospital Management/Frame 271.png") {
    image1 = "/Hospital Management/image 74.png";
  }
  const image2 = content?.image2 || "/Hospital Management/image 75.png";
  const image3 = content?.image3 || "/Hospital Management/image 76.png";

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-stretch gap-12 lg:gap-20">

          {/* Left Text & Specs */}
          <div className="lg:w-1/2 w-full">
            <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6 whitespace-pre-line">
              {heading}
            </h2>
            <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
              {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {specs.map((spec, idx) => (
                <div
                  key={idx}
                  className="bg-white border-2 border-[#2a2d7c]/30 text-[#2a2d7c] font-bold text-sm px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:border-[#2a2d7c]/60 transition-all flex items-center justify-start text-left whitespace-pre-line"
                >
                  {spec.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right Image Composition */}
          <div className="lg:w-1/2 w-full">
            <div className="flex flex-col gap-4 w-full h-full">
              {/* Top Image */}
              <div className="relative w-full flex-1 min-h-[250px] rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                <Image src={image1} alt="Tech Specs highlight 1" fill className="object-cover" />
              </div>
              
              {/* Bottom Row */}
              <div className="flex gap-4 w-full h-48 lg:h-64">
                <div className="relative w-1/2 h-full rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <Image src={image2} alt="Tech Specs highlight 2" fill className="object-cover" />
                </div>
                <div className="relative w-1/2 h-full rounded-3xl overflow-hidden shadow-lg border border-gray-100">
                  <Image src={image3} alt="Tech Specs highlight 3" fill className="object-cover" />
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
