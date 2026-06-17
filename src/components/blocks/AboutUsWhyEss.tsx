'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/MotionSection';

interface TrustCard {
  image?: string;
  title?: string;
  description?: string;
}

interface AboutUsWhyEssContent {
  title?: string;
  description?: string;
  items?: TrustCard[];
}

interface AboutUsWhyEssProps {
  content?: AboutUsWhyEssContent;
}

const defaultTrustCards: TrustCard[] = [
  {
    image: '/about-us/business-first.png',
    title: 'Business-First Implementation',
    description:
      'We work closely with your teams to understand operational challenges, workflows, and business goals before implementing any solution. Every system is designed around your actual business needs.',
  },
  {
    image: '/about-us/faster-deployment.png',
    title: 'Faster Deployment, Faster Results',
    description:
      'Our ready-to-use ERP and BI frameworks help reduce implementation time and complexity, enabling quicker visibility, faster adoption, and improved return on investment.',
  },
  {
    image: '/about-us/global-entrprise.png',
    title: 'Global Expertise with Local Support',
    description:
      'With operations across multiple regions, we combine local support with international implementation experience to deliver reliable and scalable solutions.',
  },
  {
    image: '/about-us/growing-bussiness.png',
    title: 'Designed for Growing Businesses',
    description:
      'Our solutions are practical, scalable, and cost-effective, making them ideal for small and mid-sized organizations looking to streamline operations and accelerate growth.',
  },
  {
    image: '/about-us/technology-ecosystem.png',
    title: 'End-to-End Technology Ecosystem',
    description:
      'From ERP and Business Intelligence to RPA, mobile apps, and custom software, we deliver fully integrated solutions that work together as one connected ecosystem.',
  },
  {
    image: '/about-us/trusted-industries.png',
    title: 'Trusted Across Industries',
    description:
      'With experience across 25+ industry verticals, we understand unique business processes, operational challenges, and industry-specific requirements.',
  },
];

export function AboutUsWhyEss({ content }: AboutUsWhyEssProps) {
  const title = content?.title || 'Why Businesses Trust ESS';

  const description =
    content?.description ||
    'Delivering practical, scalable, and business-focused digital solutions that help organizations improve operations, accelerate growth, and achieve long-term success.';

  const trustCards = content?.items || defaultTrustCards;

  return (
    <section className="py-8 md:py-24 bg-[#EBF5FF]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="max-w-3xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-5xl font-bold text-[#0E1D4D] leading-tight">
            {title}
          </h2>

          <p className="text-base md:text-lg text-[#26345D] leading-relaxed">
            {description}
          </p>
        </div>

        {/* Cards */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {trustCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6 },
                },
              }}
              className="border border-[#B8C3D8] text-start rounded-[28px] px-4 py-6 bg-transparent flex items-center flex-col"
            >
              {/* Image */}
              <div className="mb-4 w-full flex items-start">
                <Image
                  src={card.image || '/about-us/business-first.png'}
                  alt={card.title || ''}
                  width={72}
                  height={72}
                  className="object-contain"
                />
              </div>
              <div className='flex w-full items-start flex-col'>
                {/* Title */}
                <h3 className="text-[20px] md:text-[22px] font-bold text-[#13224D] mb-2 leading-snug">
                  {card.title}
                </h3>

                {/* Description */}
                <p className="text-base line-clamp-5 text-[#26345D]">
                  {card.description}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}