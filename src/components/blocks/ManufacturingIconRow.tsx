'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LineChart, Factory, Monitor, LayoutDashboard, Coins, Layers, Users, Circle } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  'LineChart': LineChart,
  'Factory': Factory,
  'Monitor': Monitor,
  'LayoutDashboard': LayoutDashboard,
  'Coins': Coins,
  'Layers': Layers,
  'Users': Users,
};

const defaultIcons = [
  { iconName: 'LineChart', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'Factory', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'Monitor', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'LayoutDashboard', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'Coins', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'Layers', iconImage: '', label: 'Lorem ipsum' },
  { iconName: 'Users', iconImage: '', label: 'Lorem ipsum' },
];

export default function ManufacturingIconRow({ content }: { content?: any }) {
  const icons = content?.icons || defaultIcons;

  return (
    <section className="bg-[#f4f4fc] py-14 px-6">
      <div className="container mx-auto max-w-7xl">
        <div className="flex overflow-x-auto lg:overflow-x-visible lg:flex-nowrap justify-start lg:justify-center gap-3 pb-4 snap-x snap-mandatory hide-scrollbar">
          {icons.map((item: any, i: number) => {
            const Icon = ICON_MAP[item.iconName] || Circle;
            const isActive = i === 0;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className={`relative w-[130px] shrink-0 lg:flex-1 snap-start aspect-square lg:aspect-auto lg:h-[130px] flex flex-col items-center justify-center gap-3 text-center transition-all cursor-pointer rounded-[20px] ${isActive
                  ? 'bg-[#27256b] text-white shadow-lg'
                  : 'bg-white border border-slate-200 hover:border-[#27256b]/30 hover:shadow-md'
                  }`}
              >
                {item.iconImage ? (
                  <img
                    src={item.iconImage}
                    alt={item.label}
                    className="w-10 h-10 object-contain"
                  />
                ) : (
                  <Icon
                    strokeWidth={1.5}
                    className={`w-10 h-10 ${isActive ? 'text-[#FFD600]' : 'text-[#27256b]'}`}
                  />
                )}
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
