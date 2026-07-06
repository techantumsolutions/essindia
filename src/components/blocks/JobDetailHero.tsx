'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Briefcase, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

export interface JobDetailHeroContent {
  bgColor?: string;
  buttonText?: string;
  buttonTextColor?: string;
  buttonArrowColor?: string;
  tag1BgColor?: string;
  tag1Text?: string;
  tag1TextColor?: string;
  tag2BgColor?: string;
  tag2Text?: string;
  tag2TextColor?: string;
  titleText?: string;
  titleTextColor?: string;
  items?: Array<{ icon?: string | null; text?: string }>;
  backLinkUrl?: string;
  backLinkText?: string;
  tags?: string[];
  jobTitle?: string;
  meta?: Array<{ icon: string; text: string }>;
}

export default function JobDetailHero({ content }: { content?: JobDetailHeroContent }) {
  const router = useRouter();

  const {
    bgColor = '#e4e4e7',
    buttonText = (content as any)?.backLinkText || 'Back to Careers',
    buttonTextColor = '#64748b',
    buttonArrowColor = '#64748b',
    tag1BgColor = '#ffffff',
    tag1Text = (content as any)?.tags?.[0] || 'Engineering',
    tag1TextColor = '#1e293b',
    tag2BgColor = '#ffffff',
    tag2Text = (content as any)?.tags?.[1] || 'Full-time',
    tag2TextColor = '#1e293b',
    titleText = (content as any)?.jobTitle || 'Microsoft .NET Backend Developer',
    titleTextColor = '#0f172a',
    items = (content as any)?.meta?.map((m: any) => ({
      icon: m.icon === 'MapPin' ? '/Contact us/location-pin-alt-1_svgrepo.com.png' : null,
      text: m.text
    })) || [
      { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'India' },
      { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: '3-5 years' },
      { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'Full-time' },
      { icon: '/Contact us/location-pin-alt-1_svgrepo.com.png', text: 'Engineering' }
    ],
    backLinkUrl = '/careers',
  } = content || {};

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(backLinkUrl);
    }
  };

  return (
    <section 
      className="relative min-h-[80vh] flex items-center pt-40 pb-16 px-6 lg:px-8"
      style={{ backgroundColor: bgColor }}
    >
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center text-[13px] font-medium transition-colors mb-8 cursor-pointer"
            style={{ color: buttonTextColor }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" style={{ color: buttonArrowColor }} />
            {buttonText}
          </button>

          {/* Tags */}
          <div className="flex items-center gap-3 mb-6">
            {tag1Text && (
              <span 
                className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                style={{ backgroundColor: tag1BgColor, color: tag1TextColor }}
              >
                {tag1Text}
              </span>
            )}
            {tag2Text && (
              <span 
                className="inline-block text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                style={{ backgroundColor: tag2BgColor, color: tag2TextColor }}
              >
                {tag2Text}
              </span>
            )}
          </div>

          {/* Job Title */}
          <h1 
            className="text-4xl md:text-5xl lg:text-[56px] font-bold mb-8 tracking-tight"
            style={{ color: titleTextColor }}
          >
            {titleText}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-[15px] text-slate-600 font-medium">
            {items.map((item: any, index: number) => (
              <div key={index} className="flex items-center">
                {item.icon && (
                  <img src={item.icon} alt="" className="w-4 h-4 mr-1.5 object-contain" />
                )}
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
