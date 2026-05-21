'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';
import { 
  Coins, 
  Truck, 
  Users, 
  ClipboardList, 
  Factory, 
  BarChart3, 
  ShieldCheck, 
  UserCheck,
  ArrowRight,
  LucideIcon
} from 'lucide-react';

interface ErpModule {
  title: string;
  desc: string;
  iconColor: string;
  ctaLabel?: string;
  ctaUrl?: string;
}

interface ErpModulesGridContent {
  heading?: string;
  subheading?: string;
  modules?: ErpModule[];
}

interface ErpModulesGridProps {
  content?: ErpModulesGridContent;
}

// Icon mapper for the 8 standard modules
const iconMap: Record<number, LucideIcon> = {
  0: Coins,          // Finance
  1: Truck,          // Supply Chain
  2: Users,          // CRM
  3: ClipboardList,  // Project Management
  4: Factory,        // Manufacturing
  5: BarChart3,      // Analytics
  6: ShieldCheck,    // QA
  7: UserCheck,      // HR & Payroll
};

const colorMap: Record<string, { bg: string; text: string; border: string; hoverBorder: string; circle: string }> = {
  emerald: { bg: 'bg-emerald-50/40', text: 'text-emerald-700', border: 'border-emerald-100/80', hoverBorder: 'hover:border-emerald-300', circle: 'bg-emerald-100/60 text-emerald-700' },
  blue: { bg: 'bg-blue-50/40', text: 'text-blue-700', border: 'border-blue-100/80', hoverBorder: 'hover:border-blue-300', circle: 'bg-blue-100/60 text-blue-700' },
  purple: { bg: 'bg-purple-50/40', text: 'text-purple-700', border: 'border-purple-100/80', hoverBorder: 'hover:border-purple-300', circle: 'bg-purple-100/60 text-purple-700' },
  orange: { bg: 'bg-orange-50/40', text: 'text-orange-700', border: 'border-orange-100/80', hoverBorder: 'hover:border-orange-300', circle: 'bg-orange-100/60 text-orange-700' },
  teal: { bg: 'bg-teal-50/40', text: 'text-teal-700', border: 'border-teal-100/80', hoverBorder: 'hover:border-teal-300', circle: 'bg-teal-100/60 text-teal-700' },
  pink: { bg: 'bg-pink-50/40', text: 'text-pink-700', border: 'border-pink-100/80', hoverBorder: 'hover:border-pink-300', circle: 'bg-pink-100/60 text-pink-700' },
  indigo: { bg: 'bg-indigo-50/40', text: 'text-indigo-700', border: 'border-indigo-100/80', hoverBorder: 'hover:border-indigo-300', circle: 'bg-indigo-100/60 text-indigo-700' },
  green: { bg: 'bg-green-50/40', text: 'text-green-700', border: 'border-green-100/80', hoverBorder: 'hover:border-green-300', circle: 'bg-green-100/60 text-green-700' },
};

export function ErpModulesGrid({ content }: ErpModulesGridProps) {
  const heading = content?.heading || 'ERP Modules';
  const subheading = content?.subheading || 'Choose standard version or customizable version of our technology. ERP modules contribute to business growth in the following ways';
  const modules = content?.modules || [
    { title: 'FINANCE & TAX AUDIT', desc: 'Ensure compliance, gain audits and financial security.', iconColor: 'emerald', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'SUPPLY CHAIN & PROCUREMENT', desc: 'Ensure seamless supply chain, reduce storage cost, ready parts dynamically.', iconColor: 'blue', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'CUSTOMER RELATIONSHIP MANAGEMENT', desc: 'Ensure customer success, track lead pipeline, close deals faster.', iconColor: 'purple', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'PROJECT MANAGEMENT', desc: 'Manage projects efficiently, keep track of budgets and deliver on time.', iconColor: 'orange', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'MANUFACTURING PLANNING', desc: 'Optimize factory floors, automate billing materials, increase production capacity.', iconColor: 'teal', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'BI & ANALYTICS', desc: 'Generate executive dashboards, forecast sales, get real-time operational reports.', iconColor: 'pink', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'QUALITY ASSURANCE', desc: 'Ensure high-quality standards in manufacturing and operations.', iconColor: 'indigo', ctaLabel: 'READ MORE', ctaUrl: '#' },
    { title: 'HR & PAYROLL', desc: 'Manage attendance, payroll generation, track appraisals, and recruitment.', iconColor: 'green', ctaLabel: 'READ MORE', ctaUrl: '#' },
  ];

  // Grid container and item animations
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.98 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as any } 
    },
  };

  return (
    <section className="relative w-full py-24 md:py-32 bg-white overflow-hidden border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 md:mb-20 space-y-4">
          <MotionSection variant="fadeUp">
            <h2 className="text-3xl md:text-5xl font-extrabold text-[#4B2A63] tracking-tight">
              {heading}
            </h2>
          </MotionSection>
          
          <MotionSection variant="fadeUp" delay={0.15}>
            <p className="text-slate-500 text-lg font-light leading-relaxed">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* Modules Responsive Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-100px' }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {modules.map((module, idx) => {
            const colors = colorMap[module.iconColor] || colorMap.blue;
            const IconComponent = iconMap[idx] || ClipboardList;
            
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                className={`group flex flex-col justify-between p-6 md:p-8 rounded-[24px] border ${colors.border} ${colors.bg} ${colors.hoverBorder} shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(75,42,99,0.04)] transition-all duration-500 ease-[0.22,1,0.36,1] cursor-pointer`}
              >
                <div className="space-y-6">
                  {/* Dynamic Icon inside a circle */}
                  <div className={`w-12 h-12 rounded-2xl ${colors.circle} flex items-center justify-center transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}>
                    <IconComponent className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Text details */}
                  <div className="space-y-3">
                    <h3 className="text-base font-black tracking-wide text-[#4B2A63] leading-snug group-hover:text-slate-900 transition-colors duration-300">
                      {module.title}
                    </h3>
                    <p className="text-slate-500 text-[13px] font-medium leading-relaxed">
                      {module.desc}
                    </p>
                  </div>
                </div>

                {/* Read More dynamic CTA */}
                <div className="pt-6 mt-4 border-t border-slate-100/50 flex items-center gap-1 text-[11px] font-black tracking-widest text-[#4B2A63]/60 group-hover:text-[#4B2A63] transition-colors duration-300 uppercase">
                  <span>{module.ctaLabel || 'READ MORE'}</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
  );
}
