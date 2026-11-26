'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection } from '@/components/animations/MotionSection';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface IntroContent {
  heading?: string;
  headingColor?: string;
  subheading?: string;
  buttonText?: string;
  buttonBgColor?: string;
  buttonHoverBgColor?: string;
  buttonTextColor?: string;
  buttonHoverTextColor?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  pdfUrl?: string;
  cta?: { label?: string; url?: string; formType?: string; pdfUrl?: string };
}

interface IntroSectionProps {
  content?: IntroContent;
}

export function IntroSection({ content }: IntroSectionProps) {
  const [isHovered, setIsHovered] = useState(false);

  const heading = content?.heading || "We help organizations run, scale, and transform with digital solutions built for real business needs.";
  const subheading = content?.subheading || "Smarter Operations | AI-driven Growth | Stronger Solutions";
  
  const label = content?.buttonText || content?.cta?.label || "Explore More";
  const url = content?.buttonUrl || content?.cta?.url || "/about";
  const formType = (content?.buttonFormType || content?.cta?.formType || '') as CtaFormType;
  const pdfUrl = content?.pdfUrl || content?.cta?.pdfUrl;

  const buttonBgColor = content?.buttonBgColor || '#4B2A63';
  const buttonHoverBgColor = content?.buttonHoverBgColor || '#3B198F';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonHoverTextColor = content?.buttonHoverTextColor;

  const { handleClick, modalNode } = useCtaAction(url, formType, pdfUrl);

  return (
    <section className="py-14 bg-[#F8F9FA] text-center border-y border-slate-100 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="max-w-[1000px] mx-auto">
        <TextReveal 
          as="h2"
          text={heading}
          className="text-3xl md:text-4xl lg:text-[42px] leading-[1.25] font-medium text-slate-900 tracking-tight justify-center"
          style={content?.headingColor ? { color: content.headingColor } : undefined}
        />
        
        <MotionSection variant="fadeUp" delay={0.4}>
          <h3 className="mt-6 text-xl md:text-2xl lg:text-[26px] font-light text-slate-400 tracking-wide">
            {subheading}
          </h3>
        </MotionSection>

        {label && (
          <MotionSection variant="fadeUp" delay={0.6} className="mt-12">
            <Button 
              onClick={handleClick}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{
                backgroundColor: isHovered && buttonHoverBgColor ? buttonHoverBgColor : buttonBgColor,
                color: isHovered && buttonHoverTextColor ? buttonHoverTextColor : buttonTextColor,
              }}
              className="rounded-full px-12 h-[54px] text-[16px] font-semibold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(75,42,99,0.3)] hover:-translate-y-1 active:scale-95 cursor-pointer border-none"
            >
              {label}
            </Button>
          </MotionSection>
        )}
        </div>
      </div>
      {modalNode}
    </section>
  );
}
