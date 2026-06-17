import React from 'react';
import Image from 'next/image';

interface OverviewCard {
  title: string;
  description: string;
  image: string;
}

interface HospitalOverviewContent {
  heading?: string;
  description?: string;
  cards?: OverviewCard[];
}

interface HospitalOverviewProps {
  content?: HospitalOverviewContent;
}

export function HospitalOverview({ content }: HospitalOverviewProps) {
  const heading = content?.heading || "Hospital Management Systems (HMS)";
  const description = content?.description || "Modern healthcare is primarily driven by efficient hospital systems where accurate data, seamless operations, and patient-centric care take center stage. ebizframeRx HMS is a scalable, AI-powered healthcare management solution designed to streamline hospital operations, improve clinical outcomes, and enhance patient care.";

  const defaultCards = [
    {
      title: "ebizframeRx",
      description: "ebizframeRx is highly configurable and seamlessly integrates different hospital operations such as patient care, IPD/OPD, billing, and pharmacy under a single platform. It is a highly robust and reliable system designed to meet the demands of modern healthcare institutions.",
      image: "/Hospital Management/Rectangle 196.png"
    },
    {
      title: "ebizframeRx HMS",
      description: "ebizframeRx HMS is a comprehensive Hospital Management ERP Solution for mid-to-large multi-speciality hospitals. Our solution leverages cutting-edge technology to automate workflows, optimize resource utilization, and ensure better care management.",
      image: "/Hospital Management/Rectangle 197.png"
    },
    {
      title: "ebizframeRx",
      description: "ebizframeRx offers a comprehensive hospital information system (HIS) for managing complete lifecycle operations starting from patient admission to discharge. It enables clinical and financial workflows through automated data exchange.",
      image: "/Hospital Management/Rectangle 198.png"
    }
  ];

  const cards = content?.cards || defaultCards;

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className=" mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6 text-center">
            {heading}
          </h2>
          <p className="text-gray-600 max-w-7xl mx-auto text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">{card.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
