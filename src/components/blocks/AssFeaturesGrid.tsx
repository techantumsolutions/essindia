'use client';

import React from 'react';
import Image from 'next/image';

interface Feature {
  icon?: string;
  title?: string;
  description?: string;
}

interface AssFeaturesGridContent {
  title?: string;
  features?: Feature[];
}

export function AssFeaturesGrid({ content }: { content?: AssFeaturesGridContent }) {
  const title = content?.title || 'Powerful Features for Modern Service Teams';
  const features = content?.features || [
    { icon: '/App-After Sales Service/Image-1.png', title: 'Smart Scheduling', description: 'Intelligent scheduling engine that considers travel time, skills, and priority to optimize field visits.' },
    { icon: '/App-After Sales Service/Image-2.png', title: 'Parts & Inventory', description: 'Manage spare parts inventory, track usage, and automate reorder points for uninterrupted service.' },
    { icon: '/App-After Sales Service/Image-3.png', title: 'Knowledge Base', description: 'Equip field teams with step-by-step guides, manuals, and troubleshooting resources on-the-go.' },
    { icon: '/App-After Sales Service/Image-4.png', title: 'Digital Signatures', description: 'Capture customer signatures digitally for service completion, warranties, and compliance.' },
    { icon: '/App-After Sales Service/Image-5.png', title: 'Warranty Management', description: 'Track warranty periods, automate claims processing, and manage entitlements effortlessly.' },
    { icon: '/App-After Sales Service/Image-6.png', title: 'Preventive Maintenance', description: 'Schedule proactive maintenance visits before breakdowns occur with predictive insights.' },
    { icon: '/App-After Sales Service/Image-7.png', title: 'Live Location Tracking', description: 'Monitor field executive locations in real-time for better coordination and response times.' },
    { icon: '/App-After Sales Service/Image-8.png', title: 'Analytics Dashboard', description: 'Rich dashboards with KPIs, trends, and actionable insights for data-driven decisions.' },
  ];

  return (
    <section className="p-14 px-6 bg-[#f8f9fb]">
      <div className="container mx-auto max-w-7xl">
        <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] text-center mb-14 leading-tight">
          {title}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature: Feature, idx: number) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-lg hover:border-[#3b82f6]/20 transition-all duration-300 group"
            >
              {feature.icon && (
                <div className="w-11 h-11 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-4 group-hover:bg-[#3b82f6]/10 transition-colors">
                  <Image src={feature.icon} alt="" width={22} height={22} className="object-contain" />
                </div>
              )}
              <h3 className="text-[15px] font-bold text-[#0f172a] mb-2">{feature.title}</h3>
              <p className="text-xs text-slate-500 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
