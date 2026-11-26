'use client';

import React from 'react';

export interface IndustryItem {
  icon: string;
  name: string;
}

export interface Landing1IndustriesContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  description?: string;
  image?: string;
  industries?: IndustryItem[];
}

const DEFAULT_INDUSTRIES: IndustryItem[] = [
  { icon: '/Landing page1/assets/factory_svgrepo.com.png', name: 'Manufacturing' },
  { icon: '/Landing page1/assets/bag-3_svgrepo.com.png', name: 'Retail' },
  { icon: '/Landing page1/assets/tshirt_svgrepo.com.png', name: 'Textile' },
  { icon: '/Landing page1/assets/food_svgrepo.com.png', name: 'Food' },
  { icon: '/Landing page1/assets/car_svgrepo.com.png', name: 'Automobile' },
  { icon: '/Landing page1/assets/logistics-delivery-cart_svgrepo.com.png', name: 'Logistics' },
  { icon: '/Landing page1/assets/heart-health_svgrepo.com.png', name: 'Healthcare' },
  { icon: '/Landing page1/assets/helmet-industry-business-construction-engineer-worker-engineering_svgrepo.com.png', name: 'Construction' },
  { icon: '/Landing page1/assets/education-cap-student-graduation-university_svgrepo.com.png', name: 'Education' },
  { icon: '/Landing page1/assets/load-balancer-network_svgrepo.com.png', name: 'Distribution' },
  { icon: '/Landing page1/assets/pharmacy_svgrepo.com.png', name: 'Pharma' },
  { icon: '/Landing page1/assets/chemical-lab_svgrepo.com.png', name: 'Chemical' },
];

const DEFAULT_CONTENT: Landing1IndustriesContent = {
  badge: 'INDUSTRIES',
  title: 'Built For Every Industry',
  description: '25+ Industry-Specific Configurations Out Of The Box. Pre-Built Workflows, Reports And Compliance — Tuned To How Your Sector Actually Works.',
  image: '/Landing page1/assets/Frame 1618872987.png',
  industries: DEFAULT_INDUSTRIES
};

export function Landing1Industries({ content }: { content?: Landing1IndustriesContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  return (
    <section className="py-20 bg-[#080C1B] text-white font-sans overflow-hidden relative">
      {/* Decorative Radial Background Glow */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <div className="container mx-auto px-6 max-w-7xl relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Title, description, and Image */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-4">
              {data.badge && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-[#5D38F0] bg-white border border-[#E9E4FF] uppercase shadow-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#5D38F0]" />
                  {data.badge}
                </span>
              )}
              {data.title && (
                <h2
                  className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight"
                  style={data.titleColor ? { color: data.titleColor } : undefined}
                >
                  {data.title}
                </h2>
              )}
              {data.description && (
                <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-xl">
                  {data.description}
                </p>
              )}
            </div>

            {data.image && (
              <div className="relative rounded-[28px] overflow-hidden shadow-2xl border border-white/[0.05] bg-white/[0.02]">
                <img
                  src={data.image}
                  alt="Industries overview mockup"
                  className="w-full h-auto object-cover object-left-top"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          {/* Right Column: 12 Industry Grid */}
          <div className="lg:col-span-6">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
              {data.industries?.map((ind, idx) => (
                <div
                  key={idx}
                  className="bg-white py-6 px-3 rounded-[32px] shadow-[0_10px_25px_-5px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_35px_-5px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition-all duration-300 flex flex-col items-center justify-center text-center group cursor-pointer w-full overflow-hidden min-w-0 aspect-[1.1] md:aspect-[1.15]"
                >
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-[20px] bg-gradient-to-b from-[#FAF5FF] to-[#F3E8FF] flex items-center justify-center p-3 sm:p-3.5 mb-2.5 sm:mb-3.5 group-hover:from-[#F3E8FF] group-hover:to-[#E9D5FF] transition-all duration-300 shrink-0 shadow-inner">
                    <img
                      src={ind.icon}
                      alt={ind.name}
                      className="w-full h-full object-contain"
                      style={{ filter: 'invert(18%) sepia(82%) saturate(3015%) hue-rotate(256deg) brightness(81%) contrast(98%)' }}
                    />
                  </div>
                  <span className="font-extrabold text-[#0F172A] text-xs sm:text-sm tracking-wide break-words max-w-full leading-tight block px-1">
                    {ind.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
