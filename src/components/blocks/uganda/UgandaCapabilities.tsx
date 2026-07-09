'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface CapabilityCard {
  icon?: string;
  title?: string;
  description?: string;
}

export interface UgandaCapabilitiesContent {
  subtitle?: string;
  title?: string;
  description?: string;
  cards?: CapabilityCard[];
}

const DEFAULT_CARDS: CapabilityCard[] = [
  {
    icon: '/About-Uganda/Frame 276.png',
    title: 'Financial Command',
    description: 'General ledger, receivables, payables, fixed assets, cash flow, budgets, and consolidated reporting.',
  },
  {
    icon: '/About-Uganda/Frame 277.png',
    title: 'Supply chain clarity',
    description: 'Purchasing, vendor management, inventory movement, reorder planning, landed cost, and stock reconciliation.',
  },
  {
    icon: '/About-Uganda/Frame 278.png',
    title: 'Order-to-cash flow',
    description: 'Quotations, orders, pricing controls, dispatch, invoicing, collections, and customer performance tracking.',
  },
  {
    icon: '/About-Uganda/bill-receipt_svgrepo.com.png',
    title: 'Production planning',
    description: 'Bill of materials, shop-floor controls, quality checks, job costing, and production visibility for manufacturers.',
  },
  {
    icon: '/About-Uganda/Frame 280.png',
    title: 'People operations',
    description: 'Employee records, payroll workflows, leave, attendance, role structures, and workforce reporting.',
  },
  {
    icon: '/About-Uganda/Frame 279.png',
    title: 'Analytics and alerts',
    description: 'Executive dashboards, exception reports, performance scorecards, and alerts that surface what needs attention.',
  },
];

export function UgandaCapabilities({ content }: { content?: UgandaCapabilitiesContent }) {
  const subtitle = content?.subtitle || 'Key Benefits';
  const title = content?.title || 'Core enterprise capabilities,\nredesigned around everyday work.';
  const description = content?.description || 'ERP value is grouped into outcome-led cards that are easy for leaders, finance teams, and operations teams to scan.';
  const cards = (content?.cards?.length ? content.cards : DEFAULT_CARDS).slice(0, 6);

  return (
    <section className="w-full py-14 bg-[#f5f7fb] flex flex-col items-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl text-center">
        {subtitle && (
          <span className="inline-block text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-500 mb-3">
            {subtitle}
          </span>
        )}
        {title && (
          <h2 className="text-2xl sm:text-[34px] font-bold text-[#1d1b4b] mb-4 tracking-tight max-w-3xl mx-auto leading-tight whitespace-pre-line">
            {title}
          </h2>
        )}
        {description && (
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-2xl mx-auto mb-12">
            {description}
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {cards.map((card, index) => (
            <motion.article
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="flex flex-col rounded-2xl p-8 text-left bg-white shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300 min-h-[220px]"
            >
              {card.icon && (
                <div className="relative w-12 h-12 mb-6">
                  <Image
                    src={card.icon}
                    alt={card.title || 'Capability Icon'}
                    fill
                    className="object-contain"
                    sizes="48px"
                  />
                </div>
              )}
              {card.title && (
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-3">
                  {card.title}
                </h3>
              )}
              {card.description && (
                <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                  {card.description}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
