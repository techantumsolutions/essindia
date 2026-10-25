'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface PartnerLogo {
  image?: string;
  name?: string;
}

export interface RpaOverviewLogosContent {
  logos?: PartnerLogo[];
  autoScroll?: boolean;
}

export function RpaOverviewLogos({ content }: { content?: RpaOverviewLogosContent }) {
  const autoScroll = content?.autoScroll !== false;

  const defaultLogos: PartnerLogo[] = [
    { image: '/RPA-Robotic Process Automation (RPA)/image 58.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 59.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 60.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 61.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 62.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 63.png' }
  ];

  const rawLogos = content?.logos && content.logos.length > 0 ? content.logos : defaultLogos;
  const logos: PartnerLogo[] = rawLogos.map((item: any) => {
    if (typeof item === 'string') {
      return { image: item, name: '' };
    }
    return {
      image: item?.image || item?.url || item?.src || item?.logo || '',
      name: item?.name || item?.alt || item?.title || ''
    };
  }).filter((item) => Boolean(item.image));

  const duplicatedLogos = [...logos, ...logos, ...logos];

  if (!logos || logos.length === 0) return null;

  return (
    <section className="py-10 bg-[#eff6ff] font-sans border-b overflow-hidden relative">
      <div className="container mx-auto max-w-7xl px-6">
        {autoScroll ? (
          <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-[#eff6ff] before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-[#eff6ff] after:to-transparent">
            <div 
              className="flex w-max items-center gap-10 md:gap-16 lg:gap-24"
              style={{ animation: 'rpa-logos-marquee 15s linear infinite' }}
              onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
              onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
            >
              {duplicatedLogos.map((logo, idx) => (
                <div
                  key={idx}
                  className="relative w-36 h-14 sm:w-44 sm:h-16 md:w-52 md:h-20 shrink-0 select-none flex items-center justify-center"
                >
                  {logo.image && (
                    <img
                      src={logo.image}
                      alt={logo.name || 'Partner Logo'}
                      className="w-full h-full object-contain opacity-75 hover:opacity-100 transition-opacity duration-300"
                    />
                  )}
                </div>
              ))}
            </div>
            <style dangerouslySetInnerHTML={{__html: `
              @keyframes rpa-logos-marquee {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-33.333333%); }
              }
            `}} />
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-14 opacity-75">
            {logos.map((logo, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.04 }}
                className="relative w-36 h-14 sm:w-44 sm:h-16 md:w-52 md:h-20 hover:scale-110 transition-all duration-300 select-none flex items-center justify-center"
              >
                {logo.image && (
                  <img
                    src={logo.image}
                    alt={logo.name || 'Partner Logo'}
                    className="w-full h-full object-contain"
                  />
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
