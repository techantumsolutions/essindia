'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/MotionSection';

interface ServiceItem {
  title?: string;
  description?: string;
  icon?: string;
}

interface AboutUsServicesOverviewContent {
  title?: string;
  subtitle?: string;
  items?: ServiceItem[];
}

interface AboutUsServicesOverviewProps {
  content?: AboutUsServicesOverviewContent;
}

const defaultServices: ServiceItem[] = [
  {
    title: 'Smarter Decisions Through Data',
    icon: 'data',
  },
  {
    title: 'Intelligent Process Automation',
    icon: 'automation',
  },
  {
    title: 'Enterprise Mobility Simplified',
    icon: 'mobility',
  },
];

export function AboutUsServicesOverview({
  content,
}: AboutUsServicesOverviewProps) {
  const services = content?.items || defaultServices;

  const getImage = (icon?: string) => {
    switch (icon) {
      case 'data':
        return '/about-us/smartDecision.png';

      case 'automation':
        return '/about-us/inteligentProcess.png';

      case 'mobility':
        return '/about-us/enterpriseMobility.png';

      default:
        return '/about-us/smartDecision.png';
    }
  };

  const getCategory = (icon?: string) => {
    switch (icon) {
      case 'data':
        return 'BUSINESS INTELLIGENCE (BI)';

      case 'automation':
        return 'ROBOTIC PROCESS AUTOMATION (RPA)';

      case 'mobility':
        return 'MOBILE APPLICATIONS & CUSTOM APPS';

      default:
        return '';
    }
  };

  return (
    <section className="py-8 md:py-24 border border-b border-gray-300 md:border-b-white">
      <div className="max-w-7xl mx-auto px-6">
        <StaggerContainer className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-10">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.8 },
                },
              }}
              className="flex flex-col justify-between items-center text-center"
            >
              {/* Image */}
              <div className="relative w-full flex justify-center items-center mb-10">
                <Image
                  src={getImage(service.icon)}
                  alt={service.title || ''}
                  width={320}
                  height={260}
                  className="object-contain"
                  priority={index === 0}
                />
              </div>

              <div className="">
                {/* Category */}
                <span className="text-[#4A4E92] uppercase tracking-wide text-[15px] md:text-[16px] font-medium mb-4">
                  {getCategory(service.icon)}
                </span>

                {/* Heading */}
                <h3 className="text-[32px] md:text-2xl leading-tight font-bold text-black max-w-md">
                  {service.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}