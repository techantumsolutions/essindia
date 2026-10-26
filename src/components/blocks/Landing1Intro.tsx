'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Wallet,
  ShoppingBag,
  Package,
  Factory,
  Users,
  Briefcase,
  FolderKanban,
  LineChart,
  Check
} from 'lucide-react';

export interface ModuleItem {
  name: string;
  iconType: 'finance' | 'sales' | 'inventory' | 'mfg' | 'crm' | 'hr' | 'projects' | 'analytics';
}

export interface Landing1IntroContent {
  badge?: string;
  titlePart1?: string;
  titlePart2?: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
  ctaPdfUrl?: string;
  introModules?: ModuleItem[];
}

const DEFAULT_MODULES: ModuleItem[] = [
  { name: 'Finance', iconType: 'finance' },
  { name: 'Sales', iconType: 'sales' },
  { name: 'Inventory', iconType: 'inventory' },
  { name: 'Manufacturing', iconType: 'mfg' },
  { name: 'CRM', iconType: 'crm' },
  { name: 'HR', iconType: 'hr' },
  { name: 'Projects', iconType: 'projects' },
  { name: 'Analytics', iconType: 'analytics' },
];

const DEFAULT_CONTENT: Landing1IntroContent = {
  badge: 'HOW ESS ERP SOLVES IT',
  titlePart1: 'One Platform. ',
  titlePart2: 'Complete Business Control.',
  description: 'Connect every department on a single source of truth. Data flows automatically across modules — no double entry, no reconciliations, no surprises.',
  image: '/Landing page1/assets/image 381.png',
  ctaText: 'Explore ERP Modules',
  ctaUrl: '#features',
  introModules: DEFAULT_MODULES,
};

const renderModuleIcon = (type: string) => {
  const iconClass = "w-4 h-4 text-[#4B2A63]";
  switch (type) {
    case 'finance':
      return <Wallet className={iconClass} />;
    case 'sales':
      return <ShoppingBag className={iconClass} />;
    case 'inventory':
      return <Package className={iconClass} />;
    case 'mfg':
      return <Factory className={iconClass} />;
    case 'crm':
      return <Users className={iconClass} />;
    case 'hr':
      return <Briefcase className={iconClass} />;
    case 'projects':
      return <FolderKanban className={iconClass} />;
    case 'analytics':
      return <LineChart className={iconClass} />;
    default:
      return <Wallet className={iconClass} />;
  }
};

import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

export function Landing1Intro({ content }: { content?: Landing1IntroContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  const ctaFormType = (data.ctaFormType || '') as CtaFormType;
  const { handleClick, modalNode } = useCtaAction(
    data.ctaUrl || '/contact-us',
    ctaFormType,
    data.ctaPdfUrl
  );

  return (
    <section className="py-12 border-t border-b bg-white font-sans select-none">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Side: Mockup Image */}
          <div className="lg:col-span-5 relative flex justify-center">
            <div className="relative aspect-square w-full max-w-[460px] rounded-3xl overflow-hidden border border-slate-100/60 shadow-xl bg-slate-50">
              {data.image && (
                <Image
                  src={data.image}
                  alt="ESS ERP Live Workflow Diagram"
                  fill
                  className="object-contain p-4"
                  priority
                />
              )}
            </div>
          </div>

          {/* Right Side: Copy & Grid */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Badge */}
            {data.badge && (
              <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-semibold tracking-wider text-[#4B2A63] bg-[#EAE5F4]/60 border border-[#E3DCF5]/50 uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#4B2A63]" />
                {data.badge}
              </span>
            )}

            {/* Heading */}
            <h2 className="text-3xl md:text-[40px] font-bold leading-tight tracking-tight">
              <span className="text-[#0D265C]">{data.titlePart1}</span>
              <span className="text-[#4B2A63]">{data.titlePart2}</span>
            </h2>

            {/* Description */}
            {data.description && (
              <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                {data.description}
              </p>
            )}

            {/* Grid of Modules */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {data.introModules?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-xl border border-slate-100 shadow-sm bg-white hover:border-[#E3DCF5] transition-all"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F5F2F9] flex items-center justify-center shrink-0">
                      {renderModuleIcon(item.iconType)}
                    </div>
                    <span className="font-semibold text-slate-800 text-sm">{item.name}</span>
                  </div>
                  <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                </div>
              ))}
            </div>

            {/* CTA Button */}
            {data.ctaText && (
              <div className="pt-4">
                <a
                  href={data.ctaUrl || '/contact-us'}
                  onClick={ctaFormType ? (e) => { e.preventDefault(); handleClick(); } : undefined}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-semibold text-white bg-[#4B2A63] hover:bg-[#3D2152] transition-colors shadow-md hover:shadow-lg cursor-pointer"
                >
                  <span>{data.ctaText}</span>
                  <span>→</span>
                </a>
              </div>
            )}

          </div>

        </div>
      </div>
      {modalNode}
    </section>
  );
}
