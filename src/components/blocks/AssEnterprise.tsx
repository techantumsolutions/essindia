'use client';

import React from 'react';
import Image from 'next/image';

interface EnterpriseCard {
  icon?: string;
  title?: string;
  description?: string;
}

interface AssEnterpriseContent {
  title?: string;
  description?: string;
  image?: string;
  cards?: EnterpriseCard[];
}

const cardStyles = [
  { bg: 'bg-[#f5f0ff]/95', border: 'border-[#c084fc]/40', text: 'text-[#7c3aed]', iconBg: 'bg-[#f3e8ff]/80' }, // 0: Product (Purple)
  { bg: 'bg-[#fff8f0]/95', border: 'border-[#fb923c]/40', text: 'text-[#ea580c]', iconBg: 'bg-[#ffedd5]/80' }, // 1: Content (Orange)
  { bg: 'bg-[#f0fdf4]/95', border: 'border-[#4ade80]/40', text: 'text-[#16a34a]', iconBg: 'bg-[#dcfce7]/80' }, // 2: Field (Green)
  { bg: 'bg-[#fff0f6]/95', border: 'border-[#f472b6]/40', text: 'text-[#db2777]', iconBg: 'bg-[#fce7f3]/80' }, // 3: Brand (Pink)
  { bg: 'bg-[#f0f6ff]/95', border: 'border-[#60a5fa]/40', text: 'text-[#2563eb]', iconBg: 'bg-[#eff6ff]/80' }, // 4: PR (Blue)
  { bg: 'bg-[#f0fdfa]/95', border: 'border-[#2dd4bf]/40', text: 'text-[#0d9488]', iconBg: 'bg-[#ccfbf1]/80' }, // 5: Performance (Teal)
];

export function AssEnterprise({ content }: { content?: AssEnterpriseContent }) {
  const title = content?.title || 'Marketing runs on content.\nESS automates how it\'s made.';
  const description = content?.description || 'Solutions for every marketer';
  const image = content?.image || '/App-After Sales Service/ChatGPT Image Jun 17, 2026, 05_47_51 PM 1.png';
  const cards = content?.cards || [
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 1.png', title: 'Product Marketer', description: '' },
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 3.png', title: 'Content Marketer', description: '' },
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 6.png', title: 'Field Marketer', description: '' },
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 2.png', title: 'Brand Marketer', description: '' },
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 5.png', title: 'PR Marketer', description: '' },
    { icon: '/App-After Sales Service/a4460102-b4a2-4158-bb5e-45e56678a570 4.png', title: 'Performance Marketer', description: '' },
  ];

  const renderCard = (card: EnterpriseCard, idx: number) => {
    const style = cardStyles[idx % cardStyles.length] || cardStyles[0];
    return (
      <div className={`flex items-center gap-3 pl-2 pr-6 py-2 h-[52px] rounded-full border ${style.bg} ${style.border} shadow-[0_8px_20px_rgba(0,0,0,0.04)] transition-all hover:scale-105 hover:shadow-md duration-300`}>
        {card.icon && (
          <div className={`w-9 h-9 rounded-full ${style.iconBg} flex items-center justify-center shrink-0`}>
            <Image src={card.icon} alt="" width={22} height={22} className="object-contain" />
          </div>
        )}
        <div className="text-left">
          <h4 className={`text-[13px] font-bold ${style.text} tracking-wide whitespace-nowrap`}>{card.title}</h4>
        </div>
      </div>
    );
  };

  return (
    <section className="pt-14 pb-0 px-6 bg-[#F7F9F8] border-b">
      <div className="container mx-auto max-w-7xl">
        {/* Headings */}
        <div className="text-center mb-2">
          {description && (
            <span className="text-lg font-extrabold text-[#0a1128] tracking-wider mb-2 block">
              {description}
            </span>
          )}
          <h2 className="text-3xl md:text-4xl font-bold text-[#171C76] leading-tight whitespace-pre-line">
            {title}
          </h2>
        </div>

        {/* Desktop Layout */}
        <div className="hidden lg:block relative w-full max-w-[960px] aspect-[1000/684] mx-auto">
          {/* Central Image with decorations (circle, blocks, dots) already in it */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-[75%] h-[90%]">
              <Image
                src={image}
                alt="Solutions illustration"
                fill
                className="object-contain pointer-events-none"
                priority
              />
            </div>
          </div>

          {/* Floating Pill Cards positioned exactly relative to the background lines */}
          {/* Card 0: Product Marketer (Top Left) */}
          <div className="absolute top-[23%] left-[10%]">
            {cards[0] && renderCard(cards[0], 0)}
          </div>

          {/* Card 1: Content Marketer (Middle Left) */}
          <div className="absolute top-[50%] left-[2%] -translate-y-1/2">
            {cards[1] && renderCard(cards[1], 1)}
          </div>

          {/* Card 2: Field Marketer (Bottom Left) */}
          <div className="absolute bottom-[20%] left-[8%]">
            {cards[2] && renderCard(cards[2], 2)}
          </div>

          {/* Card 3: Brand Marketer (Top Right) */}
          <div className="absolute top-[23%] right-[10%]">
            {cards[3] && renderCard(cards[3], 3)}
          </div>

          {/* Card 4: PR Marketer (Middle Right) */}
          <div className="absolute top-[50%] right-[2%] -translate-y-1/2">
            {cards[4] && renderCard(cards[4], 4)}
          </div>

          {/* Card 5: Performance Marketer (Bottom Right) */}
          <div className="absolute bottom-[20%] right-[8%]">
            {cards[5] && renderCard(cards[5], 5)}
          </div>
        </div>

        {/* Mobile/Tablet Layout */}
        <div className="lg:hidden flex flex-col items-center gap-8">
          {/* Central Image */}
          <div className="relative w-full max-w-[420px] aspect-[1000/684]">
            <Image
              src={image}
              alt="Solutions illustration"
              fill
              className="object-contain"
            />
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-lg mx-auto">
            {cards.map((card, idx) => (
              <div key={idx} className="flex justify-center w-full">
                {renderCard(card, idx)}
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

