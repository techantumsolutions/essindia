'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface PointItem {
  title?: string;
  description?: string;
}

export interface UgandaControlContent {
  subtitle?: string;
  title?: string;
  desc1?: string;
  desc2?: string;
  image?: string;
  points?: PointItem[];
}

const DEFAULT_POINTS: PointItem[] = [
  {
    title: 'Regional branch visibility',
    description: 'Track sales, stock, collections, purchases, and approvals across Kampala, upcountry branches, and regional distribution networks.',
  },
  {
    title: 'Faster, cleaner reporting',
    description: 'Standardize ledgers, cost centers, budgeting, audit trails, and management dashboards to shorten reporting cycles.',
  },
  {
    title: 'Process controls built in',
    description: 'Use role-based access, approval hierarchies, document workflows, and exception alerts to keep decisions accountable.',
  },
];

export function UgandaControl({ content }: { content?: UgandaControlContent }) {
  const subtitle = content?.subtitle || 'Why Uganda teams choose ERP';
  const title = content?.title || 'Replace disconnected tools with governed, real-time business control.';
  const desc1 = content?.desc1 || "Over the years, ebizframe ERP has stood steadfast with Uganda's Enterprise in its march towards growth and development for many years. ebizframe has contributed significantly to the automation of several Ugandan enterprises and bringing them face to face with the world's leading technology platforms and IT solutions.";
  const desc2 = content?.desc2 || 'It is therefore not surprising that ebizframe is the no. 1 ERP Solution in the mid-segment in East Africa.';
  const image = content?.image || '/About-Uganda/Background+Border+Shadow.png';
  const points = (content?.points?.length ? content.points : DEFAULT_POINTS).slice(0, 3);

  return (
    <section className="w-full py-14 bg-white flex items-center justify-center border-b">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-stretch">
          {/* Left Column: Text & Points */}
          <div className="flex flex-col justify-center space-y-3 text-left">
            {subtitle && (
              <span className="text-sm font-semibold text-slate-600 tracking-tight">
                {subtitle}
              </span>
            )}
            {title && (
              <h2 className="text-2xl sm:text-[34px] leading-tight font-extrabold text-[#1d1b4b] tracking-tight">
                {title}
              </h2>
            )}
            {(desc1 || desc2) && (
              <div className="space-y-2 text-xs sm:text-sm text-slate-500 leading-relaxed max-w-xl">
                {desc1 && <p>{desc1}</p>}
                {desc2 && <p>{desc2}</p>}
              </div>
            )}

            {/* Points List */}
            <div className="space-y-2 pt-4">
              {points.map((point, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                  className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-[#fbfcfd]"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-[#1d1b4b] flex items-center justify-center text-white">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    {point.title && (
                      <h4 className="text-sm sm:text-base font-bold text-slate-800 mb-1">
                        {point.title}
                      </h4>
                    )}
                    {point.description && (
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                        {point.description}
                      </p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right Column: Dashboard Mockup Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative flex items-center justify-center w-full min-h-[400px] lg:min-h-full"
          >
            <div className="relative w-full h-full min-h-[400px] lg:min-h-[500px]">
              {image && (
                <Image
                  src={image}
                  alt="Governance & Control Showcase"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
