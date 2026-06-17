'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/MotionSection';

interface TransformItem {
  image?: string;
  title?: string;
  description?: string;
}

interface AboutUsTransformationContent {
  title?: string;
  items?: TransformItem[];
}

interface AboutUsTransformationSectionProps {
  content?: AboutUsTransformationContent;
}

const defaultItems: TransformItem[] = [
  {
    image: '/about-us/what-enable.png',
    title: 'WHAT IT ENABLES',
    description:
      'Eastern Software Solutions is a global leader specializing in the digital transformation of every facet of your organization. We combine deep domain expertise with matured building blocks and an entrepreneurial delivery model.',
  },
  {
    image: '/about-us/migration.png',
    title: 'WHAT IT ENABLES',
    description:
      'Migration to latest technology of Forms and DB Upgrade to latest APEX Technology.',
  },
  {
    image: '/about-us/why-matter.png',
    title: 'WHY IT MATTERS',
    description:
      'Legacy systems limit flexibility, increase dependency, and slow growth. D2K migration modernizes existing applications while preserving core business logic, data, and processes.',
  },
  {
    image: '/about-us/how-help.png',
    title: 'HOW IT HELPS',
    description:
      'Businesses achieve faster development, improved usability, simpler maintenance, and AI enabled future-ready platforms that support scaling and integration without the cost and risk of a complete rebuild.',
  },
];

export function AboutUsTransformationSection({
  content,
}: AboutUsTransformationSectionProps) {
  const title =
    content?.title || 'D2K Migration or Technology Upgradation Services';

  const items = content?.items || defaultItems;

  return (
    <section className="py-8 md:py-24">
      <div className="max-w-7xl mx-auto px-4">
        {/* Heading */}
        <div className="max-w-4xl mx-auto text-center mb-8 md:mb-20">
          <h2 className="text-3xl md:text-5xl font-bold text-[#24365C] leading-[1.1]">
            {title}
          </h2>
        </div>

        {/* Grid */}
        <StaggerContainer className="flex flex-wrap">
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                initial: {
                  opacity: 0,
                  y: 20,
                },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.7,
                  },
                },
              }}
              className="border border-[#E4E4E4] rounded-[20px] lg:basis-1/2"
            >
              <div className="flex flex-col md:flex-row gap-4 h-full p-2">
                {/* Image */}
                <div className="md:w-[240px] flex-shrink-0">
                  <Image
                    src={item.image || '/about-us/what-enable.png'}
                    alt={item.title || ''}
                    width={240}
                    height={240}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex items-center">
                  <div>
                    <h3 className="text-lg font-bold uppercase text-black">
                      {item.title}
                    </h3>

                    <p className="text-[#6B7280] text-base">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}