import React from 'react';
import Image from 'next/image';

interface CardData {
  title: string;
  description: string;
  image: string;
}

interface JudicialOverviewContent {
  heading?: string;
  description?: string;
  cards?: CardData[];
}

interface JudicialOverviewProps {
  content?: JudicialOverviewContent;
}

export function JudicialOverview({ content }: JudicialOverviewProps) {
  const heading = content?.heading || "Judicial Automation";
  const description = content?.description || "ebizframeJustice is an advanced Judicial Automation solution designed to help courts and legal departments streamline case management, hearing schedules, court workflows, event notifications, and legal processes efficiently. Built to support different court scheduling models, the platform also enables the creation of strong e-justice networks while providing powerful search capabilities and access to over 1,00,000 judgments from the Supreme Court, High Courts, tribunals, commissions along with central and state acts and rules for faster and more convenient legal research.";
  
  const defaultCards = [
    {
      title: "Court-wise Databases",
      description: "Supreme Court and high court decisions on all areas of law, especially on the above subjects, till the present date. ebizframeJustice also covers the decisions of major Tribunals and Commissions like ITAT, SAT, CAT, TDSAT, CERC, APTEL, State and National Consumer Redressal Forums.",
      image: "/Judicial Automation/Rectangle 196.png"
    },
    {
      title: "Statutory Information",
      description: "More than 2,000 state and Central Acts & Rules, Regulations, the Notifications & Circulars from law enforcement authorities under these acts, which include CBDT, CBEC, CLB, RBI, SEBI, MCA, FEMA, etc. along with statutory forms as well as various deeds, and agreements and legal maxims.",
      image: "/Judicial Automation/Rectangle 197.png"
    }
  ];

  const cards = content?.cards || defaultCards;

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-6xl text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6">
          {heading}
        </h2>
        <p className="text-gray-600 max-w-5xl mx-auto mb-16 text-sm md:text-base leading-relaxed">
          {description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 text-left">
          {cards.map((card, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div className="relative w-full aspect-[16/9] mb-6 rounded-xl overflow-hidden shadow-sm">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{card.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed text-center">
                {card.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
