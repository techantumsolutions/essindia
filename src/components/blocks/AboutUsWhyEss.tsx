'use client';

import { motion } from 'framer-motion';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { 
  Briefcase, 
  Zap, 
  Globe, 
  ShieldCheck, 
  RefreshCw, 
  Layers 
} from 'lucide-react';

interface TrustCard {
  title?: string;
  description?: string;
  icon?: string; // 'business' | 'deployment' | 'global' | 'security' | 'upgrades' | 'reduction'
}

interface AboutUsWhyEssContent {
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
  buttonText?: string;
  buttonLink?: string;
  items?: TrustCard[];
}

interface AboutUsWhyEssProps {
  content?: AboutUsWhyEssContent;
}

const defaultTrustCards: TrustCard[] = [
  {
    title: 'Business-First Implementation',
    description: 'We work closely with your teams to understand unique workflows and design systems to deliver customized business solutions.',
    icon: 'business'
  },
  {
    title: 'Faster Deployment, Product-Focused',
    description: 'Our modular tools and framework accelerate execution, helping you achieve faster time-to-market and return on investment.',
    icon: 'deployment'
  },
  {
    title: 'Global Expertise with Local Support',
    description: 'Our experience across geographies enables us to deploy and support systems for modern business operations around the world.',
    icon: 'global'
  },
  {
    title: 'Designed for Securing Digital Future',
    description: 'With state-of-the-art security frameworks (including SOC 2 and GDPR compliance), we build trust at every layer.',
    icon: 'security'
  },
  {
    title: 'Continuous Technology Upgrades',
    description: 'We help you transition smoothly to new technology versions, ensuring you always run on the latest, most secure codebase.',
    icon: 'upgrades'
  },
  {
    title: 'Product Model Reduction',
    description: 'We simplify complex IT portfolios, eliminating redundant systems and reducing overall licensing and operational costs.',
    icon: 'reduction'
  }
];

export function AboutUsWhyEss({ content }: AboutUsWhyEssProps) {
  const title = content?.title || "Why Businesses Trust ESS";
  const subtitle = content?.subtitle || "Our Core Strengths";
  const trustCards = content?.items || defaultTrustCards;

  const renderIcon = (iconName?: string) => {
    switch (iconName) {
      case 'business':
        return <Briefcase className="w-6 h-6 text-[#1C2D4E]" />;
      case 'deployment':
        return <Zap className="w-6 h-6 text-[#1C2D4E]" />;
      case 'global':
        return <Globe className="w-6 h-6 text-[#1C2D4E]" />;
      case 'security':
        return <ShieldCheck className="w-6 h-6 text-[#1C2D4E]" />;
      case 'upgrades':
        return <RefreshCw className="w-6 h-6 text-[#1C2D4E]" />;
      case 'reduction':
        return <Layers className="w-6 h-6 text-[#1C2D4E]" />;
      default:
        return <Briefcase className="w-6 h-6 text-[#1C2D4E]" />;
    }
  };

  return (
    <section className="py-24 bg-blue-50/30 border-t border-b border-slate-100">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-sm font-bold text-slate-500 uppercase tracking-widest block mb-3">
            {subtitle}
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
            {title}
          </h2>
        </div>

        {/* 6-Card Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trustCards.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.6 } }
              }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="bg-white border border-slate-100 rounded-2xl p-8 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-300 flex flex-col items-start"
            >
              {/* Icon Container */}
              <div className="p-3.5 bg-blue-50 border border-blue-100 rounded-xl mb-6 flex items-center justify-center">
                {renderIcon(card.icon)}
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-slate-950 mb-3 tracking-tight">
                {card.title}
              </h3>

              {/* Description */}
              <p className="text-slate-500 text-sm leading-relaxed font-light">
                {card.description}
              </p>
            </motion.div>
          ))}
        </StaggerContainer>

      </div>
    </section>
  );
}
