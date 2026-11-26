'use client';

import React from 'react';
import { Users } from 'lucide-react';

export interface StatItem {
  icon?: string;
  value: string;
  title: string;
}

export interface Landing1StatsContent {
  badge?: string;
  title?: string;
  titleColor?: string;
  stats?: StatItem[];
}

const DEFAULT_STATS: StatItem[] = [
  { icon: '/Landing page1/assets/team_svgrepo.com.png', value: '1000+', title: 'Customers' },
  { icon: '/Landing page1/assets/calendar-days_svgrepo.com.png', value: '30+', title: 'Years' },
  { icon: '/Landing page1/assets/factory_svgrepo.com.png', value: '25+', title: 'Industries' },
  { icon: '/Landing page1/assets/heart-health_svgrepo.com.png', value: '98%', title: 'Customer Satisfaction' },
  { icon: '/Landing page1/assets/growth_svgrepo.com.png', value: '40%', title: 'Productivity Increase' },
  { icon: '/Landing page1/assets/support_svgrepo.com.png', value: '24x7', title: 'Support' }
];

const DEFAULT_CONTENT: Landing1StatsContent = {
  badge: 'CUSTOMER SUCCESS',
  title: 'Numbers that define three decades of trust',
  stats: DEFAULT_STATS
};

export function Landing1Stats({ content }: { content?: Landing1StatsContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };

  return (
    <section className="py-14 bg-slate-50 font-sans select-none border-b border-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-[#512e9a] rounded-[40px] p-8 md:p-14 text-center shadow-xl relative overflow-hidden">
          
          {/* Subtle glow details */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-400/[0.02] rounded-full blur-3xl pointer-events-none" />

          {/* Badge */}
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-amber-400 bg-white/10 border border-white/15 uppercase mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              {data.badge}
            </span>
          )}

          {/* Title */}
          {data.title && (
            <h2
              className="text-2xl md:text-[40px] font-extrabold text-white tracking-tight leading-tight max-w-3xl mx-auto mb-14"
              style={data.titleColor ? { color: data.titleColor } : undefined}
            >
              {data.title}
            </h2>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center items-start justify-center">
            {data.stats?.map((st, idx) => (
              <div key={idx} className="space-y-4 flex flex-col items-center">
                {/* Icon Container */}
                <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/15 shadow-inner overflow-hidden p-2.5">
                  {st.icon ? (
                    <img
                      src={st.icon}
                      alt={st.title}
                      className="w-full h-full object-contain"
                      style={{ filter: 'brightness(0) saturate(100%) invert(75%) sepia(70%) saturate(1500%) hue-rotate(345deg) brightness(105%) contrast(101%)' }}
                    />
                  ) : (
                    <Users className="w-5 h-5 text-amber-400" />
                  )}
                </div>
                
                <div className="space-y-1">
                  {st.value && (
                    <div className="text-3xl md:text-[38px] font-extrabold text-white tracking-tight">
                      {st.value}
                    </div>
                  )}
                  {st.title && (
                    <div className="text-[10px] md:text-xs text-slate-300 font-bold tracking-widest uppercase max-w-[130px] mx-auto leading-relaxed">
                      {st.title}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
