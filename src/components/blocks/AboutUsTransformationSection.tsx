'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Database, RefreshCw, GitMerge, FileCode } from 'lucide-react';

interface TransformItem {
  title?: string;
  description?: string;
  icon?: string; // 'database' | 'upgrade' | 'integration' | 'custom'
}

interface AboutUsTransformationContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: TransformItem[];
}

interface AboutUsTransformationSectionProps {
  content?: AboutUsTransformationContent;
}

const defaultItems: TransformItem[] = [
  {
    title: 'D2K Migration Services',
    description: 'Deceptively simple migration of your legacy systems to advanced D2K structures with near-zero data loss.',
    icon: 'database'
  },
  {
    title: 'Technology Upgradation',
    description: 'Upgrade your tech stack to latest frameworks to enhance execution speed, stability, and future scalability.',
    icon: 'upgrade'
  },
  {
    title: 'System Integration',
    description: 'Connecting various software layers and third-party APIs to operate as a single unified enterprise ecosystem.',
    icon: 'integration'
  },
  {
    title: 'Custom Development',
    description: 'Tailor-made software systems and workflows engineered from scratch to cater to unique operational demands.',
    icon: 'custom'
  }
];

export function AboutUsTransformationSection({ content }: AboutUsTransformationSectionProps) {
  const title = content?.title || "D2K Migration or Technology Upgradation Services";
  const subtitle = content?.subtitle || "Legacy to Modernity";
  const items = content?.items || defaultItems;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'database':
        return <Database className="w-6 h-6 text-indigo-500" />;
      case 'upgrade':
        return <RefreshCw className="w-6 h-6 text-sky-500 animate-spin-slow" />;
      case 'integration':
        return <GitMerge className="w-6 h-6 text-purple-500" />;
      case 'custom':
        return <FileCode className="w-6 h-6 text-emerald-500" />;
      default:
        return <Database className="w-6 h-6 text-indigo-500" />;
    }
  };

  const getCardColor = (iconName?: string) => {
    switch (iconName) {
      case 'database':
        return 'from-indigo-500/10 to-indigo-500/0 hover:border-indigo-200';
      case 'upgrade':
        return 'from-sky-500/10 to-sky-500/0 hover:border-sky-200';
      case 'integration':
        return 'from-purple-500/10 to-purple-500/0 hover:border-purple-200';
      case 'custom':
        return 'from-emerald-500/10 to-emerald-500/0 hover:border-emerald-200';
      default:
        return 'from-indigo-500/10 to-indigo-500/0 hover:border-indigo-200';
    }
  };

  return (
    <section className="py-24 bg-gradient-to-b from-[#F8F9FA] to-[#ECEFF1]/50">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-[1.25]">
            {title}
          </h2>
        </div>

        {/* Feature Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((item, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, scale: 0.95 },
                animate: { opacity: 1, scale: 1, transition: { duration: 0.7 } }
              }}
              whileHover={{ y: -6 }}
              className={`bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_10px_30px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] bg-gradient-to-br transition-all duration-300 flex flex-col sm:flex-row gap-6 items-start ${getCardColor(item.icon)}`}
            >
              {/* Graphic Icon Area */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex-shrink-0 flex items-center justify-center shadow-sm">
                {renderIcon(item.icon)}
              </div>

              {/* Text Area */}
              <div>
                <h3 className="text-xl font-bold text-slate-950 mb-3 tracking-tight">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed font-light">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
