'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Factory, Monitor, LayoutDashboard, Coins, Layers, Users } from 'lucide-react';

const icons = [
  { icon: LineChart, label: 'SALES' },
  { icon: Factory, label: 'MANUFACTURING' },
  { icon: Monitor, label: 'FIXED ASSETS' },
  { icon: LayoutDashboard, label: 'CORPORATE PORTAL' },
  { icon: Coins, label: 'FINANCE' },
  { icon: Layers, label: 'MATERIALS' },
  { icon: Users, label: 'HUMAN CAPITAL' },
];

export default function ManufacturingIconRow() {
  return (
    <section className="bg-[#f4f4fc] py-14 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-wrap lg:flex-nowrap justify-center gap-3">
          {icons.map((item, i) => {
            const Icon = item.icon;
            const isActive = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative flex-1 min-w-[130px] aspect-square lg:aspect-auto lg:h-[130px] flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer rounded-2xl ${isActive
                  ? 'bg-[#27256b] text-white shadow-lg'
                  : 'bg-white border border-slate-200 hover:border-[#27256b]/30 hover:shadow-md'
                  }`}
              >
                <Icon
                  strokeWidth={1.5}
                  className={`w-10 h-10 ${isActive ? 'text-[#FFD600]' : 'text-[#27256b]'}`}
                />
                <span
                  className={`text-[12px] font-semibold uppercase ${isActive ? 'text-[#FFD600]' : 'text-[#27256b]'}`}
                >
                  {item.label}
                </span>

                {/* Active Indicator Triangle */}
                {isActive && (
                  <div className="absolute -bottom-[12px] left-1/2 -translate-x-1/2 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-[#27256b]" />
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
