'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

interface DeliverableItem {
  icon: string;
  text: string;
}

interface OracleApexDeliverablesContent {
  leftTitle?: string;
  leftItems?: DeliverableItem[];
  rightTitle?: string;
  rightItems?: DeliverableItem[];
}

export function OracleApexDeliverables({ content }: { content?: OracleApexDeliverablesContent }) {
  const bgColor = '#2D1A70';
  const leftTitle = content?.leftTitle || 'WHAT WE DELIVER';
  const rightTitle = content?.rightTitle || 'BUSINESS IMPACT';

  const defaultLeftItems: DeliverableItem[] = [
    { icon: '/Migration-Oracle Forms to Oracle APEX/Frame 267.png', text: 'Complete Oracle Forms to Oracle APEX migration' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/database-02_svgrepo.com.png', text: 'Secure and optimized Database migration' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/web-design_svgrepo.com.png', text: 'Modernized Web UI/UX design' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/statistic-up_svgrepo.com.png', text: 'Enhanced analytics and reporting' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/cloud-upload_svgrepo.com.png', text: 'Seamless Cloud deployment' }
  ];

  const defaultRightItems: DeliverableItem[] = [
    { icon: '/Migration-Oracle Forms to Oracle APEX/settings_svgrepo.com.png', text: 'Reduced maintenance overhead' },
    { icon: 'Eye', text: 'Improved operational visibility' },
    { icon: '/migration-orcl datebase upgrade and optimization/performance_svgrepo.com.png', text: 'Enhanced system performance' },
    { icon: '/migration-orcl datebase upgrade and optimization/network-solid_svgrepo.com.png', text: 'Scalable digital architecture' },
    { icon: '/Migration-Oracle Forms to Oracle APEX/boost-for-reddit_svgrepo.com.png', text: 'Future-ready ERP foundation' }
  ];

  const leftItems = content?.leftItems && content.leftItems.length > 0 ? content.leftItems : defaultLeftItems;
  const rightItems = content?.rightItems && content.rightItems.length > 0 ? content.rightItems : defaultRightItems;

  // Helper to render icon
  const renderIcon = (icon: string) => {
    if (!icon) return <Icons.Eye className="w-5 h-5 text-[#2D1A70]" />;

    // Check if it's a path/url
    const isPath = icon.startsWith('/') || icon.includes('.') || icon.includes('://') || icon.includes('\\');
    if (isPath) {
      // Normalize slashes for safety
      const srcPath = icon.replace(/\\/g, '/');
      return (
        <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
          <Image
            src={srcPath}
            alt="deliverable icon"
            width={24}
            height={24}
            className="object-contain"
          />
        </div>
      );
    }

    // Otherwise, resolve Lucide icon dynamically
    const LucideIcon = (Icons as any)[icon];
    if (LucideIcon) {
      return <LucideIcon className="w-5 h-5 text-[#2D1A70]" />;
    }

    // Default fallback
    return <Icons.Eye className="w-5 h-5 text-[#2D1A70]" />;
  };

  return (
    <section className="py-14 font-sans relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl px-6 relative z-10">

        {/* Section Header Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 text-center items-center pb-5">
          <div className="pb-4 lg:pb-0">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase">
              {leftTitle}
            </h2>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-wider uppercase">
              {rightTitle}
            </h2>
          </div>
        </div>

        {/* Horizontal Divider Line */}
        <div className="border-t border-white w-full mb-8" />

        {/* Main Content Side-by-Side Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 lg:divide-x lg:divide-white">

          {/* Left Column: What We Deliver */}
          <div className="space-y-4 lg:pr-12">
            {leftItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-4 bg-white p-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
                  {renderIcon(item.icon)}
                </div>
                <span className="text-sm sm:text-base font-semibold text-[#2D1A70] leading-snug">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          {/* Right Column: Business Impact */}
          <div className="space-y-4 lg:pl-12">
            {rightItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                style={{ backgroundColor: '#d4dafa' }}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200/50">
                  {renderIcon(item.icon)}
                </div>
                <span className="text-sm sm:text-base font-semibold text-[#2D1A70] leading-snug">
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
