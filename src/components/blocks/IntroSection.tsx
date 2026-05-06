'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection } from '@/components/animations/MotionSection';

export function IntroSection() {
  return (
    <section className="py-20 md:py-32 bg-[#F8F9FA] text-center border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="max-w-[1000px] mx-auto">
        <TextReveal 
          as="h2"
          text="We help organizations run, scale, and transform with digital solutions built for real business needs."
          className="text-3xl md:text-4xl lg:text-[42px] leading-[1.25] font-medium text-slate-900 tracking-tight justify-center"
        />
        
        <MotionSection variant="fadeUp" delay={0.4}>
          <h3 className="mt-6 text-xl md:text-2xl lg:text-[26px] font-light text-slate-400 tracking-wide">
            Smarter Operations <span className="mx-2 text-slate-200">|</span> AI-driven Growth <span className="mx-2 text-slate-200">|</span> Stronger Solutions
          </h3>
        </MotionSection>

        <MotionSection variant="fadeUp" delay={0.6} className="mt-12">
          <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-12 h-[54px] text-[16px] font-semibold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(75,42,99,0.3)] hover:-translate-y-1 active:scale-95 cursor-pointer">
            Explore More
          </Button>
        </MotionSection>
        </div>
      </div>
    </section>
  );
}
