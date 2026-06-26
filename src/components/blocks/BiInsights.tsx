'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Database,
  FileWarning,
  TrendingUp,
  ShieldCheck,
  Users,
  HelpCircle,
  FileText,
  AlertCircle,
  CheckCircle2,
  LineChart,
  BarChart3,
  Layers,
  Zap,
  Activity,
  LucideIcon
} from 'lucide-react';

const iconMap: Record<string, LucideIcon> = {
  database: Database,
  'file-warning': FileWarning,
  'trending-up': TrendingUp,
  'shield-check': ShieldCheck,
  users: Users,
  'file-text': FileText,
  'alert-circle': AlertCircle,
  'check-circle': CheckCircle2,
  'line-chart': LineChart,
  'bar-chart': BarChart3,
  layers: Layers,
  zap: Zap,
  activity: Activity,
  help: HelpCircle
};

interface InsightItem {
  icon?: string;
  text?: string;
}

interface BiInsightsContent {
  title?: string;
  items?: InsightItem[];
  rightImage?: string;
}

export function BiInsights({ content }: { content?: BiInsightsContent }) {
  const title = content?.title || 'Turning Business Data Into Clear, Actionable Insights';
  const rightImage = content?.rightImage || '/Business intilligence/image 44.png';

  const defaultItems: InsightItem[] = [
    {
      icon: 'database',
      text: 'We turn scattered business data into clear, reliable, and actionable insights—so you understand what is happening, why it is happening, and what to do next on time.'
    },
    {
      icon: 'file-warning',
      text: 'Many organizations struggle with slow decision-making because data is spread across CRM, ERP, accounting systems, and spreadsheets, making reports hard to trust and insights slow to act on.'
    },
    {
      icon: 'trending-up',
      text: 'We solve this by analyzing your past and current data across systems and building custom BI dashboards tailored to your goals—using pre-built KPIs and dashboards to reduce implementation time and cost.'
    },
    {
      icon: 'shield-check',
      text: 'This creates a single source of truth that is continuously updated and easy to trust.'
    },
    {
      icon: 'users',
      text: 'Our BI services are built for leaders and teams in sales, finance, operations, and management who need fast, accurate insights to make confident decisions.'
    }
  ];

  const items = content?.items && content.items.length > 0 ? content.items : defaultItems;

  return (
    <section className="py-14 bg-[#f6f6f6] overflow-hidden">
      <div className="container mx-auto max-w-7xl px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

          {/* Left Column: Text & List Items */}
          <div className="flex-1 text-left space-y-4 lg:max-w-2xl">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-extrabold text-[#301c5c] tracking-tight leading-tight"
            >
              {title}
            </motion.h2>

            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
              className="divide-y divide-slate-200"
            >
              {items.map((item, index) => {
                const IconComponent = iconMap[item.icon?.toLowerCase() || ''] || HelpCircle;
                return (
                  <motion.div
                    key={index}
                    variants={{
                      hidden: { opacity: 0, x: -20 },
                      show: { opacity: 1, x: 0, transition: { duration: 0.4 } }
                    }}
                    className="flex items-start gap-5 py-3 first:pt-0 last:pb-0 group"
                  >
                    {/* Rounded Icon Container */}
                    <div className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center bg-[#eae8f5] text-[#5e35b1] group-hover:bg-[#5e35b1] group-hover:text-white transition-all duration-300 shadow-sm">
                      <IconComponent className="w-5 h-5" />
                    </div>

                    {/* Item Text */}
                    <p className="text-[15px] sm:text-base text-slate-600 font-light leading-relaxed pt-1">
                      {item.text}
                    </p>
                  </motion.div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Column: Illustration Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 30 }}
            whileInView={{ opacity: 1, scale: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex-1 flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-lg aspect-[5/4] sm:aspect-[4/3] lg:aspect-auto lg:h-[580px]">
              <Image
                src={rightImage}
                alt="Business Intelligence Insights Illustration"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
