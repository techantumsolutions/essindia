'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

export interface RetailOperationItem {
  title: string;
  description: string;
  iconImage?: string;
  iconPath?: string;
}

export interface RetailOperationsContent {
  title?: string;
  subtitle?: string;
  paragraph?: string;
  operations?: RetailOperationItem[];
  bgColor?: string;
  borderColor?: string;
  titleColor?: string;
  subtitleColor?: string;
  paragraphColor?: string;
  itemTitleColor?: string;
  itemDescriptionColor?: string;
}

export function RetailOperations({ content }: { content: RetailOperationsContent }) {
  const {
    title = 'Lorem ipsum dolor sit amet',
    subtitle = 'Lorem ipsum dolor sit amet',
    paragraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    operations = [
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-1.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-2.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-3.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-4.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-5.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-6.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-7.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-8.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-10.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-11.png'
      },
      {
        title: 'Lorem Ipsum',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        iconImage: '/industry-solution-Retail/Icon-12.png'
      },
    ],
  } = content || {};

  const bgColor = content?.bgColor || '#ffffff';
  const borderColor = content?.borderColor || '#e5e7eb';
  const titleColor = content?.titleColor || '#2b2a63';
  const subtitleColor = content?.subtitleColor || '#5c77ff';
  const paragraphColor = content?.paragraphColor || '#888888';
  const itemTitleColor = content?.itemTitleColor || '#2b2a63';
  const itemDescriptionColor = content?.itemDescriptionColor || '#888888';

  return (
    <section className="py-12 border-t border-b" style={{ backgroundColor: bgColor, borderColor }}>
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Header */}
        <div className="text-center mb-6 md:mb-8 lg:mb-20 max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold mb-1 tracking-tight"
            style={{ color: titleColor }}
          >
            {title}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg font-bold mb-1"
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </motion.h3>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm leading-relaxed whitespace-pre-line"
            style={{ color: paragraphColor }}
          >
            {paragraph}
          </motion.p>
        </div>

        {/* Grid */}

        <div className="grid grid-cols-1 align-items-center md:grid-cols-2 lg:grid-cols-4 gap-8">
          {operations.map((op, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              className="flex flex-col items-center text-center md:items-start md:text-left group"
            >
              <div className="mb-2 h-14 flex items-center justify-start">
                <img
                  src={op.iconImage || op.iconPath}
                  alt={op.title}
                  className="w-12 h-12 object-contain filter group-hover:brightness-75 transition-all"
                />
              </div>
              <h4 className="font-bold mb-1 text-base md:text-sm" style={{ color: itemTitleColor }}>{op.title}</h4>
              {(op.description?.includes('<') && op.description.includes('>')) || op.description?.includes('&lt;') ? (
                <FormattedText
                  content={op.description}
                  className="text-[16px] leading-[1.6] [&_p]:m-0"
                  style={{ color: itemDescriptionColor }}
                />
              ) : (
                <p className="text-xs leading-relaxed" style={{ color: itemDescriptionColor }}>{op.description}</p>
              )}
            </motion.div>
          ))}
        </div>


      </div>
    </section>
  );
}
