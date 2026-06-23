'use client';

import React from 'react';
import Image from 'next/image';

interface EnterpriseCard {
  icon?: string;
  title?: string;
  description?: string;
}

interface AssEnterpriseContent {
  title?: string;
  description?: string;
  cards?: EnterpriseCard[];
}

export function AssEnterprise({ content }: { content?: AssEnterpriseContent }) {
  const title = content?.title || 'Enterprise-Level Service Automation';
  const description = content?.description || 'Comprehensive tools to digitize every aspect of your after-sales operations';
  const cards = content?.cards || [
    { icon: '/App-After Sales Service/Image-9.png', title: 'Complaint Registration', description: 'Register and categorize customer complaints from multiple channels with automated routing.' },
    { icon: '/App-After Sales Service/Image-10.png', title: 'Service Executive Assignment', description: 'Automatically assign complaints to the right service executive based on skills and location.' },
    { icon: '/App-After Sales Service/Image-11.png', title: 'Real-Time Tracking', description: 'Track complaint resolution progress in real-time with status updates and notifications.' },
    { icon: '/App-After Sales Service/Image-12.png', title: 'Customer Feedback', description: 'Collect and analyze customer feedback to continuously improve service quality.' },
    { icon: '/App-After Sales Service/Image-13.png', title: 'Service Reports', description: 'Generate comprehensive reports on service performance, SLA compliance, and trends.' },
    { icon: '/App-After Sales Service/Image-14.png', title: 'Expense Management', description: 'Track and manage service-related expenses with automated approval workflows.' },
  ];

  return (
    <section className="p-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0f172a] mb-4 leading-tight">
            {title}
          </h2>
          {description && (
            description.includes('<p>') ? (
              <div className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: description }} />
            ) : (
              <p className="text-base text-slate-500 max-w-2xl mx-auto leading-relaxed">{description}</p>
            )
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card: EnterpriseCard, idx: number) => (
            <div
              key={idx}
              className="group bg-white rounded-2xl border border-slate-100 p-7 hover:shadow-lg hover:border-[#3b82f6]/20 transition-all duration-300"
            >
              {card.icon && (
                <div className="w-12 h-12 rounded-xl bg-[#eef2ff] flex items-center justify-center mb-5 group-hover:bg-[#3b82f6]/10 transition-colors">
                  <Image src={card.icon} alt="" width={24} height={24} className="object-contain" />
                </div>
              )}
              <h3 className="text-lg font-bold text-[#0f172a] mb-2">{card.title}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
