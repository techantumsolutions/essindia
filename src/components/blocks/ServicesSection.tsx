'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { Spotlight } from '@/components/ui/Spotlight';

// Generic placeholder SVGs matching the abstract geometric shapes in the screenshot
const Icon1 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const Icon2 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></svg>;
const Icon3 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path><path d="M2 12h20"></path></svg>;
const Icon4 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path><polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline><polyline points="7.5 19.79 12 17.19 16.5 19.79"></polyline><polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const Icon5 = () => <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="text-slate-700"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="16"></line><line x1="8" y1="12" x2="16" y2="12"></line></svg>;

const services = [
  {
    title: 'Robotic Process Automation Solutions',
    description: 'Most trusted outcome -driven automation implementation partner of India',
    icon: <Icon1 />,
    bgImage: '/service-rpa.png', 
  },
  {
    title: 'ORACLE',
    description: 'Trusted Oracle solutions partner for enterprise-scale transformation.',
    icon: <Icon2 />,
    bgImage: '/service-oracle.png', 
  },
  {
    title: 'Business Intelligence',
    description: 'BI Dashboards with integrated AI to transform data into actionable decisions and insights.',
    icon: <Icon4 />,
    bgImage: '/service-bi.png',
  },
  {
    title: 'Enterprise Resource Planning (ERP)',
    description: 'Unify your business operations with AI-powered insights and automation for faster, smarter....',
    icon: <Icon3 />,
    bgImage: '/service-erp.png',
  },
  {
    title: 'Enterprise Mobility Solutions (EMS)',
    description: 'Smarter mobility for a secure and connected workforce.',
    icon: <Icon1 />,
    bgImage: '/service-ems.png',
  },
  {
    title: 'Other solutions',
    description: 'Explore more solutions built to support business growth.',
    icon: <Icon5 />,
    bgImage: '/service-bi.png',
  },
];

export function ServicesSection() {
  return (
    <section className="py-24 bg-white relative z-10 overflow-hidden">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <MotionSection variant="fadeUp" className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900 mb-6">
            Services we offer
          </h2>
          <p className="text-slate-400 text-lg md:text-xl font-light max-w-2xl mx-auto">
            Manage your operations with guidance that evolves with your business goals.
          </p>
        </MotionSection>

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Spotlight key={index} color="rgba(75, 42, 99, 1)" size={300} opacity={0.1}>
              <motion.div
                variants={{
                  initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
                  animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
                }}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
                className="group relative h-[320px] rounded-[24px] overflow-hidden cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(75,42,99,0.08)] transition-all duration-500 bg-white border border-slate-100"
              >
                {/* === Default State (White Card) === */}
                <div className="absolute inset-0 p-8 flex flex-col transition-all duration-500 ease-in-out group-hover:opacity-0 z-10">
                  <div className="mb-8 transform group-hover:scale-110 transition-transform duration-500 origin-left">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 leading-tight mb-4 pr-4">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-slate-500 leading-relaxed mb-auto line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-8">
                    <div className="inline-flex items-center text-[#4B2A63] text-[13px] font-bold group/btn cursor-pointer hover:opacity-80 transition-opacity">
                      View more
                      <svg className="ml-2 w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                    </div>
                  </div>
                </div>

                {/* === Hover State (Dark Image Card) === */}
                <div className="absolute inset-0 rounded-[24px] flex flex-col p-8 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out z-20 overflow-hidden">
                  <motion.div 
                    whileHover={{ scale: 1.1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center -z-10"
                    style={{ backgroundImage: `url(${service.bgImage})` }}
                  />
                  {/* Dark overlay to make text readable */}
                  <div className="absolute inset-0 bg-[#4B2A63]/60 backdrop-blur-[2px] -z-10" />
                  
                  <div className="mb-8">
                    {/* White Icon for hover */}
                    <div className="text-white brightness-200">
                      {service.icon}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-tight mb-4">
                    {service.title}
                  </h3>
                  <p className="text-[14px] text-slate-200 leading-relaxed mb-auto line-clamp-3">
                    {service.description}
                  </p>
                  <div className="mt-8">
                    <Button className="bg-white text-[#4B2A63] hover:bg-slate-50 rounded-full px-8 h-12 text-[14px] font-bold shadow-2xl transition-all duration-300 active:scale-95 cursor-pointer">
                      View more
                    </Button>
                  </div>
                </div>

              </motion.div>
            </Spotlight>
          ))}
        </StaggerContainer>


        <MotionSection variant="fadeUp" delay={0.4} className="mt-16 text-center">
          <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-12 h-[54px] text-[16px] font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95">
            View all solutions
          </Button>
        </MotionSection>

      </div>
    </section>
  );
}
