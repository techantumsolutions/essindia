'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CareerHero({ content }: { content?: any }) {
  const {
    title = 'Join us to shape the future of\nemployment',
    description = "We're building a culture at ESS where amazing people (like you) can do their best work.\nIf you're ready to accelerate your career and transform the employment landscape, we'd\nlove for you to come work with us!",
    ctaText = 'Careers',
    bgImage = '/Career-Page/Career.png'
  } = content || {};

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden px-6 pt-40 pb-16">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("${bgImage}")` }}
      >
        <div className="absolute inset-0 bg-black/40" /> {/* Optional overlay for text readability */}
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-[20px] bg-white px-14 py-2 text-lg font-medium text-[#0D1A5C] mb-6 cursor-pointer hover:bg-slate-50 transition-colors shadow-lg">
            {ctaText}
          </div>

          <h1
            className="text-5xl md:text-6xl lg:text-[72px] font-thin tracking-wide text-white mb-8 max-w-5xl mx-auto leading-[1.15]"
            dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
          />

          <p
            className="text-white/90 text-sm md:text-[15px] max-w-2xl mx-auto leading-tight tracking-wide"
            dangerouslySetInnerHTML={{ __html: description.replace(/\n/g, '<br />') }}
          />
        </motion.div>
      </div>
    </section>
  );
}
