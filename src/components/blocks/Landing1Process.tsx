'use client';

import React from 'react';

export interface ProcessStep {
  icon?: string;
  title: string;
  description: string;
}

export interface Landing1ProcessContent {
  badge?: string;
  title?: string;
  description?: string;
  process?: ProcessStep[];
}

const DEFAULT_PROCESS: ProcessStep[] = [
  {
    title: 'Requirement Analysis',
    description: 'We map your processes, pain points and goals.',
    icon: '/Landing page1/assets/search-alt_svgrepo.com.png'
  },
  {
    title: 'Business Consulting',
    description: 'Experts benchmark your workflows against industry best practice.',
    icon: '/Landing page1/assets/light-bulb_svgrepo.com.png'
  },
  {
    title: 'Solution Design',
    description: 'A tailored blueprint with modules, configs and integrations.',
    icon: '/Landing page1/assets/light-bulb_svgrepo.com.png'
  },
  {
    title: 'Implementation',
    description: 'Rapid deployment with data migration and testing.',
    icon: '/Landing page1/assets/rocket-launch_svgrepo.com.png'
  },
  {
    title: 'Training',
    description: 'Role-based training for every team, on-site and online.',
    icon: '/Landing page1/assets/graduation-cap_svgrepo.com.png'
  },
  {
    title: 'Go Live',
    description: 'Controlled cutover with parallel-run safety net.',
    icon: '/Landing page1/assets/check-circle_svgrepo.com.png'
  },
  {
    title: 'Support',
    description: '24×7 support, upgrades and continuous optimization.',
    icon: '/Landing page1/assets/support_svgrepo.com.png'
  }
];

const DEFAULT_CONTENT: Landing1ProcessContent = {
  badge: 'IMPLEMENTATION',
  title: 'From kickoff to go-live in weeks, not months',
  description: 'A proven 7-step methodology refined over 30 years and 1000+ deployments — with a dedicated team beside you at every stage.',
  process: DEFAULT_PROCESS
};

export function Landing1Process({ content }: { content?: Landing1ProcessContent }) {
  const data = { ...DEFAULT_CONTENT, ...content };
  // Restrict to max 7 process steps on the frontend
  const processList = (data.process || []).slice(0, 7);

  return (
    <section className="py-12 border-t border-b bg-[#ecf4ff] text-slate-900 font-sans select-none">
      <div className="container mx-auto px-6 max-w-7xl">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          {data.badge && (
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
              {data.badge}
            </span>
          )}
          {data.title && (
            <h2 className="text-3xl md:text-[40px] font-extrabold tracking-tight text-slate-900 leading-tight">
              {data.title}
            </h2>
          )}
          {data.description && (
            <p className="text-slate-500 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
              {data.description}
            </p>
          )}
        </div>

        {/* Timeline Row */}
        <div className="relative pt-8">
          
          {/* Horizontal Timeline Line */}
          <div className="absolute top-[64px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-indigo-200 via-purple-200 to-amber-200 hidden lg:block z-0" />

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8 lg:gap-4 relative z-10">
            {processList.map((st, idx) => (
              <div key={idx} className="flex flex-col items-center text-center group">
                
                {/* Icon Squircle Wrapper */}
                <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center relative border border-slate-100/80 group-hover:scale-105 group-hover:shadow-md transition-all duration-300 shrink-0">
                  
                  {/* Step Number Circle */}
                  <div className="absolute -top-2.5 -left-2.5 w-6 h-6 rounded-full bg-[#49288a] text-white text-[10px] font-bold flex items-center justify-center border-2 border-white shadow-sm">
                    {idx + 1}
                  </div>

                  {/* Custom Uploaded Icon */}
                  <div className="w-6 h-6 flex items-center justify-center overflow-hidden">
                    {st.icon ? (
                      <img
                        src={st.icon}
                        alt={st.title}
                        className="w-full h-full object-contain"
                        style={{ filter: 'brightness(0) saturate(100%) invert(22%) sepia(51%) saturate(2222%) hue-rotate(250deg) brightness(85%) contrast(90%)' }}
                      />
                    ) : (
                      <span className="text-slate-400 font-bold text-xs">ESS</span>
                    )}
                  </div>
                </div>

                {/* Text Description */}
                <div className="space-y-1 mt-4">
                  {st.title && (
                    <h4 className="text-sm font-bold text-slate-900 tracking-wide">
                      {st.title}
                    </h4>
                  )}
                  {st.description && (
                    <p className="text-slate-500 text-xs leading-relaxed max-w-[140px] mx-auto">
                      {st.description}
                    </p>
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
