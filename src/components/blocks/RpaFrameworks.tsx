'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface FrameworkLogo {
  image?: string;
  name?: string;
}

interface RpaFrameworksContent {
  title?: string;
  logos?: FrameworkLogo[];
  autoScroll?: boolean;
}

export function RpaFrameworks({ content }: { content?: RpaFrameworksContent }) {
  const title = content?.title || 'ESS brings expertise on frameworks';
  const autoScroll = content?.autoScroll !== false;

  const defaultLogos: FrameworkLogo[] = [
    { image: '/RPA-Robotic Process Automation (RPA)/image 64.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 65.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 66.png' },
    { image: '/RPA-Robotic Process Automation (RPA)/image 67.png' }
  ];

  const logos = content?.logos && content.logos.length > 0 ? content.logos : defaultLogos;
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-14 bg-white font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6 text-center space-y-4">
        {title && (
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-lg sm:text-xl font-medium text-slate-700 tracking-tight"
          >
            {title}
          </motion.h3>
        )}

        {logos.length > 0 && (
          <div className="overflow-hidden relative">
            {autoScroll ? (
              <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-white after:to-transparent">
                <div 
                  className="flex w-max items-center gap-10 md:gap-16 lg:gap-24"
                  style={{ animation: 'rpa-frameworks-marquee 15s linear infinite' }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  {duplicatedLogos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="relative w-36 h-12 shrink-0 select-none"
                    >
                      {logo.image && (
                        <Image
                          src={logo.image}
                          alt={logo.name || 'Framework Logo'}
                          fill
                          className="object-contain hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes rpa-frameworks-marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-33.333333%); }
                  }
                `}} />
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
                {logos.map((logo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: idx * 0.05 }}
                    className="relative w-36 h-12 hover:scale-105 transition-transform duration-300 select-none"
                  >
                    {logo.image && (
                      <Image
                        src={logo.image}
                        alt={logo.name || 'Framework Logo'}
                        fill
                        className="object-contain"
                      />
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
