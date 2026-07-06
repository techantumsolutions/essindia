'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface RetailClientsContent {
  title?: string;
  logos?: string[];
  autoScroll?: boolean;
}
export function RetailClients({ content }: { content: RetailClientsContent }) {
  const {
    title = 'Lorem ipsum dolor sit amet',
    logos = [
      '/industry-solution-Retail/image 37.png',
      '/industry-solution-Retail/image 45.png',
      '/industry-solution-Retail/image 46.png',
      '/industry-solution-Retail/image 47.png',
      '/industry-solution-Retail/image 48.png',
    ],
    autoScroll = true,
  } = content || {};

  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-14 bg-white border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <motion.h3 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-xl md:text-2xl font-bold text-indigo-900 mb-10 text-center md:text-left"
        >
          {title}
        </motion.h3>
        
        {logos.length > 0 && (
          <div className="overflow-hidden relative">
            {autoScroll ? (
              <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-white after:to-transparent">
                <div 
                  className="flex w-max items-center gap-10 md:gap-16 lg:gap-24"
                  style={{ animation: 'retail-logos-marquee 15s linear infinite' }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  {duplicatedLogos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="w-24 md:w-32 h-16 flex items-center justify-center shrink-0 select-none"
                    >
                      <img src={logo} alt={`Client Logo ${idx + 1}`} className="max-w-full max-h-full object-contain opacity-70 hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes retail-logos-marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-33.333333%); }
                  }
                `}} />
              </div>
            ) : (
              <div className="flex flex-wrap justify-center md:justify-start items-center gap-8 md:gap-16">
                {logos.map((logo, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, filter: 'grayscale(100%)' }}
                    whileInView={{ opacity: 1, filter: 'grayscale(0%)' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="w-24 md:w-32 h-16 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity"
                  >
                    <img src={logo} alt={`Client Logo ${idx + 1}`} className="max-w-full max-h-full object-contain" />
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
