'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, ShieldCheck, LucideIcon } from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  wand: Wand2,
  magic: Wand2,
  'shield-check': ShieldCheck,
  shield: ShieldCheck
};

interface StripItem {
  icon?: string;
  text?: string;
}

interface BiHighlightStripContent {
  bgColor?: string;
  textColor?: string;
  boldTextColor?: string;
  circleBgColor?: string;
  circleIconColor?: string;
  borderColor?: string;
  items?: StripItem[];
}

export function BiHighlightStrip({ content }: { content?: BiHighlightStripContent }) {
  const bgColor = content?.bgColor || '#fcc42c';
  const textColor = content?.textColor || '#1f2937';
  const boldTextColor = content?.boldTextColor || textColor;
  const circleBgColor = content?.circleBgColor || '#4c327f';
  const circleIconColor = content?.circleIconColor || '#ffffff';
  const borderColor = content?.borderColor || 'rgba(0, 0, 0, 0.15)';

  const defaultItems: StripItem[] = [
    {
      icon: 'wand',
      text: 'Our AI-driven dashboards give you a 360° executive view across **sales, operations, finance, and inventory** – in real time.'
    },
    {
      icon: 'shield-check',
      text: 'Make strategic decisions with confidence, not assumptions.'
    }
  ];

  const items = content?.items && content.items.length >= 2 ? content.items : defaultItems;

  const renderFormattedText = (text: string) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <strong key={index} className="font-bold" style={{ color: boldTextColor }}>
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  const renderIcon = (iconVal: string, fallback: LucideIcon) => {
    const trimmed = iconVal?.trim() || '';
    const isUploadedImage = trimmed.startsWith('/') || trimmed.startsWith('http') || trimmed.includes('.');
    if (isUploadedImage) {
      return (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img src={encodeURI(trimmed)} alt="Icon" className="w-full h-full object-contain" />
      );
    }
    const Icon = iconMap[trimmed.toLowerCase()] || fallback;
    return <Icon className="w-6 h-6" />;
  };

  return (
    <section
      className="py-8 overflow-hidden font-sans border-t border-b"
      style={{
        backgroundColor: bgColor,
        borderColor: borderColor,
        color: textColor
      }}
    >
      <div className="container mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-0 items-center">
          {items[0] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-5 md:pr-12 md:border-r"
              style={{ borderColor: borderColor }}
            >
              <div
                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3"
                style={{ backgroundColor: circleBgColor, color: circleIconColor }}
              >
                {renderIcon(items[0].icon || '', Wand2)}
              </div>
              <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-left" style={{ color: textColor }}>
                {renderFormattedText(items[0].text || '')}
              </p>
            </motion.div>
          )}

          {items[1] && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-5 md:pl-12"
            >
              <div
                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm overflow-hidden p-3"
                style={{ backgroundColor: circleBgColor, color: circleIconColor }}
              >
                {renderIcon(items[1].icon || '', ShieldCheck)}
              </div>
              <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-left" style={{ color: textColor }}>
                {renderFormattedText(items[1].text || '')}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
