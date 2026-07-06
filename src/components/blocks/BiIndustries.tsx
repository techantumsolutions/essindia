'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface IndustryItem {
  image: string;
  title: string;
  description: string;
}

interface BiIndustriesContent {
  title?: string;
  description?: string;
  industries?: IndustryItem[];
}

export function BiIndustries({ content }: { content?: BiIndustriesContent }) {
  const title = content?.title || 'Industries We Empower';
  const description = content?.description || 'At ESS India, we deliver industry-driven digital solutions that help businesses streamline operations, improve visibility, and accelerate growth. Our ERP, automation, and business intelligence platforms are designed to adapt to the unique workflows and operational challenges of different industries, including FMCG, Retail, Pharma, Manufacturing, and Trading & Distribution. By combining deep domain expertise with scalable technology, we enable organizations to optimize resources, enhance decision-making, and achieve long-term business transformation with confidence.';

  const defaultIndustries: IndustryItem[] = [
    {
      title: 'FMCG',
      image: '/Business intilligence/Rectangle 140.png',
      description: 'Optimize supply chains, inventory, and distribution for faster-moving consumer markets.'
    },
    {
      title: 'Retail',
      image: '/Business intilligence/Rectangle 142.png',
      description: 'Deliver smarter retail operations with better customer insights and sales management.'
    },
    {
      title: 'Pharma',
      image: '/Business intilligence/Rectangle 141.png',
      description: 'Ensure compliance, streamline production, and improve operational efficiency in pharma businesses.'
    },
    {
      title: 'Trading & Distribution',
      image: '/Business intilligence/Rectangle 143.png',
      description: 'Manage procurement, warehousing, and distribution with complete business visibility.'
    }
  ];

  const industries = content?.industries && content.industries.length > 0 ? content.industries : defaultIndustries;
  const isScrollable = industries.length > 4;

  return (
    <section className="py-14 bg-[#c8d4e8] font-sans">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* Left Text Column */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-4xl sm:text-[45px] font-bold text-[#4c327f] leading-tight tracking-tight">
                {title}
              </h2>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-[#4b5563] text-sm sm:text-base leading-relaxed tracking-wide font-normal max-w-2xl"
            >
              {description}
            </motion.p>
          </div>

          {/* Right Stack Column */}
          <div className="lg:col-span-6">
            <div className={cn(
              "flex flex-col space-y-4",
              isScrollable && "max-h-[500px]  overflow-y-auto pr-2 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-[#4c327f]/30 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-[#4c327f]/50"
            )}>
              {industries.map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.05 }}
                  whileHover={{ scale: 1 }}
                  className="bg-white rounded-[24px] p-3 flex items-center gap-5 sm:gap-6 border border-[#27256b] shadow-sm transition-all duration-300 group cursor-pointer"
                >
                  {/* Left side Image with rounded corners */}
                  <div className="relative w-24 h-16 sm:w-32 sm:h-22 rounded-xl sm:rounded-2xl overflow-hidden flex-shrink-0 bg-slate-100">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* Right side Text content */}
                  <div className="flex-1 min-w-0 pr-3">
                    <h4 className="text-base sm:text-lg font-bold text-black mb-1 leading-snug">
                      {item.title}
                    </h4>
                    <p className="text-xs sm:text-[13px] text-slate-500 font-normal leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
