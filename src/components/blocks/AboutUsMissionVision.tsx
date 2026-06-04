'use client';

import { motion } from 'framer-motion';
import { MotionSection } from '@/components/animations/MotionSection';
import { Target, Eye, CheckCircle2 } from 'lucide-react';

interface MissionVisionItem {
  title?: string;
  description?: string;
  icon?: string; // 'target' | 'eye'
  subItems?: string[];
}

interface AboutUsMissionVisionContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: MissionVisionItem[];
}

interface AboutUsMissionVisionProps {
  content?: AboutUsMissionVisionContent;
}

const defaultItems: MissionVisionItem[] = [
  {
    title: 'Our Mission',
    description: 'To provide world-class software solutions and services to our clients, enabling them to achieve their business goals. We strive to build long-term relationships with our clients based on trust, integrity, and mutual respect.',
    icon: 'target',
    subItems: [
      'Focus on delivering measurable business value',
      'Commitment to continuous innovation and quality',
      'Customer-centric approach to software development'
    ]
  },
  {
    title: 'Our Vision',
    description: 'To be a leading global IT solutions provider, recognized for our technical excellence, customer centricity, and commitment to quality. We aim to empower businesses with innovative technology solutions that drive growth and efficiency.',
    icon: 'eye',
    subItems: [
      'Leadership through technological excellence',
      'Foster a culture of collaboration and continuous learning',
      'Partner with clients to drive sustainable business growth'
    ]
  }
];

export function AboutUsMissionVision({ content }: AboutUsMissionVisionProps) {
  const title = content?.title || "Our Purpose & Direction";
  const subtitle = content?.subtitle || "Mission & Vision";
  const items = content?.items || defaultItems;

  const renderIcon = (icon?: string) => {
    if (icon === 'target') {
      return (
        <div className="w-24 h-24 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
          <Target className="w-12 h-12 text-red-500 relative z-10 transition-transform duration-500 group-hover:scale-110" />
          <div className="absolute inset-0 bg-red-100/50 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-2xl" />
        </div>
      );
    }
    return (
      <div className="w-24 h-24 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 relative overflow-hidden group">
        <Eye className="w-12 h-12 text-blue-500 relative z-10 transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-blue-100/50 scale-0 group-hover:scale-100 transition-transform duration-500 rounded-2xl" />
      </div>
    );
  };

  return (
    <section className="py-24 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 md:px-8 max-w-6xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Cards Stack */}
        <div className="flex flex-col gap-10">
          {items.map((item, index) => (
            <MotionSection
              key={index}
              variant="fadeUp"
              delay={index * 0.1}
              className="bg-white rounded-3xl p-8 md:p-10 shadow-[0_15px_35px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col md:flex-row gap-8 items-start"
            >
              {/* Graphic Icon */}
              {renderIcon(item.icon)}

              {/* Text Content */}
              <div className="flex-grow">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">
                  {item.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6 font-light">
                  {item.description}
                </p>

                {/* Sub Bullet Items */}
                {item.subItems && item.subItems.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {item.subItems.map((subItem, sIdx) => (
                      <div key={sIdx} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-500 flex-shrink-0" />
                        <span className="text-slate-700 text-sm font-medium">
                          {subItem}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </MotionSection>
          ))}
        </div>

      </div>
    </section>
  );
}
