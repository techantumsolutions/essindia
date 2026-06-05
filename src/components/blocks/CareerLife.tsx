'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CareerLife({ content }: { content?: any }) {
  const {
    title = 'Life Beyond the Code',
    subtitle = "From team celebrations to social events, here's a glimpse of the moments we share together.",
    image1 = '/Career-Page/image 88.png',
    image2 = '/Career-Page/image 89.png',
    image3 = '/Career-Page/image 90.png',
    largeImage = '/Career-Page/image 91.png',
    largeImageTitle = 'London Outdoor event - 2023',
    largeImageSubtitle = 'Annual team gathering and celebration',
    smallImage = '/Career-Page/image 92.png'
  } = content || {};

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-[#71717A] max-w-2xl mx-auto text-2xl font-light leading-none">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Top Row: 3 Images */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="rounded-xl overflow-hidden aspect-[4/3] group relative"
          >
            <img src={image1} alt="Event" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-xl overflow-hidden aspect-[4/3] group relative"
          >
            <img src={image2} alt="Team Building" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-xl overflow-hidden aspect-[4/3] group relative"
          >
            <img src={image3} alt="Group Photo" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </motion.div>

          {/* Bottom Row: 2 Images (2/3 and 1/3) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-xl overflow-hidden md:col-span-2 aspect-[16/9] md:aspect-auto md:h-[400px] group relative"
          >
            <img src={largeImage} alt={largeImageTitle} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
              <h3 className="text-white text-2xl font-bold mb-2">{largeImageTitle}</h3>
              <p className="text-white/80 text-sm">{largeImageSubtitle}</p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-xl overflow-hidden md:col-span-1 aspect-[4/3] md:aspect-auto md:h-[400px] group relative"
          >
            <img src={smallImage} alt="Celebration" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
