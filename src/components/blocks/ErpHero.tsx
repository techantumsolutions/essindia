'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection } from '@/components/animations/MotionSection';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { getHeroBackgroundStyles } from '@/lib/utils';
import { HeroTitle } from '@/components/ui/HeroTitle';

interface ErpHeroContent {
  bgColor?: string;
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  badgeBgColor?: string;
  badgeText?: string;
  badgeColor?: string;
  titleText?: string;
  titleColor?: string;
  titleSecondaryColor?: string;
  highlightedWordIndices?: number[];
  descriptionText?: string;
  descriptionColor?: string;
  button1Text?: string;
  button1Color?: string;
  button1BgColor?: string;
  button1HoverBgColor?: string;
  button1HoverTextColor?: string;
  button1Url?: string;
  button1FormType?: string;
  button2Text?: string;
  button2Color?: string;
  button2BgColor?: string;
  button2HoverBgColor?: string;
  button2HoverTextColor?: string;
  button2Url?: string;
  button2FormType?: string;
  image?: string;
}

interface ErpHeroProps {
  content?: ErpHeroContent;
}

export function ErpHero({ content }: ErpHeroProps) {
  const [isBtn1Hovered, setIsBtn1Hovered] = React.useState(false);
  const [isBtn2Hovered, setIsBtn2Hovered] = React.useState(false);

  const heroBgStyle = getHeroBackgroundStyles(content, { backgroundColor: content?.bgColor || '#fdfeff' });
  const badgeBgColor = content?.badgeBgColor || '#391781';
  const badgeText = content?.badgeText || 'ERP Overview';
  const badgeColor = content?.badgeColor || '#ffffff';
  const titleText = content?.titleText || "It's all about Streamline, Automate, and Accelerate for Business Fitness";
  const titleColor = content?.titleColor || '#000000';
  const titleSecondaryColor = content?.titleSecondaryColor || '#462294';
  const descriptionText = content?.descriptionText || 'Simply connect business processes, increase agility with our user-friendly and result-oriented software';
  const descriptionColor = content?.descriptionColor || '#000000';

  const button1Text = content?.button1Text || 'RPA PORTAL';
  const button1Color = content?.button1Color || '#ffffff';
  const button1HoverTextColor = content?.button1HoverTextColor;
  const button1BgColor = content?.button1BgColor || '#462294';
  const button1HoverBgColor = content?.button1HoverBgColor;
  const button1Url = content?.button1Url || '/rpa';
  const button1FormType = (content?.button1FormType || '') as CtaFormType;

  const button2Text = content?.button2Text || 'ERP OFFERINGS';
  const button2Color = content?.button2Color || '#ffffff';
  const button2HoverTextColor = content?.button2HoverTextColor;
  const button2BgColor = content?.button2BgColor || '#0f172a';
  const button2HoverBgColor = content?.button2HoverBgColor;
  const button2Url = content?.button2Url || '/erp-offerings';
  const button2FormType = (content?.button2FormType || '') as CtaFormType;
  const image = content?.image || '/BANNER-IMMAGE-LEFT.png';

  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType);
  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType);
  const highlightedWordIndices = Array.isArray(content?.highlightedWordIndices)
    ? content.highlightedWordIndices
    : [3, 4, 6];

  const highlightTitle = (text: string) => {
    const words = text.split(/\s+/).filter(Boolean);
    return words.map((word, idx) => {
      const isHighlight = highlightedWordIndices.includes(idx);
      return (
        <span
          key={idx}
          style={{ color: isHighlight ? titleSecondaryColor : undefined }}
        >
          {word}{' '}
        </span>
      );
    });
  };

  return (
    <section className="relative w-full min-h-[80vh] flex items-center py-14 overflow-hidden" style={heroBgStyle}>
      {/* Background Grid Pattern */}
      {/* <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-60 -z-10" /> */}

      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

          {/* Left Column - Content */}
          <div className="lg:col-span-6 space-y-2 text-left">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block pb-6"
            >
              <span className="inline-block max-w-full text-sm font-semibold px-5 py-3.5 rounded-full leading-snug break-words text-left" style={{ backgroundColor: badgeBgColor, color: badgeColor }}>
                {badgeText}
              </span>
            </motion.div>

            {/* Main Title */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {((content as any)?.titleGradientFrom || (content as any)?.titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
                <HeroTitle
                  as="h1"
                  title={titleText}
                  gradientFrom={(content as any)?.titleGradientFrom}
                  gradientTo={(content as any)?.titleGradientTo}
                  enableAnimation={(content as any)?.enableTitleGradientAnimation}
                  className="text-4xl sm:text-[46px] font-bold leading-[1.12] tracking-tight pb-6 text-left"
                />
              ) : (
                <h1 className="text-4xl sm:text-[46px] font-bold leading-[1.12] tracking-tight pb-6" style={{ color: titleColor }}>
                  {highlightTitle(titleText)}
                </h1>
              )}
            </motion.div>

            {/* Sub-headline */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-base sm:text-lg font-light leading-relaxed max-w-xl mb-8"
              style={{ color: descriptionColor }}
            >
              {descriptionText}
            </motion.p>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button
                onClick={handleBtn1Click}
                onMouseEnter={() => setIsBtn1Hovered(true)}
                onMouseLeave={() => setIsBtn1Hovered(false)}
                style={{
                  backgroundColor: isBtn1Hovered && button1HoverBgColor ? button1HoverBgColor : button1BgColor,
                  color: isBtn1Hovered && button1HoverTextColor ? button1HoverTextColor : button1Color,
                }}
                className={`border-transparent ${button1HoverBgColor ? '' : 'hover:opacity-90 hover:border-black'} rounded-full px-6 py-3 h-auto text-sm font-bold shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 cursor-pointer min-w-[140px]`}
              >
                {button1Text}
              </Button>
              <Button
                variant="outline"
                onClick={handleBtn2Click}
                onMouseEnter={() => setIsBtn2Hovered(true)}
                onMouseLeave={() => setIsBtn2Hovered(false)}
                style={{
                  backgroundColor: isBtn2Hovered && button2HoverBgColor ? button2HoverBgColor : button2BgColor,
                  color: isBtn2Hovered && button2HoverTextColor ? button2HoverTextColor : button2Color,
                  borderColor: isBtn2Hovered && button2HoverBgColor ? button2HoverBgColor : button2BgColor,
                }}
                className={`rounded-full px-6 py-3 h-auto text-sm font-bold shadow-md transition-all duration-300 active:scale-95 cursor-pointer min-w-[140px] ${
                  button2HoverBgColor ? '' : 'hover:opacity-90'
                }`}
              >
                {button2Text}
              </Button>
            </motion.div>
          </div>

          {/* Right Column - ERP Preview Image */}
          <div className="lg:col-span-6 w-full flex justify-center lg:justify-end">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            >
              {/* ERP Image */}
              <motion.div
                animate={{ y: [0, -12, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="w-full h-full"
              >
                <img
                  src={image}
                  alt="ERP Dashboard"
                  className="w-full h-full object-contain"
                />
              </motion.div>
            </motion.div>
          </div>

        </div>
      </div>
      {modal1}
      {modal2}
    </section>
  );
}
