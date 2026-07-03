'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { StaggerContainer } from '@/components/animations/MotionSection';

interface ServiceItem {
  image?: string;
  title?: string;
  subtitle?: string;
}

interface AboutUsServicesOverviewContent {
  heading?: string;
  items?: ServiceItem[];
}

interface AboutUsServicesOverviewProps {
  content?: AboutUsServicesOverviewContent;
}

const defaultServices: ServiceItem[] = [
  {
    image: '/about-us/smartDecision.png',
    title: 'Smarter Decisions Through Data',
    subtitle: 'BUSINESS INTELLIGENCE (BI)',
  },
  {
    image: '/about-us/inteligentProcess.png',
    title: 'Intelligent Process Automation',
    subtitle: 'ROBOTIC PROCESS AUTOMATION (RPA)',
  },
  {
    image: '/about-us/enterpriseMobility.png',
    title: 'Enterprise Mobility Simplified',
    subtitle: 'MOBILE APPLICATIONS & CUSTOM APPS',
  },
];

export function AboutUsServicesOverview({
  content,
}: AboutUsServicesOverviewProps) {
  const heading = content?.heading || "Driving Enterprise Excellence Across Technologies";
  const services = content?.items || defaultServices;

  return (
    <section className="py-8 md:py-24 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Dynamic Heading */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-[48px] font-bold text-slate-900 tracking-tight leading-tight"
          >
            {heading}
          </motion.h2>
        </div>

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
                  src={service.image || '/about-us/smartDecision.png'}
                  alt={service.title || ''}
                  width={420}
                  height={340}
                  className="object-contain"
                  priority={index === 0}
                />
              </div>

              <div className="">
                {/* Category */}
                <span className="text-[#4A4E92] uppercase tracking-wide text-[15px] md:text-[16px] font-medium mb-4 block">
                  {service.subtitle}
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