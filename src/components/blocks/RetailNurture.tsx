'use client';

import React from 'react';
import { motion } from 'framer-motion';

export interface RetailNurtureContent {
  title?: string;
  paragraphs?: string[];
  images?: string[];
  whyTitle?: string;
  whyParagraph?: string;
  whyImagePath?: string;
}

export function RetailNurture({ content }: { content: RetailNurtureContent }) {
  const {
    title = 'Lorem ipsum dolor sit amet',
    paragraphs = [
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
      'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
    ],
    images = [
      '/industry-solution-Retail/industry-1.png',
      '/industry-solution-Retail/industry-2.png',
      '/industry-solution-Retail/industry-3.png'
    ],
    whyTitle = 'Lorem ipsum dolor',
    whyParagraph = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
    whyImagePath = '/industry-solution-Retail/img-2.png',
  } = content || {};

  return (
    <>
      <section className="py-14 bg-white">
        <div className="container mx-auto px-4 md:px-6 max-w-7xl">

          {/* Top Illustrations */}
          <div className="flex flex-wrap justify-center lg:justify-start items-center gap-8 mb-12">
            {images.map((img, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="w-40 lg:w-56 h-auto"
              >
                <img src={img} alt={`Retail Illustration ${idx + 1}`} className="w-full h-auto object-contain" />
              </motion.div>
            ))}
          </div>

          {/* Content Area */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-left"
          >
            <h2 className="text-3xl -mt-4 md:text-4xl font-bold text-[#27256b] mb-4 tracking-tight">
              {title}
            </h2>

            <div className="space-y-4 text-left md:text-left text-[#b2b2b2] text-sm leading-relaxed">
              {paragraphs.map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>
          </motion.div>

          {/* Why ebizframe ERP Section */}

          <div className="grid grid-cols-1 mt-5 md:grid-cols-2 gap-4">

            {/* Left Diagram */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-full"
            >
              <img
                src={whyImagePath}
                alt="ERP Process Diagram"
                className=" w-full h-full max-w-xl object-contain drop-shadow-lg"
              />
            </motion.div>

            {/* Right Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full flex flex-col justify-center"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-indigo-900 mb-6 tracking-tight">
                {whyTitle}
              </h2>
              <p className="text-sm text-[#b2b2b2] leading-relaxed text-justify md:text-left">
                {whyParagraph}
              </p>
            </motion.div>

          </div>

        </div>

      </section>



    </>
  );
}
