'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function ManufacturingHero() {
  return (
    <section className="relative bg-[#27256b] text-white px-6 overflow-hidden py-14">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl"
          >
            <div className="inline-flex items-center rounded-full border border-white/20 bg-[#391781] px-5 py-2 text-xs font-semibold text-white mb-8">
              ebizframe manufacturing ERP
            </div>

            <h1 className="text-[3rem] md:text-[4rem] leading-[1.1] font-light tracking-wide text-white mb-6">
              Transform <br />
              Manufacturing <br />
              with Intelligent <br />
              ERP Automation
            </h1>

            <p className="text-white/80 text-[15px] max-w-[480px] leading-relaxed mb-10">
              ESS India Manufacturing ERP helps businesses streamline production,
              optimize resources, reduce downtime, and gain real-time visibility across
              the entire manufacturing lifecycle.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <button className="bg-[#FFD600] text-[#29245C] hover:bg-[#F0C800] px-8 py-3.5 cursor-pointer rounded-full text-sm font-bold transition-colors shadow-lg shadow-[#FFD600]/20">
                Talk to an expert
              </button>
              <button className="bg-white text-[#29245C] hover:bg-slate-50 px-8 py-3.5 cursor-pointer rounded-full text-sm font-bold transition-colors">
                Explore Module
              </button>
            </div>
          </motion.div>

          {/* Right Content - Visuals */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative h-full w-full hidden lg:flex items-center justify-end"
          >
            <img
              src="/Modules-manufacturing/Banner-image.png"
              alt="Manufacturing ERP Automation"
              className="w-[120%] max-w-none object-contain -mr-16"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
