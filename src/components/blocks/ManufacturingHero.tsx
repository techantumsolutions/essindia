'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ManufacturingHero() {
  return (
    <section className="relative bg-[#27256b] text-white px-6 overflow-hidden py-14">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 pt-20 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center rounded-full border border-white/20 bg-[#391781] px-5 py-2 text-xs font-semibold text-white mb-8">
              Lorem ipsum ERP
            </div>

            <h1 className="text-[3rem] md:text-[4rem] leading-[1.1] font-light tracking-wide text-white mb-6">
              Loremipsum <br />
              Loremipsum <br />
              Lorem ipsum <br />
              Loremipsum
            </h1>

            <p className="text-white/80 text-[15px] max-w-[480px] leading-relaxed mb-10">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#FFD600] text-[#29245C] hover:bg-[#F0C800] px-8 py-3.5 cursor-pointer rounded-full text-sm font-bold transition-colors shadow-lg shadow-[#FFD600]/20">
                Lorem ipsum
              </button>
              <button className="bg-white text-[#29245C] hover:bg-slate-50 px-8 py-3.5 cursor-pointer rounded-full text-sm font-bold transition-colors">
                Lorem ipsum
              </button>
            </div>
          </motion.div>

          {/* Right Content - Visuals */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative w-full flex items-center justify-center lg:justify-end mt-12 lg:mt-0"
          >
            <img
              src="/Modules-manufacturing/Banner-image.png"
              alt="Manufacturing ERP Automation"
              className="w-full lg:w-[120%] max-w-full lg:max-w-none object-contain"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
