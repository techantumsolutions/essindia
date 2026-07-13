'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { useInternalNavigate } from '@/hooks/useInternalNavigate';

interface Industry {
  name: string;
  description: string;
  image: string;
}

interface IndustryContent {
  heading?: string;
  subheading?: string;
  description?: string;
  industries?: Industry[];
  viewAllCta?: { label: string; url: string };
}

interface IndustrySectionProps {
  content?: IndustryContent;
}

const defaultIndustries = [
  { 
    name: 'Manufacturing industry', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-manufacturing.png' 
  },
  { 
    name: 'HealthCare', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-healthcare.png' 
  },
  { 
    name: 'Logistics', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-logistics.png' 
  },
  { 
    name: 'Custom ERP Solution', 
    description: 'Lorem ipsum dolor sit amet consectetur adipiscing elit phasellus eleifend ut,',
    image: '/ind-erp.png' 
  },
];

export function IndustrySection({ content }: IndustrySectionProps) {
  const navigate = useInternalNavigate();
  const heading = content?.heading || "Choose the Industry Expert";
  const subheading = content?.subheading || "Designed for the way your industry works.";
  const description = content?.description || "From manufacturing to services, ESS understands the workflows behind real business operations. We infuse our extensive industry expertise into every solution, tailoring our approach to the specific realities of each industry rather than relying on generic software thinking.";
  const industries = content?.industries || defaultIndustries;
  const viewAllCta = content?.viewAllCta || { label: "View all INDUSTRIES", url: "/industries" };

  return (
    <section className="py-14 bg-[#462885] relative z-10 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      
      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        
        {/* Text Header Content */}
        <div className="flex flex-col items-center text-center mb-16 max-w-4xl mx-auto text-white">
          <TextReveal 
            as="h2"
            text={heading}
            className="text-4xl md:text-5xl font-bold tracking-tight mb-6 justify-center"
          />
          <MotionSection variant="fadeUp" delay={0.3}>
            <h3 className="text-xl md:text-[24px] font-medium mb-6 text-white/90">
              {subheading}
            </h3>
          </MotionSection>
          <MotionSection variant="fadeUp" delay={0.4}>
            <p className="text-[14px] md:text-[15px] font-normal leading-relaxed text-white/70 max-w-3xl tracking-wide">
              {description}
            </p>
          </MotionSection>
        </div>

        {/* Cards Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {industries.map((ind, index) => (
            <motion.div
              key={ind.name + index}
              variants={{
                initial: { opacity: 0, y: 30, scale: 0.95 },
                animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              whileHover={{ y: -10, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              className="bg-white rounded-[24px] overflow-hidden flex flex-col h-full shadow-[0_20px_40px_-15px_rgba(0,0,0,0.4)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)] transition-shadow duration-500 cursor-pointer group"
            >
              {/* Image Container */}
              <div className="h-[220px] relative bg-slate-100 overflow-hidden">
                <motion.img 
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  src={ind.image} 
                  alt={ind.name} 
                  className="w-full h-full object-cover" 
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-500" />
              </div>
              
              {/* Text Container */}
              <div className="p-8 flex flex-col flex-1">
                <h4 className="text-[17px] font-bold text-slate-900 mb-3 group-hover:text-[#462885] transition-colors">
                  {ind.name}
                </h4>
                <p className="text-[13px] text-slate-500 leading-relaxed line-clamp-3">
                  {ind.description}
                </p>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <MotionSection variant="fadeUp" delay={0.5} className="mt-16 text-center">
          <Button 
            onClick={() => navigate(viewAllCta.url)}
            className="bg-white hover:bg-slate-50 text-[#462885] rounded-full px-12 h-[54px] text-[15px] font-bold tracking-wider shadow-2xl transition-all duration-300 hover:shadow-white/20 hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            {viewAllCta.label}
          </Button>
        </MotionSection>

      </div>
    </section>
  );
}
