'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface RpaHeroContent {
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
  button1Text?: string;
  button1TextColor?: string;
  button1Url?: string;
  button1FormType?: string;
  button1PdfUrl?: string;
  button2BgColor?: string;
  button2BorderColor?: string;
  button2Text?: string;
  button2TextColor?: string;
  button2Url?: string;
  button2FormType?: string;
  button2PdfUrl?: string;
  image?: string;
}

export function RpaHero({ content }: { content?: RpaHeroContent }) {
  const bgColor = content?.bgColor || 'linear-gradient(135deg, #a2b6cb 0%, #6e849d 100%)';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#27256b';
  const badgeBorderColor = content?.badgeBorderColor || 'transparent';
  const badgeText = content?.badgeText || 'Robotic Process Automation';
  const title = content?.title || 'Robotic Process Automation Solutions';
  const titleColor = content?.titleColor || '#ffffff';
  const description = content?.description || 'ESS brings decades of business process improvement experience to help organizations identify automation opportunities, develop RPA workflows, and maintain a digital workforce that improves efficiency, accuracy, and long-term growth.';
  const descriptionColor = content?.descriptionColor || '#f1f5f9';

  const button1BgColor = content?.button1BgColor || '#27256b';
  const button1Text = content?.button1Text || 'Book your Demo';
  const button1TextColor = content?.button1TextColor || '#ffffff';
  const button1Url = content?.button1Url || '#';
  const button1FormType = (content?.button1FormType || '') as CtaFormType;

  const button2BgColor = content?.button2BgColor || '#ffffff';
  const button2BorderColor = content?.button2BorderColor || '#ffffff';
  const button2Text = content?.button2Text || 'Case studies';
  const button2TextColor = content?.button2TextColor || '#27256b';
  const button2Url = content?.button2Url || '#';
  const button2FormType = (content?.button2FormType || '') as CtaFormType;

  const image = content?.image || '/RPA-Robotic Process Automation (RPA)/de84036c921d93c37b98e83bda27549bc7ae4a96.png';

  const { handleClick: handleBtn1Click, modalNode: modal1 } = useCtaAction(button1Url, button1FormType, content?.button1PdfUrl);
  const { handleClick: handleBtn2Click, modalNode: modal2 } = useCtaAction(button2Url, button2FormType, content?.button2PdfUrl);

  const isGradient = bgColor.includes('gradient') || bgColor.includes('rgba') || bgColor.startsWith('linear') || bgColor.startsWith('radial');

  return (
    <section
      className="relative min-h-[80vh] flex items-center pt-40 pb-16 overflow-hidden font-sans border-b"
      style={isGradient ? { backgroundImage: bgColor } : { backgroundColor: bgColor }}
    >
      {/* Background Decorative Graphic Pattern */}
      <div className="absolute inset-0 opacity-5 mix-blend-overlay pointer-events-none bg-[radial-gradient(#fff_1.2px,transparent_1.2px)] [background-size:24px_24px]" />

      <div className="container mx-auto max-w-7xl px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Content column */}
          <div className="lg:col-span-6 space-y-6 text-left">

            {/* Pill Badge */}
            {badgeText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center"
              >
                <span
                  className="text-xs font-bold tracking-wider px-3.5 py-1.5 rounded-full border shadow-sm"
                  style={{
                    backgroundColor: badgeBgColor,
                    color: badgeTextColor,
                    borderColor: badgeBorderColor
                  }}
                >
                  {badgeText}
                </span>
              </motion.div>
            )}

            {/* Title */}
            {title && (
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-light tracking-tight leading-[1.1] mb-6 whitespace-pre-line"
                style={{ color: titleColor }}
              >
                {title}
              </motion.h1>
            )}

            {/* Description */}
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-base sm:text-lg leading-relaxed font-light mb-8 max-w-xl"
                style={{ color: descriptionColor }}
              >
                {description}
              </motion.p>
            )}

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="flex flex-wrap items-center gap-4"
            >
              {button1Text && (
                button1FormType ? (
                  <button
                    onClick={handleBtn1Click}
                    className="px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px] cursor-pointer"
                    style={{ backgroundColor: button1BgColor, color: button1TextColor }}
                  >
                    {button1Text}
                  </button>
                ) : (
                  <a
                    href={button1Url}
                    className="px-6 py-3 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px]"
                    style={{ backgroundColor: button1BgColor, color: button1TextColor }}
                  >
                    {button1Text}
                  </a>
                )
              )}
              {button2Text && (
                button2FormType ? (
                  <button
                    onClick={handleBtn2Click}
                    className="px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px] cursor-pointer"
                    style={{ backgroundColor: button2BgColor, color: button2TextColor, borderColor: button2BorderColor }}
                  >
                    {button2Text}
                  </button>
                ) : (
                  <a
                    href={button2Url}
                    className="px-6 py-3 rounded-full text-sm font-bold border shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 duration-200 block text-center min-w-[140px]"
                    style={{ backgroundColor: button2BgColor, color: button2TextColor, borderColor: button2BorderColor }}
                  >
                    {button2Text}
                  </a>
                )
              )}
            </motion.div>
          </div>

          {/* Right Column: Visual illustration */}
          <div className="lg:col-span-6 w-full relative flex justify-center">
            {image && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative w-full aspect-[4/3] max-w-[500px] rounded-2xl overflow-hidden shadow-2xl border border-white/10"
              >
                <Image
                  src={image}
                  alt={title || 'RPA Diagram'}
                  fill
                  priority
                  className="object-contain"
                />
              </motion.div>
            )}
          </div>

        </div>
      </div>
      {modal1}
      {modal2}
    </section>
  );
}
