'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { BarChart3, Cpu, Smartphone } from 'lucide-react';

interface ServiceItem {
  title?: string;
  description?: string;
  icon?: string; // 'data' | 'automation' | 'mobility'
}

interface AboutUsServicesOverviewContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: ServiceItem[];
}

interface AboutUsServicesOverviewProps {
  content?: AboutUsServicesOverviewContent;
}

const defaultServices: ServiceItem[] = [
  {
    title: 'Smarter Decisions Through Data',
    description: 'BI Dashboards with integrated AI to transform data into actionable decisions and insights.',
    icon: 'data',
  },
  {
    title: 'Intelligent Process Automation',
    description: 'RPA solutions to automate repetitive tasks and optimize enterprise workflows.',
    icon: 'automation',
  },
  {
    title: 'Enterprise Mobility Simplified',
    description: 'Custom mobile solutions to streamline field operations and keep teams connected.',
    icon: 'mobility',
  }
];

export function AboutUsServicesOverview({ content }: AboutUsServicesOverviewProps) {
  const title = content?.title || "Core Offerings & Solutions";
  const subtitle = content?.subtitle || "Services Overview";
  const services = content?.items || defaultServices;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'data':
        return <BarChart3 className="w-8 h-8 text-blue-600" />;
      case 'automation':
        return <Cpu className="w-8 h-8 text-orange-600" />;
      case 'mobility':
        return <Smartphone className="w-8 h-8 text-indigo-600" />;
      default:
        return <BarChart3 className="w-8 h-8 text-blue-600" />;
    }
  };

  const iconBg = (iconName?: string) => {
    switch (iconName) {
      case 'data':
        return 'bg-blue-50 border-blue-100';
      case 'automation':
        return 'bg-orange-50 border-orange-100';
      case 'mobility':
        return 'bg-indigo-50 border-indigo-100';
      default:
        return 'bg-blue-50 border-blue-100';
    }
  };

  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
            {title}
          </h2>
        </div>

        {/* Services Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 30 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.8 } }
              }}
              whileHover={{ y: -8 }}
              className="bg-white border border-slate-100 rounded-3xl p-8 shadow-[0_4px_25px_rgba(0,0,0,0.01)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 flex flex-col items-center text-center group cursor-pointer"
            >
              {/* Icon Container */}
              <div className={`p-5 rounded-2xl border mb-6 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 ${iconBg(service.icon)}`}>
                {renderIcon(service.icon)}
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-slate-950 mb-4 tracking-tight group-hover:text-slate-800 transition-colors">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                {service.description}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
