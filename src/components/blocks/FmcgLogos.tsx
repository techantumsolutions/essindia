'use client';

import React from 'react';
import Image from 'next/image';

interface LogoItem {
  image: string;
  alt: string;
}

interface FmcgLogosContent {
  logos?: LogoItem[];
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

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
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
      </div>
    </section>
  );
}
