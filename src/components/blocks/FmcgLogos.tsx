'use client';

import React from 'react';
import Image from 'next/image';

interface LogoItem {
  image: string;
  alt: string;
}

interface FmcgLogosContent {
  logos?: LogoItem[];
  autoScroll?: boolean;
}

export function FmcgLogos({ content }: { content?: FmcgLogosContent }) {
  const defaultLogos: LogoItem[] = [
    { image: '/BI-industy solution-FMGC/1704524770_microsoft erp-min 1.png', alt: 'Microsoft Dynamics' },
    { image: '/BI-industy solution-FMGC/1704524759_oracle erp-min 1.png', alt: 'Oracle E-Business Suite' },
    { image: '/BI-industy solution-FMGC/1704524802_salesforce erp-min 1.png', alt: 'Salesforce CRM' },
    { image: '/BI-industy solution-FMGC/1704524792_sage erp-min 1.png', alt: 'Sage ERP' },
    { image: '/BI-industy solution-FMGC/1704524780_infor erp-min 1.png', alt: 'Infor ERP' },
    { image: '/BI-industy solution-FMGC/1711797804_SAP LOGO 1.png', alt: 'SAP ERP' },
  ];

  const logos = content?.logos || defaultLogos;
  const autoScroll = content?.autoScroll !== false;
  const duplicatedLogos = [...logos, ...logos, ...logos];

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        {logos.length > 0 && (
          <div className="overflow-hidden relative">
            {autoScroll ? (
              <div className="relative w-full overflow-hidden before:absolute before:left-0 before:top-0 before:z-10 before:h-full before:w-[100px] before:bg-gradient-to-r before:from-white before:to-transparent after:absolute after:right-0 after:top-0 after:z-10 after:h-full after:w-[100px] after:bg-gradient-to-l after:from-white after:to-transparent">
                <div 
                  className="flex w-max items-center gap-10 md:gap-16 lg:gap-24"
                  style={{ animation: 'fmcg-logos-marquee 15s linear infinite' }}
                  onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
                  onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
                >
                  {duplicatedLogos.map((logo, idx) => (
                    <div
                      key={idx}
                      className="relative w-24 md:w-32 h-12 shrink-0 select-none flex items-center justify-center"
                    >
                      {logo.image && (
                        <Image
                          src={logo.image}
                          alt={logo.alt || `ERP Logo ${idx + 1}`}
                          fill
                          className="object-contain max-h-12 hover:scale-105 transition-transform duration-300"
                        />
                      )}
                    </div>
                  ))}
                </div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes fmcg-logos-marquee {
                    0% { transform: translateX(0%); }
                    100% { transform: translateX(-33.333333%); }
                  }
                `}} />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 md:gap-12 items-center justify-items-center">
                {logos.map((logo, index) => (
                  <div
                    key={index}
                    className="relative w-full h-12 transition-transform duration-300 hover:scale-110 flex items-center justify-center"
                  >
                    {logo.image && (
                      <Image
                        src={logo.image}
                        alt={logo.alt || `ERP Logo ${index + 1}`}
                        fill
                        className="object-contain max-h-12"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
