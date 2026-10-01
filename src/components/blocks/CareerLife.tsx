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
    image4,
    image5,
    largeImage = '/Career-Page/image 91.png',
    largeImageTitle = 'London Outdoor event - 2023',
    largeImageSubtitle = 'Annual team gathering and celebration',
    smallImage = '/Career-Page/image 92.png'
  } = content || {};

  // Gather all top row images (supporting up to 5 individual images)
  const topImages = [
    { src: image1, alt: 'Event' },
    { src: image2, alt: 'Team Building' },
    { src: image3, alt: 'Group Photo' },
    { src: image4, alt: 'Moments' },
    { src: image5, alt: 'Gathering' },
  ].filter(img => Boolean(img.src && String(img.src).trim() !== ''));

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="text-[#71717A] max-w-2xl mx-auto text-2xl font-light leading-none">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {/* Top Gallery Grid */}
          {topImages.length > 0 && (
            <div className={`grid grid-cols-1 sm:grid-cols-2 ${
              topImages.length === 5
                ? 'md:grid-cols-5'
                : topImages.length === 4
                ? 'md:grid-cols-4'
                : 'md:grid-cols-3'
            } gap-4`}>
              {topImages.map((img, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="rounded-xl overflow-hidden aspect-[4/3] group relative bg-slate-100"
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Bottom Row: 2 Images (Featured Large Image + Small Image) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-xl overflow-hidden md:col-span-2 aspect-[16/9] md:aspect-auto md:h-[400px] group relative bg-slate-100"
            >
              <img
                src={largeImage}
                alt={largeImageTitle || 'Featured Event'}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              {(largeImageTitle || largeImageSubtitle) && (
                (() => {
                  const titleText = (largeImageTitle || '').trim();
                  const subText = (largeImageSubtitle || '').trim();
                  const isTitleImage = titleText.startsWith('/') || titleText.startsWith('http');
                  const isSubImage = subText.startsWith('/') || subText.startsWith('http');

                  const displayTitle = !isTitleImage ? titleText : '';
                  const displaySub = !isSubImage ? subText : '';

                  if (!displayTitle && !displaySub) return null;

                  return (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                      {displayTitle && <h3 className="text-white text-2xl font-bold mb-2">{displayTitle}</h3>}
                      {displaySub && <p className="text-white/80 text-sm">{displaySub}</p>}
                    </div>
                  );
                })()
              )}
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="rounded-xl overflow-hidden md:col-span-1 aspect-[4/3] md:aspect-auto md:h-[400px] group relative bg-slate-100"
            >
              <img
                src={smallImage}
                alt="Celebration"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
