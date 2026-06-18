'use client';

import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';
import { MotionSection } from '@/components/animations/MotionSection';

interface MissionVisionItem {
  title?: string;
  description?: string;
  image?: string;
  subItems?: string[];
}

interface AboutUsMissionVisionContent {
  items?: MissionVisionItem[];
}

interface AboutUsMissionVisionProps {
  content?: AboutUsMissionVisionContent;
}

const defaultItems: MissionVisionItem[] = [
  {
    title: 'Our Mission',
    description:
      'To provide world-class software solutions and services to our clients, enabling them to achieve their business goals. We strive to build long-term relationships with our clients based on trust, integrity, and mutual respect.',
    image: '/about-us/mission.png',
    subItems: [
      'Focus on delivering measurable business value',
      'Commitment to continuous innovation and quality',
      'Customer-centric approach to software development',
    ],
  },
  {
    title: 'Our Vision',
    description:
      'To be a leading global IT solutions provider, recognized for our technical excellence, customer centricity, and commitment to quality. We aim to empower businesses with innovative technology solutions that drive growth and efficiency.',
    image: '/about-us/vission.png',
    subItems: [
      'Leadership through technological excellence',
      'Foster a culture of collaboration and continuous learning',
      'Partner with clients to drive sustainable business growth',
    ],
  },
];

export function AboutUsMissionVision({
  content,
}: AboutUsMissionVisionProps) {
  const items = content?.items || defaultItems;

  return (
    <section className="py-8 md:py-24 bg-[#EEF3F8]">
      <div className="container mx-auto max-w-7xl px-4">

        <div className="space-y-10">
          {items.map((item, index) => {
            const imageSrc = item.image || '/about-us/mission.png';

            return (
              <MotionSection
                key={index}
                variant="fadeUp"
                delay={index * 0.1}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex flex-col md:flex-row items-center py-6 md:px-0 px-6">
                  {/* Left Image */}
                  <div className="flex items-center basis-1/3 justify-center">
                    <Image
                      src={imageSrc}
                      alt={item.title || ''}
                      width={200}
                      height={200}
                      className="w-70 h-auto"
                    />
                  </div>

                  {/* Right Content */}
                  <div className='basis-2/3'>
                    <h3 className="text-3xl font-bold text-black mb-2">
                      {item.title}
                    </h3>

                    <p className="text-[#71717A] leading-8 text-base">
                      {item.description}
                    </p>

                    {item.subItems && item.subItems.length > 0 && (
                      <div className="space-y-2 mt-2">
                        {item.subItems.map((subItem, idx) => (
                          <div
                            key={idx}
                            className="flex items-start gap-4"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 flex-shrink-0">
                              <CheckCircle2 className="h-4 w-4 text-amber-600" />
                            </div>

                            <span className="text-black font-medium leading-7">
                              {subItem}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </MotionSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}