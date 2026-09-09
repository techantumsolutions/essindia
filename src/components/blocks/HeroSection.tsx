'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection } from '@/components/animations/MotionSection';

import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { getHeroBackgroundStyles } from '@/lib/utils';

import { HeroTitle } from '@/components/ui/HeroTitle';

interface HeroCta {
  label?: string;
  url?: string;
  formType?: string;
  pdfUrl?: string;
}

interface HeroContent {
  title?: string;
  titleColor?: string;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  subtitle?: string;
  subtitleColor?: string;
  primaryCta?: HeroCta;
  secondaryCta?: HeroCta;
  primaryButtonBgColor?: string;
  primaryButtonHoverBgColor?: string;
  primaryButtonBorderColor?: string;
  primaryButtonText?: string;
  primaryButtonTextColor?: string;
  primaryButtonHoverTextColor?: string;
  primaryButtonUrl?: string;
  primaryButtonFormType?: string;
  primaryButtonPdfUrl?: string;
  secondaryButtonBgColor?: string;
  secondaryButtonHoverBgColor?: string;
  secondaryButtonBorderColor?: string;
  secondaryButtonText?: string;
  secondaryButtonTextColor?: string;
  secondaryButtonHoverTextColor?: string;
  secondaryButtonUrl?: string;
  secondaryButtonFormType?: string;
  secondaryButtonPdfUrl?: string;
  image?: string;
  bgColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
}

interface HeroSectionProps {
  content?: HeroContent;
}

export function HeroSection({ content }: HeroSectionProps) {
  const [isPrimaryHovered, setIsPrimaryHovered] = useState(false);
  const [isSecondaryHovered, setIsSecondaryHovered] = useState(false);

  // Fallbacks supporting both legacy primaryCta/secondaryCta objects and explicit single-field keys
  const title = content?.title || "The Digital Transformation Partner For Future-Ready Enterprises.";
  const titleColor = content?.titleColor || '#4B2A63';
  const titleGradientFrom = content?.titleGradientFrom;
  const titleGradientTo = content?.titleGradientTo;
  const subtitle = content?.subtitle || "With proven expertise across 25+ industries over the last 35+ years. Helping businesses streamline operations, grow, and stay ahead in the AI-driven world.";
  const subtitleColor = content?.subtitleColor || '#475569';

  const primaryBtnText = content?.primaryButtonText || content?.primaryCta?.label || "Book Free Demo";
  const primaryBtnUrl = content?.primaryButtonUrl || content?.primaryCta?.url || "/demo";
  const primaryBtnFormType = (content?.primaryButtonFormType || content?.primaryCta?.formType || '') as CtaFormType;
  const primaryBtnPdfUrl = content?.primaryButtonPdfUrl || content?.primaryCta?.pdfUrl;
  const primaryBtnBgColor = content?.primaryButtonBgColor || '#4B2A63';
  const primaryBtnHoverBgColor = content?.primaryButtonHoverBgColor || '#3B198F';
  const primaryBtnBorderColor = content?.primaryButtonBorderColor || 'transparent';
  const primaryBtnTextColor = content?.primaryButtonTextColor || '#ffffff';
  const primaryBtnHoverTextColor = content?.primaryButtonHoverTextColor;

  const secondaryBtnText = content?.secondaryButtonText || content?.secondaryCta?.label || "View Solutions";
  const secondaryBtnUrl = content?.secondaryButtonUrl || content?.secondaryCta?.url || "/solutions";
  const secondaryBtnFormType = (content?.secondaryButtonFormType || content?.secondaryCta?.formType || '') as CtaFormType;
  const secondaryBtnPdfUrl = content?.secondaryButtonPdfUrl || content?.secondaryCta?.pdfUrl;
  const secondaryBtnBgColor = content?.secondaryButtonBgColor || 'transparent';
  const secondaryBtnHoverBgColor = content?.secondaryButtonHoverBgColor || '#f8fafc';
  const secondaryBtnBorderColor = content?.secondaryButtonBorderColor || '#e2e8f0';
  const secondaryBtnTextColor = content?.secondaryButtonTextColor || '#0f172a';
  const secondaryBtnHoverTextColor = content?.secondaryButtonHoverTextColor;

  const image = content?.image || "/hero-right.png";

  const { handleClick: handlePrimaryClick, modalNode: primaryModal } = useCtaAction(primaryBtnUrl, primaryBtnFormType, primaryBtnPdfUrl);
  const { handleClick: handleSecondaryClick, modalNode: secondaryModal } = useCtaAction(secondaryBtnUrl, secondaryBtnFormType, secondaryBtnPdfUrl);

  const hasBg = content?.bgColor || content?.gradientColor1 || content?.gradientColor2 || content?.gradientColor3;
  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, content?.bgColor ? { backgroundColor: content.bgColor } : undefined);

  return (
    <section
      className="relative min-h-[60vh] flex items-center py-10 md:py-0 overflow-hidden bg-white border-b border-gray-200"
      style={hasBg ? bgStyles : undefined}
    >
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
            {(titleGradientFrom || titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
              <HeroTitle
                as="h1"
                title={title}
                gradientFrom={titleGradientFrom}
                gradientTo={titleGradientTo}
                enableAnimation={(content as any)?.enableTitleGradientAnimation}
                className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] tracking-tighter"
              />
            ) : (
              <TextReveal
                as="h1"
                text={title}
                style={{ color: titleColor }}
                className="text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] tracking-tighter"
              />
            )}

            <MotionSection variant="fadeUp" delay={0.4}>
              <p className="mt-6 text-[18px] leading-relaxed max-w-lg" style={{ color: subtitleColor }}>
                {subtitle}
              </p>

              <div className="mt-10 flex flex-wrap gap-4">
                {primaryBtnText && (
                  <Button
                    style={{
                      backgroundColor: isPrimaryHovered && primaryBtnHoverBgColor ? primaryBtnHoverBgColor : primaryBtnBgColor,
                      color: isPrimaryHovered && primaryBtnHoverTextColor ? primaryBtnHoverTextColor : primaryBtnTextColor,
                      borderColor: primaryBtnBorderColor,
                    }}
                    onMouseEnter={() => setIsPrimaryHovered(true)}
                    onMouseLeave={() => setIsPrimaryHovered(false)}
                    className="rounded-full px-10 h-14 text-[16px] font-semibold transition-all duration-300 hover:shadow-[0_20px_40px_-10px_rgba(75,42,99,0.3)] hover:-translate-y-1 active:scale-95 cursor-pointer border"
                    onClick={handlePrimaryClick}
                  >
                    {primaryBtnText}
                  </Button>
                )}
                {secondaryBtnText && (
                  <Button
                    variant="outline"
                    style={{
                      backgroundColor: isSecondaryHovered && secondaryBtnHoverBgColor ? secondaryBtnHoverBgColor : secondaryBtnBgColor,
                      color: isSecondaryHovered && secondaryBtnHoverTextColor ? secondaryBtnHoverTextColor : secondaryBtnTextColor,
                      borderColor: secondaryBtnBorderColor,
                    }}
                    onMouseEnter={() => setIsSecondaryHovered(true)}
                    onMouseLeave={() => setIsSecondaryHovered(false)}
                    className="rounded-full px-10 h-14 text-[16px] font-semibold transition-all duration-300 active:scale-95 cursor-pointer border"
                    onClick={handleSecondaryClick}
                  >
                    {secondaryBtnText}
                  </Button>
                )}
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
