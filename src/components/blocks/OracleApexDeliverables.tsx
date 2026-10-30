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
  bgColor?: string;
  leftTitleTextColor?: string;
  leftItemBgColor?: string;
  leftItemTextColor?: string;
  leftIconBgColor?: string;
  leftIconColor?: string;
  rightTitleTextColor?: string;
  rightItemBgColor?: string;
  rightItemTextColor?: string;
  rightIconBgColor?: string;
  rightIconColor?: string;
  dividerColor?: string;
}

export function OracleApexDeliverables({ content }: { content?: OracleApexDeliverablesContent }) {
  const bgColor = content?.bgColor || '#2D1A70';
  const leftTitle = content?.leftTitle || 'WHAT WE DELIVER';
  const rightTitle = content?.rightTitle || 'BUSINESS IMPACT';
  const leftTitleTextColor = content?.leftTitleTextColor || '#ffffff';
  const leftItemBgColor = content?.leftItemBgColor || '#ffffff';
  const leftItemTextColor = content?.leftItemTextColor || '#2D1A70';
  const leftIconBgColor = content?.leftIconBgColor || '#f1f5f9';
  const leftIconColor = content?.leftIconColor || '#2D1A70';
  const rightTitleTextColor = content?.rightTitleTextColor || '#ffffff';
  const rightItemBgColor = content?.rightItemBgColor || '#d4dafa';
  const rightItemTextColor = content?.rightItemTextColor || '#2D1A70';
  const rightIconBgColor = content?.rightIconBgColor || '#f1f5f9';
  const rightIconColor = content?.rightIconColor || '#2D1A70';
  const dividerColor = content?.dividerColor || '#ffffff';

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

  const renderIcon = (icon: string, iconColor: string) => {
    if (!icon) return <Icons.Eye className="w-5 h-5" style={{ color: iconColor }} />;

    const isPath = icon.startsWith('/') || icon.includes('.') || icon.includes('://') || icon.includes('\\');
    if (isPath) {
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

    const LucideIcon = (Icons as any)[icon];
    if (LucideIcon) {
      return <LucideIcon className="w-5 h-5" style={{ color: iconColor }} />;
    }

    return <Icons.Eye className="w-5 h-5" style={{ color: iconColor }} />;
  };

  return (
    <section className="py-14 font-sans relative overflow-hidden" style={{ backgroundColor: bgColor }}>
      <div className="container mx-auto max-w-7xl px-6 relative z-10">

        <div className="hidden lg:grid lg:grid-cols-2 text-center items-center pb-5">
          <div>
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-wider uppercase"
              style={{ color: leftTitleTextColor }}
            >
              {leftTitle}
            </h2>
          </div>
          <div>
            <h2
              className="text-xl sm:text-2xl font-extrabold tracking-wider uppercase"
              style={{ color: rightTitleTextColor }}
            >
              {rightTitle}
            </h2>
          </div>
        </div>

        <div
          className="hidden lg:block border-t w-full mb-8"
          style={{ borderColor: dividerColor }}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0">
          <div className="space-y-4 lg:pr-12">
            <div
              className="block lg:hidden text-center pb-2 border-b mb-4"
              style={{ borderColor: `${dividerColor}66` }}
            >
              <h2
                className="text-xl font-extrabold tracking-wider uppercase"
                style={{ color: leftTitleTextColor }}
              >
                {leftTitle}
              </h2>
            </div>
            {leftItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                style={{ backgroundColor: leftItemBgColor }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-200/50"
                  style={{ backgroundColor: leftIconBgColor }}
                >
                  {renderIcon(item.icon, leftIconColor)}
                </div>
                <span
                  className="text-sm sm:text-base font-semibold leading-snug"
                  style={{ color: leftItemTextColor }}
                >
                  {item.text}
                </span>
              </motion.div>
            ))}
          </div>

          <div
            className="space-y-4 lg:pl-12 lg:border-l"
            style={{ borderColor: dividerColor }}
          >
            <div
              className="block lg:hidden text-center pb-2 border-b mb-4 pt-4 lg:pt-0"
              style={{ borderColor: `${dividerColor}66` }}
            >
              <h2
                className="text-xl font-extrabold tracking-wider uppercase"
                style={{ color: rightTitleTextColor }}
              >
                {rightTitle}
              </h2>
            </div>
            {rightItems.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center gap-4 p-3 rounded-2xl shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300"
                style={{ backgroundColor: rightItemBgColor }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 border border-slate-200/50"
                  style={{ backgroundColor: rightIconBgColor }}
                >
                  {renderIcon(item.icon, rightIconColor)}
                </div>
                <span
                  className="text-sm sm:text-base font-semibold leading-snug"
                  style={{ color: rightItemTextColor }}
                >
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
