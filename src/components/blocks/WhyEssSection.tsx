'use client';

import { motion } from 'framer-motion';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';

interface Reason {
  title: string;
  description: string;
}

interface WhyEssContent {
  heading?: string;
  subheading?: string;
  reasons?: Reason[];
}

interface WhyEssSectionProps {
  content?: WhyEssContent;
}

const defaultReasons = [
  {
    title: 'INDUSTRY EXPERTS',
    description: 'We bring deep knowledge of how industries work, so every solution fit actual operations.',
  },
  {
    title: 'AI-DRIVEN TRANSFORMATION',
    description: 'We support businesses with intelligent solutions to adapt, scale, and stay ready for what comes next.',
  },
  {
    title: 'OUTCOME- FOCUSED APPROACH',
    description: "We don't just implement technology; we deliver proven results.",
  },
  {
    title: 'GLOBAL REACH',
    description: 'We bring experience across geographies and adapt it to your business needs.',
  },
];

export function WhyEssSection({ content }: WhyEssSectionProps) {
  const heading = content?.heading || "Why ESS?";
  const subheading = content?.subheading || "We pioneer groundbreaking innovations while our competitors struggle to keep pace.";
  const reasons = content?.reasons || defaultReasons;

  return (
    <section className="py-24 bg-[#F8F9FA] overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <TextReveal 
            as="h2"
            text={heading}
            className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight justify-center"
          />
          <MotionSection variant="fadeUp" delay={0.4}>
            <p className="text-lg md:text-xl text-slate-500 leading-relaxed font-light">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Content Split */}
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-8 items-center lg:items-stretch">
          
          {/* Left Side - Image Composition */}
          <div className="w-full lg:w-1/2 relative flex justify-center mt-10 lg:mt-0">
            <MotionSection variant="scaleIn" className="relative w-full max-w-[500px]">
              {/* Main Background Hand/UI Image */}
              <motion.img 
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                src="/why-ess-main.png" 
                alt="ESS Platform Interface" 
                className="w-full h-auto rounded-[32px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.15)] object-cover"
              />
              
              {/* Floating Revenue Card */}
              <motion.div 
                initial={{ opacity: 0, x: -50, y: 20 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
                animate={{ y: [0, -15, 0] }}
                viewport={{ once: true }}
                className="absolute -left-10 md:-left-16 -bottom-12 md:-bottom-20 w-[200px] md:w-[240px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-10 bg-white"
              >
                <img src="/why-ess-revenue.png" alt="Revenue Chart" className="w-full h-auto" />
              </motion.div>

              {/* Floating Statistics Card */}
              <motion.div 
                initial={{ opacity: 0, x: 50, y: 50 }}
                whileInView={{ opacity: 1, x: 0, y: 0 }}
                transition={{ duration: 1, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
                animate={{ y: [0, 15, 0] }}
                viewport={{ once: true }}
                className="absolute -right-8 md:-right-12 -bottom-8 md:-bottom-12 w-[180px] md:w-[220px] rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] z-10 bg-white"
              >
                <img src="/why-ess-stats.png" alt="Statistics Chart" className="w-full h-auto" />
              </motion.div>
            </MotionSection>
          </div>

          {/* Right Side - Cards List */}
          <StaggerContainer className="w-full lg:w-1/2 flex flex-col justify-center gap-6 lg:pl-16 mt-20 lg:mt-0">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                variants={{
                  initial: { opacity: 0, x: 50, filter: 'blur(10px)' },
                  animate: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ x: 10, transition: { duration: 0.3 } }}
                className="bg-white rounded-2xl p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-slate-100 hover:border-purple-200 transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#4B2A63] mt-2 group-hover:scale-150 transition-transform duration-300" />
                  <div>
                    <h3 className="text-lg font-bold text-[#4B2A63] mb-3 tracking-wide uppercase text-[15px]">
                      {reason.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed font-normal">
                      {reason.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </StaggerContainer>

        </div>
      </div>
    </section>
  );
}
