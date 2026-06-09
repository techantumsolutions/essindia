'use client';

import React from 'react';
import { motion } from 'framer-motion';

export function EmployeeSpotlightHero({ content }: { content?: any }) {
  return (
    <section className="relative min-h-[400px] flex items-center justify-center overflow-hidden px-6 py-24 lg:py-14">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url("/About-employee spot light/banner.png")` }}
      >
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="container mx-auto px-4 relative z-10 flex flex-col items-center text-center mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center rounded-full bg-white px-8 py-2 text-sm font-medium text-[#0D1A5C] mb-8 cursor-pointer hover:bg-slate-50 transition-colors shadow-lg">
            Employee Spotlight
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-[64px] font-light tracking-wide text-white mb-6 max-w-4xl mx-auto leading-[1.2]">
            Everyday Heroes. Greener
            <br />
            Tomorrow.
          </h1>

          <p className="text-white/90 text-sm md:text-base max-w-3xl mx-auto leading-relaxed tracking-wide">
            At ESS, sustainability isn't just a choice—it's a lifestyle. Meet the trailblazers among us who are leading the charge for a cleaner planet. From daily cycles to inspiring runs, discover how our team is turning eco-conscious choices into habits that matter.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
