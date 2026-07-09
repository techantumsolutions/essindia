'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Spotlight } from '@/components/ui/Spotlight';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

// Generic placeholder SVGs
const Icon1 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;

interface Service {
  iconImage?: string;
  title: string;
  description: string;
  bgImage: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
}

interface ServicesContent {
  heading?: string;
  subheading?: string;
  services?: Service[];
  viewAllCta?: { label: string; url: string };
}

interface ServicesSectionProps {
  content?: ServicesContent;
}

const defaultServices: Service[] = [];

export function ServicesSection({ content }: ServicesSectionProps) {
  const ctaUrl = (content as any)?.ctaUrl || '';
  const ctaFormType = ((content as any)?.ctaFormType || '') as CtaFormType;
  const { handleClick: handleCtaClick, modalNode } = useCtaAction(ctaUrl, ctaFormType);
  const heading = content?.heading || "Services we offer";
  const subheading = content?.subheading || "Manage your operations with guidance that evolves with your business goals.";
  const services = content?.services || defaultServices;
  const viewAllCta = content?.viewAllCta || { label: "View all solutions", url: "/solutions" };

  return (
    <section className="py-14 bg-white relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">

        {/* Header */}
        <MotionSection variant="fadeUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            {heading}
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            {subheading}
          </p>
        </MotionSection>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              className="h-full"
            >
              <Spotlight color="rgba(75, 42, 99, 1)" size={300} opacity={0.1} className="h-full rounded-[24px]">
                <motion.div
                  variants={{
                    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
                    animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                  }}
                  className="group relative h-full rounded-[24px] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(75, 42, 99, 0.08)] transition-all duration-500 bg-white border border-slate-200"
                >
                  {/* === Default State (White Card) === */}
                  <div className="relative h-full p-4 flex flex-col transition-all duration-500 ease-in-out group-hover:opacity-0 z-10">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 pr-4">
                      {service.title}
                    </h3>
                    <p className="text-[14px] text-slate-500 leading-relaxed mb-6 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="h-12 flex items-center">
                      {service.ctaUrl ? (
                        <a href={service.ctaUrl} className="inline-flex items-center text-[#4B2A63] text-[13px] font-bold group/btn hover:opacity-80 transition-opacity">
                          {service.ctaText || 'View more'}
                          <svg className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </a>
                      ) : (
                        <div className="inline-flex items-center text-[#4B2A63] text-[13px] font-bold group/btn cursor-pointer hover:opacity-80 transition-opacity">
                          {service.ctaText || 'View more'}
                          <svg className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* === Hover State (Dark Image Card) === */}
                  <div className="absolute inset-0 rounded-[24px] flex flex-col p-4 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out z-20 overflow-hidden">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 10, ease: "linear" }}
                      className="absolute inset-0 bg-cover bg-center -z-10"
                      style={{ backgroundImage: `url(${service.bgImage})` }}
                    />
                    {/* Dark overlay to make text readable */}
                    <div className="absolute inset-0 bg-[#4B2A63]/60 backdrop-blur-[2px] -z-10" />

                    <h3 className="text-xl font-bold text-white leading-tight mb-4 pr-4">
                      {service.title}
                    </h3>
                    <p className="text-[14px] text-slate-200 leading-relaxed mb-6 line-clamp-2">
                      {service.description}
                    </p>
                    <div className="h-12 flex items-center">
                      {service.ctaUrl ? (
                        <a href={service.ctaUrl} className="inline-flex items-center justify-center bg-white text-[#4B2A63] hover:bg-slate-50 rounded-full px-8 h-12 text-[14px] font-bold shadow-2xl transition-all duration-300 active:scale-95">
                          {service.ctaText || 'View more'}
                        </a>
                      ) : (
                        <Button className="bg-white text-[#4B2A63] hover:bg-slate-50 rounded-full px-8 h-12 text-[14px] font-bold shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer">
                          {service.ctaText || 'View more'}
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </Spotlight>
            </motion.div>
          ))}
        </StaggerContainer>



      </div>
    </section>
  );
}
