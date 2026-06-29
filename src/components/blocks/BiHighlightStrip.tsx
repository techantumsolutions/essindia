'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Wand2, ShieldCheck, HelpCircle, LucideIcon } from 'lucide-react';

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
  circleBgColor?: string;
  circleIconColor?: string;
  borderColor?: string;
  items?: StripItem[];
}

export function BiHighlightStrip({ content }: { content?: BiHighlightStripContent }) {
  const bgColor = content?.bgColor || '#fcc42c';
  const textColor = content?.textColor || '#1f2937';
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

  // Helper to parse double asterisks ** for bold text
  const renderFormattedText = (text: string) => {
    if (!text) return '';
    const parts = text.split('**');
    return parts.map((part, index) => {
      // Odd indices are between asterisks, so they are bold
      if (index % 2 === 1) {
        return <strong key={index} className="font-bold">{part}</strong>;
      }
      return part;
    });
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
          
          {/* Item 1 */}
          {items[0] && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-5 md:pr-12 md:border-r"
              style={{ borderColor: borderColor }}
            >
              {/* Round icon circle */}
              <div 
                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: circleBgColor, color: circleIconColor }}
              >
                {(() => {
                  const Icon = iconMap[items[0].icon?.toLowerCase() || ''] || Wand2;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              
              {/* Text */}
              <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-left">
                {renderFormattedText(items[0].text || '')}
              </p>
            </motion.div>
          )}

          {/* Item 2 */}
          {items[1] && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="flex items-center gap-5 md:pl-12"
            >
              {/* Round icon circle */}
              <div 
                className="flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center shadow-sm"
                style={{ backgroundColor: circleBgColor, color: circleIconColor }}
              >
                {(() => {
                  const Icon = iconMap[items[1].icon?.toLowerCase() || ''] || ShieldCheck;
                  return <Icon className="w-6 h-6" />;
                })()}
              </div>
              
              {/* Text */}
              <p className="text-sm sm:text-base md:text-lg font-normal leading-relaxed text-left">
                {renderFormattedText(items[1].text || '')}
              </p>
            </motion.div>
          )}

        </div>
      </div>
    </section>
  );
}
