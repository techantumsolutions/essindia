'use client';

import React from 'react';
import Image from 'next/image';

interface SolutionItem {
  icon?: string;
  title?: string;
  description?: string;
}

interface AomSolutionsContent {
  title?: string;
  description?: string;
  image?: string;
  items?: SolutionItem[];
}

export function AomSolutions({ content }: { content?: AomSolutionsContent }) {
  const title = content?.title || 'Enterprise Mobility Solutions';
  const description = content?.description || 'Modern businesses rely on Enterprise Mobility Solutions to empower teams with real-time access, seamless collaboration, and efficient business operations from anywhere. At ESS Mobile Apps, we build intelligent, workflow-driven mobile applications using modern PWA technology, delivering seamless experiences across iOS, Android, and Windows platforms.';
  const leftImage = content?.image || '/App- App over view (mobile app)/image 78.png';
  
  const defaultItems: SolutionItem[] = [
    {
      icon: '/App- App over view (mobile app)/analytics-reference_svgrepo.com.png',
      title: 'Mobile SFA',
      description: 'Sales Force Automation app to streamline field sales operations and improve team productivity.'
    },
    {
      icon: '/App- App over view (mobile app)/crm-crm_svgrepo.com.png',
      title: 'ebizframe CRM',
      description: 'Smart CRM application to manage customer interactions, sales activities, and team performance efficiently.'
    }
  ];

  const items = content?.items || defaultItems;

  return (
    <section className="py-14 px-6 bg-white border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Left Column (Image) */}
          {leftImage && (
            <div className="flex-1 w-full max-w-md lg:max-w-lg relative aspect-square lg:aspect-auto lg:h-[450px]">
              <Image
                src={leftImage}
                alt={title}
                fill
                className="object-contain"
              />
            </div>
          )}

          {/* Right Column (Content) */}
          <div className="flex-grow space-y-6 lg:max-w-2xl text-left">
            <h2 className="text-[#0a1128] text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
              {title}
            </h2>

            <p className="text-slate-500 text-sm md:text-base leading-relaxed font-medium">
              {description}
            </p>

            {/* Solutions List Cards */}
            <div className="space-y-4 pt-2">
              {items.map((item, idx) => (
                <div 
                  key={idx}
                  className="bg-white border border-slate-100 rounded-2xl p-5 md:p-6 flex items-start gap-5 shadow-sm hover:shadow-md transition-shadow duration-300"
                >
                  {item.icon && (
                    <div className="w-12 h-12 relative flex-shrink-0 bg-slate-50 rounded-xl flex items-center justify-center p-2 border border-slate-100">
                      <Image
                        src={item.icon}
                        alt={item.title || ''}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  <div>
                    <h3 className="text-[#0a1128] text-base md:text-lg font-bold mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-xs md:text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
