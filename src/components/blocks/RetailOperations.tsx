'use client';

import React from 'react';
import { motion } from 'framer-motion';

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

  return (
    <section className="py-14 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-[#2b2a63] mb-1 tracking-tight"
          >
            {title}
          </motion.h2>
          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg  font-bold text-[#5c77ff] mb-1"
          >
            {subtitle}
          </motion.h3>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#888888] text-sm leading-relaxed whitespace-pre-line"
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
              <h4 className="font-bold text-[#2b2a63] mb-1 text-base md:text-sm">{op.title}</h4>
              <p className="text-[#888888] text-xs  leading-relaxed">{op.description}</p>
            </motion.div>
          ))}
        </div>
        

      </div>
    </section>
  );
}
