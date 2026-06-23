'use client';

import React from 'react';
import Image from 'next/image';

interface WhyItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface AssWhyChooseContent {
  title?: string;
  description?: string;
  items?: WhyItem[];
}

export function AssWhyChoose({ content }: { content?: AssWhyChooseContent }) {
  const title = content?.title || 'Why Choose Our After-Sales Service Platform?';
  const description = content?.description || 'Built for enterprises that demand reliability, scalability, and intelligent automation in their service operations.';
  const items = content?.items || [
    { icon: '/App-After Sales Service/Image-9.png', title: 'AI-Powered Routing', description: 'Intelligent complaint assignment based on location, skillset, and workload.' },
    { icon: '/App-After Sales Service/Image-10.png', title: 'Multi-Channel Support', description: 'Accept complaints via app, web portal, email, or phone — all unified.' },
    { icon: '/App-After Sales Service/Image-11.png', title: 'SLA Management', description: 'Define and enforce service-level agreements with automated escalations.' },
    { icon: '/App-After Sales Service/Image-12.png', title: 'Offline Capability', description: 'Field executives can work offline and sync data when connectivity is restored.' },
    { icon: '/App-After Sales Service/Image-13.png', title: 'Custom Workflows', description: 'Design custom service workflows tailored to your business processes.' },
    { icon: '/App-After Sales Service/Image-14.png', title: 'Integration Ready', description: 'Seamlessly integrate with ERP, CRM, and inventory management systems.' },
  ];

  return (
    <section className="p-14 px-6 bg-[#0f172a]">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
            {title}
          </h2>
          {description && (
            description.includes('<p>') ? (
              <div className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-base text-slate-400 max-w-2xl mx-auto leading-relaxed">{description}</p>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item: WhyItem, idx: number) => (
            <div
              key={idx}
              className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-7 hover:bg-white/10 transition-all duration-300"
            >
              {item.icon && (
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-5">
                  <Image src={item.icon} alt="" width={24} height={24} className="object-contain brightness-0 invert" />
                </div>
              )}
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
