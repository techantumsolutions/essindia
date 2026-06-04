'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';

interface AboutUsCtaContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
}

interface AboutUsCtaProps {
  content?: AboutUsCtaContent;
}

export function AboutUsCta({ content }: AboutUsCtaProps) {
  const title = content?.title || "Schedule Your Free Demo";
  const subtitle = content?.subtitle || "Start Your Journey";
  const description = content?.description || "Get in touch with our solutions experts today to schedule a customized walkthrough of our enterprise systems and find out how we can help your business grow.";
  const buttonText = content?.buttonText || "Schedule Demo";
  const buttonLink = content?.buttonLink || "/demo";

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-1/2 left-10 -translate-y-1/2 w-72 h-72 bg-blue-100/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 right-10 -translate-y-1/2 w-72 h-72 bg-purple-100/50 rounded-full blur-3xl pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 md:px-8 max-w-4xl text-center">
        <MotionSection variant="fadeUp">
          {/* Badge */}
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-4">
            {subtitle}
          </span>

          {/* Heading */}
          <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            {title}
          </h2>

          {/* Description */}
          <p className="text-slate-600 max-w-2xl mx-auto leading-relaxed text-base md:text-lg font-light mb-10">
            {description}
          </p>

          {/* Button */}
          <motion.div 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="inline-block"
          >
            <Button
              onClick={() => window.location.href = buttonLink}
              className="bg-[#1C2D4E] hover:bg-[#111B2D] text-white font-semibold px-10 py-6 h-auto text-[16px] rounded-full shadow-[0_15px_30px_rgba(28,45,78,0.25)] hover:shadow-[0_20px_40px_rgba(28,45,78,0.35)] transition-all duration-300 cursor-pointer"
            >
              {buttonText}
            </Button>
          </motion.div>
        </MotionSection>
      </div>
    </section>
  );
}
