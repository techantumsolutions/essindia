'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection } from '@/components/animations/MotionSection';

import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface HeroCta {
  label: string;
  url: string;
  formType?: string;
}

interface HeroContent {
  title?: string;
  subtitle?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  image?: string;
}

interface HeroSectionProps {
  content?: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  // Use content from CMS or fall back to defaults
  const title = content?.title || "The Digital Transformation Partner For Future-Ready Enterprises.";
  const subtitle = content?.subtitle || "With proven expertise across 25+ industries over the last 35+ years. Helping businesses streamline operations, grow, and stay ahead in the AI-driven world.";
  const primaryCta = content?.primaryCta || { label: "Book Free Demo", url: "/demo" };
  const secondaryCta = content?.secondaryCta || { label: "View Solutions", url: "/solutions" };
  const image = content?.image || "/hero-right.png";

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(primaryCta.url, primaryCta.formType as CtaFormType);
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(secondaryCta.url, secondaryCta.formType as CtaFormType);

  return (
    <section className="relative min-h-[80vh] flex items-center pt-40 pb-16 overflow-hidden bg-white border-b border-gray-200">
      {/* Background Dotted Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-20" 
        style={{
          backgroundImage: 'radial-gradient(#4B2A63 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />
      
      {/* Animated Background Glow */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ 
          duration: 15, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute top-1/4 -right-20 w-[600px] h-[600px] bg-purple-200/40 rounded-full blur-[120px] z-0"
      />
      <motion.div 
        animate={{ 
          scale: [1.2, 1, 1.2],
          x: [0, -30, 0],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ 
          duration: 12, 
          repeat: Infinity,
          ease: "linear"
        }}
        className="absolute bottom-1/4 -left-20 w-[500px] h-[500px] bg-blue-100/30 rounded-full blur-[100px] z-0"
      />

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-8">
          
          {/* Left Content */}
          <div className="w-full lg:w-1/2 max-w-2xl">
            <TextReveal 
              as="h1"
              text={title}
              className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] text-[#4B2A63] tracking-tighter"
            />
            
            <MotionSection variant="fadeUp" delay={0.4}>
              <p className="mt-6 text-[18px] leading-relaxed text-slate-600 max-w-lg">
                {subtitle}
              </p>
              
              <div className="mt-10 flex flex-wrap gap-4">
                <Button 
                  className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-14 text-[16px] font-semibold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(75,42,99,0.3)] hover:-translate-y-1 active:scale-95 cursor-pointer"
                  onClick={handlePrimaryClick}
                >
                  {primaryCta.label}
                </Button>
                <Button 
                  variant="outline" 
                  className="rounded-full px-10 h-14 text-[16px] font-semibold border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all duration-300 active:scale-95 cursor-pointer"
                  onClick={handleSecondaryClick}
                >
                  {secondaryCta.label}
                </Button>
              </div>
            </MotionSection>
          </div>
          
          {/* Right Content - Dashboard Composition */}
          <div className="w-full lg:w-1/2 relative h-[450px] md:h-[600px] flex items-center justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
              className="relative w-full h-full flex items-center justify-center"
            >
              {/* Floating Animation */}
              <motion.div
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src={image} 
                  alt="Platform Dashboard Features" 
                  className="w-full h-auto max-w-[650px] object-contain drop-shadow-[0_32px_64px_rgba(0,0,0,0.12)]" 
                />
              </motion.div>
              
              {/* Decorative Elements */}
              <motion.div 
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-10 -right-10 w-48 h-48 bg-gradient-to-br from-purple-100 to-transparent rounded-full blur-3xl opacity-60"
              />
              <motion.div 
                animate={{ rotate: -360, scale: [1, 1.2, 1] }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-20 -left-10 w-56 h-56 bg-gradient-to-tr from-blue-50 to-transparent rounded-full blur-3xl opacity-40"
              />
            </motion.div>
          </div>
        </div>
      </div>
      {primaryModal}
      {secondaryModal}
    </section>
  );
}
