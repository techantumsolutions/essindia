'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ManufacturingEfficiency() {
  const capabilities = [
    'Improve Production Efficiency',
    'Reduce Manufacturing Costs',
    'Minimize Machine Downtime',
    'Optimize Inventory Levels',
    'Increase Real-Time Visibility',
    'Improve Product Quality',
    'Faster Decision Making',
    'Better Resource Utilization'
  ];

  return (
    <section className="py-0 bg-[#f1f7fe] overflow-hidden">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-1/2 space-y-4"
          >
            <div className="space-y-2">
              <div className="text-[14px] font-bold text-slate-900">
                Key capabilities
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold text-[#27256b] leading-[1.1] tracking-tight">
                Drive Efficiency. Reduce Costs.<br />
                Maximize Performance
              </h2>
              <p className="text-slate-600 text-[17px] max-w-xl pb-2">
                The original feature list is preserved, but grouped around decisions a plant team makes: how to define the product, how to schedule work, how to run the shift, and how to learn from what happened.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
              {capabilities.map((item, i) => (
                <div
                  key={i}
                  className="bg-transparent border-[1px] border-[#27256b] px-4 py-2 rounded-xl text-center transition-all hover:bg-[#27256b]/5 flex items-center justify-center shadow-sm"
                >
                  <span className="text-[14px] font-bold text-black">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="w-full lg:w-1/2 relative flex justify-end"
          >
            <img
              src="/Modules-manufacturing/Eifficiency.png"
              alt="Dashboard Capabilities"
              className="w-full h-full object-contain drop-shadow-2xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
