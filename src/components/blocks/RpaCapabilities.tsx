'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CapabilityItem {
  title: string;
  description: string;
  icon: string;
}

interface RpaCapabilitiesContent {
  title?: string;
  description?: string;
  items?: CapabilityItem[];
}

export function RpaCapabilities({ content }: { content?: RpaCapabilitiesContent }) {
  const title = content?.title || 'ESS RPA Offerings / Capabilities';
  const description = content?.description || 'From consulting and design to bot deployment and maintenance, we offer end-to-end RPA capabilities.';

  const defaultItems: CapabilityItem[] = [
    { title: 'RPA Advisory', description: 'Identify and analyze workflows to construct a feasibility roadmap for robotic automation.', icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png' },
    { title: 'Bot Development', description: 'Build resilient software bots using modern RPA tools to mimic user clicks and actions.', icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png' },
    { title: 'System Integration', description: 'Connect software bots smoothly with legacy ERPs, CRMs, web portals, and databases.', icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png' },
    { title: 'Bot Support', description: 'Monitor bot logs daily, manage credential handshakes, and fix run-time errors.', icon: '/RPA-Robotic Process Automation (RPA)/problem-process-solution_svgrepo.com.png' },
    { title: 'Intelligent Automation', description: 'Fuse RPA with AI models (OCR, Document Parser) to manage unstructured forms.', icon: '/RPA-Robotic Process Automation (RPA)/exchange-personel_svgrepo.com.png' },
    { title: 'Process Mining', description: 'Discover automation pipelines by recording real-time actions and tracking paths.', icon: '/RPA-Robotic Process Automation (RPA)/time-progress_svgrepo.com.png' }
  ];

  const items = content?.items && content.items.length === 6 ? content.items : defaultItems;

  return (
    <section className="py-16 md:py-24 bg-slate-50 overflow-hidden font-sans border-b">
      <div className="container mx-auto max-w-7xl px-6">
        
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          {title && (
            <motion.h2 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-[#27256b] tracking-tight leading-tight"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-500 font-light text-base sm:text-lg leading-relaxed max-w-xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Desktop View: Hub and Spoke Wheel Layout */}
        <div className="hidden lg:flex justify-center items-center h-[540px] relative w-full max-w-[850px] mx-auto select-none">
          {/* Central Hub Core */}
          <div className="absolute z-20 w-44 h-44 rounded-full bg-white shadow-xl border border-slate-100 flex flex-col items-center justify-center p-6 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">
              ESS INDIA
            </span>
            <span className="text-lg font-black text-[#27256b] leading-tight mt-1">
              RPA Core Offerings
            </span>
          </div>

          {/* Spokes (Connecting lines) */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <svg className="w-full h-full" viewBox="0 0 850 540" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="5 5">
              <line x1="425" y1="270" x2="425" y2="70" />
              <line x1="425" y1="270" x2="425" y2="470" />
              <line x1="425" y1="270" x2="160" y2="170" />
              <line x1="425" y1="270" x2="690" y2="170" />
              <line x1="425" y1="270" x2="160" y2="370" />
              <line x1="425" y1="270" x2="690" y2="370" />
            </svg>
          </div>

          {/* Node 1: Top Center */}
          <div className="absolute top-[10px] left-[50%] -translate-x-[50%] z-10 w-[240px]">
            <CapabilityNode item={items[0]} index={1} alignment="center" />
          </div>

          {/* Node 2: Top Right */}
          <div className="absolute top-[110px] right-[40px] z-10 w-[240px]">
            <CapabilityNode item={items[1]} index={2} alignment="right" />
          </div>

          {/* Node 3: Bottom Right */}
          <div className="absolute bottom-[110px] right-[40px] z-10 w-[240px]">
            <CapabilityNode item={items[2]} index={3} alignment="right" />
          </div>

          {/* Node 4: Bottom Center */}
          <div className="absolute bottom-[10px] left-[50%] -translate-x-[50%] z-10 w-[240px]">
            <CapabilityNode item={items[3]} index={4} alignment="center" />
          </div>

          {/* Node 5: Bottom Left */}
          <div className="absolute bottom-[110px] left-[40px] z-10 w-[240px]">
            <CapabilityNode item={items[4]} index={5} alignment="left" />
          </div>

          {/* Node 6: Top Left */}
          <div className="absolute top-[110px] left-[40px] z-10 w-[240px]">
            <CapabilityNode item={items[5]} index={6} alignment="left" />
          </div>
        </div>

        {/* Mobile / Tablet View: Vertical grid list */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:hidden">
          {items.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.05 }}
              className="bg-white rounded-2xl p-5 border border-slate-100 flex items-start gap-4 shadow-sm text-left"
            >
              {item.icon && (
                <div className="w-12 h-12 relative flex-shrink-0 bg-blue-50/50 rounded-xl flex items-center justify-center">
                  <div className="w-6 h-6 relative">
                    <Image
                      src={item.icon}
                      alt={item.title}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
              <div className="space-y-1">
                <h4 className="text-base font-bold text-slate-800">
                  {item.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-500 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}

function CapabilityNode({ item, index, alignment }: { item: CapabilityItem; index: number; alignment: 'left' | 'right' | 'center' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className={`flex flex-col items-center space-y-2 p-4 bg-white rounded-2xl border border-slate-100 shadow-md hover:shadow-lg transition-shadow duration-300 w-full ${
        alignment === 'left' ? 'text-left lg:items-start' : alignment === 'right' ? 'text-right lg:items-end' : 'text-center'
      }`}
    >
      {item.icon && (
        <div className="w-12 h-12 relative bg-blue-50/50 rounded-xl flex items-center justify-center shadow-sm">
          <div className="w-6 h-6 relative">
            <Image
              src={item.icon}
              alt={item.title}
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}
      <div className="space-y-0.5 w-full">
        <h4 className="text-sm font-bold text-[#27256b]">
          {item.title}
        </h4>
        <p className="text-[11px] text-slate-500 leading-normal font-light">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}
