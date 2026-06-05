'use client';

import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';

interface StatItem {
  title?: string;
  description?: string;
}

interface AboutUsHeroContent {
  title?: string;
  subtitle?: string; // used for the badge
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: StatItem[];
}

interface AboutUsHeroProps {
  content?: AboutUsHeroContent;
}

const defaultStats: StatItem[] = [
  { title: '30+', description: 'Years Experience' },
  { title: '25+', description: 'Industry Verticals' },
  { title: '1000+', description: 'Global Customers' },
  { title: 'SOC 2', description: 'Compliance' },
];

export function AboutUsHero({ content }: AboutUsHeroProps) {
  const title = content?.title || "Empowering Global Enterprises Through Digital Excellence";
  const badge = content?.subtitle || "Our Legacy & Future";
  const description = content?.description || "At Eastern Software Solutions, we build technology solutions that drive transformation, create long-term value, and shape the future of business.";
  const stats = content?.items || defaultStats;

  return (
    <section className="relative min-h-[50vh] flex flex-col justify-between pt-30 pb-8 md:pb-30 overflow-hidden bg-gradient-to-b from-[#1C2D4E] to-[#111B2D] text-white">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/about-us/banner.png')" }}
      />
      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl flex-grow flex flex-col justify-center items-center text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-400/20 bg-white text-blue-900 text-xs md:text-sm font-medium tracking-wide mb-8 capitalize"
        >
          {badge}
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-tight max-w-3xl leading-[1.15] mb-6"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xs md:text-base text-white max-w-xl font-light leading-6 mb-16"
        >
          {description}
        </motion.p>

        {/* Statistics Grid */}
        <MotionSection variant="fadeUp" delay={0.3} className="w-full">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="bg-white text-slate-800 rounded-2xl px-4 md:px-8 py-4 shadow-[0_20px_40px_rgba(0,0,0,0.05)] border border-slate-100/10 flex flex-col justify-center items-center"
              >
                <span className="text-2xl md:text-3xl font-extrabold text-[#1C2D4E] tracking-tight mb-2">
                  {stat.title}
                </span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider text-center">
                  {stat.description}
                </span>
              </motion.div>
            ))}
          </div>
        </MotionSection>

      </div>
    </section>
  );
}
