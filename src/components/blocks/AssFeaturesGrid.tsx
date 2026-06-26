'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

interface IntegrationItem {
  image?: string;
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface Category {
  name?: string;
  items?: IntegrationItem[];
}

interface AssFeaturesGridContent {
  title?: string;
  categories?: Category[];
}

export function AssFeaturesGrid({ content }: { content?: AssFeaturesGridContent }) {
  const title = content?.title || 'Simplify Scheduling. Accelerate Productivity.';

  const defaultCategories: Category[] = [
    {
      name: 'Popular',
      items: [
        { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-1.png', title: 'Salesforce', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-3.png', title: 'Typeform', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-4.png', title: 'Claude', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-8.png', title: 'Stripe', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-11.png', title: 'Greenhouse', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-12.png', title: 'Gong', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Extensions & Apps',
      items: [
        { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-3.png', title: 'Typeform', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Calendars',
      items: [
        { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Sales & CRM',
      items: [
        { image: '/App-After Sales Service/Image-1.png', title: 'Salesforce', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Video Conferencing',
      items: [
        { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Marketing',
      items: [
        { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Recruiting & ATS',
      items: [
        { image: '/App-After Sales Service/Image-11.png', title: 'Greenhouse', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Payments',
      items: [
        { image: '/App-After Sales Service/Image-8.png', title: 'Stripe', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Analytics',
      items: [
        { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-12.png', title: 'Gong', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'API & Connectors',
      items: [
        { image: '/App-After Sales Service/Image-14.png', title: 'Zapier', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'AI Assistants',
      items: [
        { image: '/App-After Sales Service/Image-4.png', title: 'Claude', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Email Messaging',
      items: [
        { image: '/App-After Sales Service/Image-10.png', title: 'ActiveCampaign', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-2.png', title: 'HubSpot', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Embed Calendly',
      items: [
        { image: '/App-After Sales Service/Image.png', title: 'Zoom', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Security & Compliance',
      items: [
        { image: '/App-After Sales Service/Image-6.png', title: 'Slack', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Google Suite',
      items: [
        { image: '/App-After Sales Service/Image-5.png', title: 'Google Analytics', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Microsoft Suite',
      items: [
        { image: '/App-After Sales Service/Image-7.png', title: 'Microsoft Teams Chat', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
        { image: '/App-After Sales Service/Image-13.png', title: 'Microsoft Teams', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    },
    {
      name: 'Other Integrations',
      items: [
        { image: '/App-After Sales Service/Image-9.png', title: 'Yelp', description: 'Lorem ipsum is placeholder dummy text used in graphic design, publishing', ctaText: 'Learn more', ctaUrl: '#' },
      ]
    }
  ];

  const categories = content?.categories || defaultCategories;
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const activeCategory = categories[activeCategoryIndex] || categories[0] || { name: 'Popular', items: [] };
  const activeItems = activeCategory.items || [];

  const filteredItems = activeItems.filter(item => {
    const query = searchQuery.toLowerCase().trim();
    if (!query) return true;
    const titleMatch = item.title?.toLowerCase().includes(query) || false;
    const descMatch = item.description?.toLowerCase().includes(query) || false;
    return titleMatch || descMatch;
  });

  return (
    <section className="p-14 px-6 bg-[#fafcff] border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* Left Categories Sidebar */}
          <div className="lg:w-1/4 w-full shrink-0 border border-2 p-3 rounded-xl">
            <h3 className="text-lg font-extrabold text-[#0a1128] mb-5 tracking-wide hidden lg:block">
              Categories
            </h3>

            {/* Mobile Category List (Scrollable Row) */}
            <div className="lg:hidden flex overflow-x-auto gap-2 pb-4 scrollbar-none snap-x -mx-6 px-6">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategoryIndex(idx);
                    setSearchQuery('');
                  }}
                  className={`snap-start shrink-0 px-4 py-2 text-xs font-semibold rounded-full border transition-all duration-300 ${idx === activeCategoryIndex
                    ? 'bg-[#2a2b6a] text-white border-[#2a2b6a]'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Desktop Category List */}
            <div className="hidden lg:flex flex-col gap-1 pr-6 border-r border-slate-100">
              {categories.map((cat, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setActiveCategoryIndex(idx);
                    setSearchQuery('');
                  }}
                  className={`w-full text-left px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-300 ${idx === activeCategoryIndex
                    ? 'bg-[#2a2b6a] text-white shadow-sm shadow-[#2a2b6a]/10'
                    : 'bg-transparent text-slate-600 hover:bg-blue-100/70 hover:text-slate-900 cursor-pointer'
                    }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Right Cards Content Grid */}
          <div className="flex-grow">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2 pb-4 border-slate-200">
              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#2a2b6a]/20 focus:border-[#2a2b6a] transition-all duration-300 text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Viewing Count */}
              <span className="text-sm font-bold text-slate-700">
                Viewing: {filteredItems.length} {activeCategory.name}
              </span>
            </div>

            {/* Grid */}
            {filteredItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-dashed border-slate-200">
                <span className="text-sm font-semibold text-slate-400">
                  {activeItems.length === 0
                    ? "No integrations found in this category."
                    : "No integrations match your search query."
                  }
                </span>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col items-start hover:shadow-[0_12px_30px_rgba(0,0,0,0.03)] hover:border-blue-200 transition-all duration-300 group h-full"
                  >
                    {item.image && (
                      <div className="w-10 h-10 relative mb-4">
                        <Image
                          src={item.image}
                          alt={item.title || ''}
                          fill
                          className="object-contain"
                        />
                      </div>
                    )}

                    <h4 className="text-base font-bold text-slate-800 mb-2 group-hover:text-[#2a2b6a] transition-colors">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 leading-relaxed mb-6 flex-grow">
                      {item.description}
                    </p>

                    {item.ctaText && (
                      <a
                        href={item.ctaUrl || '#'}
                        className="text-[#27256B] text-xs font-black flex items-center gap-1.5 hover:gap-2.5 transition-all duration-300 mt-auto"
                      >
                        {item.ctaText}
                        <span className="text-[14px] font-bold">→</span>
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
