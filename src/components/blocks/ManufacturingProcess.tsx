'use client';

import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  { img: '/Modules-manufacturing/Production flow-1.png', label: 'DEMAND', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { img: '/Modules-manufacturing/Production flow-2.png', label: 'PLAN', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { img: '/Modules-manufacturing/Production flow-3.png', label: 'EXECUTE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
  { img: '/Modules-manufacturing/Production flow-4.png', label: 'IMPROVE', desc: 'Quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliqu ipsum lorem.' },
];

export default function ManufacturingProcess() {
  return (
    <section className="py-14 bg-white px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-8 space-y-2">
          <div className="text-[14px] font-bold text-slate-900">
            Process ipsum
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#27256b] tracking-tight">
            Lorem ipsum dolor sit amet, consectetur.
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto text-[15px]">
            Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea nisi ut aliquip
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex flex-col items-center text-center relative group"
            >
              <div className="relative mb-2 z-10 transition-transform group-hover:scale-105">
                <img src={step.img} alt={step.label} className="w-[160px] h-[160px] object-contain mx-auto" />
              </div>

              <h3 className="text-[16px] font-extrabold text-[#27256b] uppercase mb-2">{step.label}</h3>
              <p className="text-[12.5px] text-slate-500 leading-snug max-w-[210px]">
                {step.desc}
              </p>

              {/* Connecting line for desktop */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-[79px] left-[calc(50%+50px)] w-[calc(100%-50px)] border-t-[1.5px] border-[#b0b4d4] z-0" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
