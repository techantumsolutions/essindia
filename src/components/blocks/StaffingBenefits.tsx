import React from 'react';
import Image from 'next/image';

interface BenefitCard {
  title: string;
  description: string;
  image: string;
}

interface StaffingBenefitsContent {
  heading?: string;
  description?: string;
  cards?: BenefitCard[];
}

interface StaffingBenefitsProps {
  content?: StaffingBenefitsContent;
}

export function StaffingBenefits({ content }: StaffingBenefitsProps) {
  const heading = content?.heading || "Benefits of IT Staff Augmentation";
  const description = content?.description || "At ESS, we offer staff augmentation services specifically designed to meet your short or long term business needs. Our goal is to provide a seamless extension of your in-house staff without the added burden of hiring and retaining employees. Here are some of the key benefits of IT Staff Augmentation from ESS:";

  const defaultCards: BenefitCard[] = [
    {
      title: "Filling the skills gap",
      description: "You may need to bring in a team of specialized experts to handle relatively complex projects. ESS allows you to tap into our talent pool of highly skilled professionals to help you reach your goals. Not only do we have the right talent, we also help you avoid the overhead costs of bringing in new employees.",
      image: "/Staffing Services/Rectangle 196.png"
    },
    {
      title: "Investing in What You Need",
      description: "An ESS IT augmentation setup is structured specifically for you to easily scale your IT workforce based on your business needs. This means you won't have to hire a permanent employee for short-term projects that can be easily handled by the professionals we will assign to your project over an agreed period of time.",
      image: "/Staffing Services/Rectangle 197.png"
    },
    {
      title: "Retaining control over existing staff",
      description: "One major fear of management whenever an external augmentation happens is the loss of control over the internal staff. ESS guarantees this will not be the case. We simply integrate into your existing ecosystem to fill in the gaps without disrupting your workflow. Your permanent staff will focus on what is most important while we handle the specialized projects.",
      image: "/Staffing Services/Rectangle 198.png"
    }
  ];

  const cards = content?.cards || defaultCards;

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className=" max-w-7xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-[#2a2d7c] mb-6 text-center">
            {heading}
          </h2>
          <p className="text-gray-500 text-sm md:text-base leading-relaxed">
            {description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {cards.map((card, idx) => (
            <div key={idx} className="flex flex-col group">
              <div className="relative w-full aspect-[16/9] mb-6 rounded-2xl overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">
                {card.title}
              </h3>
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
