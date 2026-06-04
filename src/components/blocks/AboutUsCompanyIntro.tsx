'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Layers, Zap, Globe } from 'lucide-react';

interface HighlightItem {
  title?: string;
  description?: string;
  icon?: string; // 'layers' | 'zap' | 'globe'
}

interface AboutUsCompanyIntroContent {
  title?: string;
  subtitle?: string; // e.g. "Who We Are"
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: HighlightItem[];
}

interface AboutUsCompanyIntroProps {
  content?: AboutUsCompanyIntroContent;
}

const defaultHighlights: HighlightItem[] = [
  {
    title: 'Business-First Implementation',
    description: 'We construct software solutions that adapt to your business processes, not the other way around.',
    icon: 'layers'
  },
  {
    title: 'Faster Deployment, Product-Focused',
    description: 'Our modular approach allows us to deploy faster, minimizing downtime and accelerating ROI.',
    icon: 'zap'
  },
  {
    title: 'Global Expertise with Local Support',
    description: 'With operations across India and globally, we provide 24/7 support to keep your business running smoothly.',
    icon: 'globe'
  }
];

export function AboutUsCompanyIntro({ content }: AboutUsCompanyIntroProps) {
  const title = content?.title || "Eastern Software Solutions";
  const subtitle = content?.subtitle || "Who We Are";
  const description = content?.description || "Founded in 1990, Eastern Software Solutions (ESS) is a leading provider of enterprise software solutions. Over three decades, we have partnered with businesses worldwide to streamline operations, drive growth, and deliver measurable outcomes.";
  const image = content?.image || "/why-ess-main.png";
  const highlights = content?.items || defaultHighlights;

  // Icon mapping helper
  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'layers':
        return <Layers className="w-5 h-5 text-orange-600" />;
      case 'zap':
        return <Zap className="w-5 h-5 text-emerald-600" />;
      case 'globe':
        return <Globe className="w-5 h-5 text-amber-600" />;
      default:
        return <Layers className="w-5 h-5 text-blue-600" />;
    }
  };

  const iconBgClass = (iconName?: string) => {
    switch (iconName) {
      case 'layers':
        return 'bg-orange-100 border-orange-200';
      case 'zap':
        return 'bg-emerald-100 border-emerald-200';
      case 'globe':
        return 'bg-amber-100 border-amber-200';
      default:
        return 'bg-blue-100 border-blue-200';
    }
  };

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Column: Content & Highlights */}
          <div>
            <MotionSection variant="fadeUp">
              <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
                {subtitle}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-6">
                {title}
              </h2>
              <p className="text-slate-600 leading-relaxed mb-10 text-base md:text-lg font-light">
                {description}
              </p>
            </MotionSection>

            {/* Highlights List */}
            <StaggerContainer className="flex flex-col gap-6">
              {highlights.map((item, index) => (
                <motion.div
                  key={index}
                  variants={{
                    initial: { opacity: 0, x: -30 },
                    animate: { opacity: 1, x: 0, transition: { duration: 0.6 } }
                  }}
                  className="flex gap-4 items-start p-4 rounded-xl border border-slate-50 hover:border-slate-100 hover:bg-slate-50/50 transition-all duration-300"
                >
                  <div className={`p-3 rounded-full border flex-shrink-0 ${iconBgClass(item.icon)}`}>
                    {renderIcon(item.icon)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {item.title}
                    </h3>
                    <p className="text-slate-500 text-sm leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>
          </div>

          {/* Right Column: Styled Image */}
          <MotionSection variant="scaleIn" className="w-full h-full flex justify-center items-center">
            <div className="relative w-full max-w-[550px] aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
              <motion.img 
                whileHover={{ scale: 1.03 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                src={image} 
                alt="Eastern Software Solutions Office" 
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </MotionSection>

        </div>
      </div>
    </section>
  );
}
