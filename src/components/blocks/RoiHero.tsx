'use client';

import React from 'react';
import { getHeroBackgroundStyles } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { HeroTitle } from '@/components/ui/HeroTitle';

interface RoiHeroContent {
  gradientColor1?: string;
  gradientColor2?: string;
  gradientColor3?: string;
  bgColor?: string;
  badgeBgColor?: string;
  badgeBorderColor?: string;
  badgeText?: string;
  badgeTextColor?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  descriptionColor?: string;
  button1BgColor?: string;
  button1HoverBgColor?: string;
  button1BorderColor?: string;
  button1Text?: string;
  button1TextColor?: string;
  button1HoverTextColor?: string;
  button1Url?: string;
  button1FormType?: string;
  button1PdfUrl?: string;
  button2BgColor?: string;
  button2HoverBgColor?: string;
  button2BorderColor?: string;
  button2Text?: string;
  button2TextColor?: string;
  button2HoverTextColor?: string;
  button2Url?: string;
  button2FormType?: string;
  button2PdfUrl?: string;
  image?: string;
}

export function RoiHero({ content }: { content?: RoiHeroContent }) {
  const [isBtn1Hovered, setIsBtn1Hovered] = React.useState(false);
  const [isBtn2Hovered, setIsBtn2Hovered] = React.useState(false);

  const bgColor = content?.bgColor || '#13444f';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Return on Investment';
  const badgeTextColor = content?.badgeTextColor || '#2b2a6c';

  const title = content?.title || 'What is ROI and How to Calculate Return on Investment';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'In business world, decision-making is a complex task that requires precise and reliable information. One of the most commonly used metrics for short-term investment decision-making is the return on investment (ROI).';
  const descriptionColor = content?.descriptionColor || '#ffffff';

  const button1BgColor = content?.button1BgColor || '#ffffff';
  const button1HoverBgColor = content?.button1HoverBgColor;
  const button1BorderColor = content?.button1BorderColor || '#ffffff';
  const button1Text = content?.button1Text || 'Find an advisor';
  const button1TextColor = content?.button1TextColor || '#2b2a6c';
  const button1HoverTextColor = content?.button1HoverTextColor;
  const button1Url = content?.button1Url || '#';

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2HoverBgColor = content?.button2HoverBgColor;
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'ROI calculator';
  const button2TextColor = content?.button2TextColor || '#2b2a6c';
  const button2HoverTextColor = content?.button2HoverTextColor;
  const button2Url = content?.button2Url || '#';

  const button1FormType = (content?.button1FormType || '') as CtaFormType;
  const button2FormType = (content?.button2FormType || '') as CtaFormType;
  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType, content?.button1PdfUrl);
  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType, content?.button2PdfUrl);

  const rightImage = content?.image || '/ROI-calculator/banner-image.png';

  const bgStyles = getHeroBackgroundStyles({
    gradientColor1: content?.gradientColor1,
    gradientColor2: content?.gradientColor2,
    gradientColor3: content?.gradientColor3,
  }, { backgroundColor: bgColor });

  return (
    <section
      className="relative min-h-[80vh] flex items-center py-12 border-b border-t px-6 overflow-hidden text-white"
      style={bgStyles}
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 text-left space-y-6 lg:max-w-2xl"
          >
            {badgeText && (
              <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.4 }}
                className="inline-block px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider border"
                style={{
                  backgroundColor: badgeBgColor,
                  borderColor: badgeBorderColor,
                  color: badgeTextColor,
                }}
              >
                {badgeText}
              </motion.span>
            )}

            {((content as any)?.titleGradientFrom || (content as any)?.titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
              <HeroTitle
                as="h1"
                title={title}
                gradientFrom={(content as any)?.titleGradientFrom}
                gradientTo={(content as any)?.titleGradientTo}
                enableAnimation={(content as any)?.enableTitleGradientAnimation}
                className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line text-left"
              />
            ) : (
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line"
                style={{ color: titleColor }}
              >
                {title}
              </motion.h1>
            )}

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl opacity-90"
              style={{ color: descriptionColor }}
            >
              {description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              {button1Text && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={button1Url} onClick={button1FormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtn1Click(); } : undefined}
                    onMouseEnter={() => setIsBtn1Hovered(true)}
                    onMouseLeave={() => setIsBtn1Hovered(false)}
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-colors border text-center min-w-[140px] cursor-pointer"
                    style={{
                      backgroundColor: isBtn1Hovered && button1HoverBgColor ? button1HoverBgColor : button1BgColor,
                      borderColor: button1BorderColor,
                      color: isBtn1Hovered && button1HoverTextColor ? button1HoverTextColor : button1TextColor,
                    }}
                  >
                    {button1Text}
                  </Link>
                </motion.div>
              )}
              {button2Text && (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Link
                    href={button2Url} onClick={button2FormType ? (e: React.MouseEvent) => { e.preventDefault(); handleBtn2Click(); } : undefined}
                    onMouseEnter={() => setIsBtn2Hovered(true)}
                    onMouseLeave={() => setIsBtn2Hovered(false)}
                    className="inline-block px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-colors border text-center min-w-[140px] cursor-pointer"
                    style={{
                      backgroundColor: isBtn2Hovered && button2HoverBgColor ? button2HoverBgColor : button2BgColor,
                      borderColor: button2BorderColor,
                      color: isBtn2Hovered && button2HoverTextColor ? button2HoverTextColor : button2TextColor,
                    }}
                  >
                    {button2Text}
                  </Link>
                </motion.div>
              )}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 flex justify-center lg:justify-end w-full"
          >
            <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src={rightImage}
                alt={title}
                fill
                className="object-contain hover:scale-105 transition-transform duration-500"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>

      {modal1}
      {modal2}
    </section>
  );
}
