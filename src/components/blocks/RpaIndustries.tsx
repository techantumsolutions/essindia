'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

interface IndustryItem {
  title: string;
  description: string;
  icon: string;
}

interface RpaIndustriesContent {
  title?: string;
  description?: string;
  industries?: IndustryItem[];
}

export function RpaIndustries({ content }: { content?: RpaIndustriesContent }) {
  const title = content?.title || 'Empowering Industries through Intelligent RPA';
  const description = content?.description || 'RPA helps organizations optimize workflows, improve compliance, accelerate digital transformation, and reimagine repetitive business processes across sectors.';

  const defaultIndustries: IndustryItem[] = [
    {
      title: 'Retail',
      description: 'Streamline billing, returns, inventory updates, and customer service workflows through Robotic Process Automation...',
      icon: '/RPA-Robotic Process Automation (RPA)/front-store-with-awning_svgrepo.com.png'
    },
    {
      title: 'Manufacturing',
      description: 'With RPA, automation of supply chain tasks like invoice processing, order fulfillment, and BOM...',
      icon: '/RPA-Robotic Process Automation (RPA)/industrial-robot-factory_svgrepo.com.png'
    },
    {
      title: 'Logistics',
      description: 'Track shipments, manage invoicing, and synchronize warehousing systems seamlessly with RPA service...',
      icon: '/RPA-Robotic Process Automation (RPA)/delivery-truck-box-delivery_svgrepo.com.png'
    },
    {
      title: 'Automobile',
      description: 'Automate procurement, dealer communications, and compliance reporting using RPA solutions...',
      icon: '/RPA-Robotic Process Automation (RPA)/car-roof-box_svgrepo.com.png'
    },
    {
      title: 'FMCG',
      description: 'Leverage RPA to power demand forecasting, manage distributor billing, and handle large-scale invoicing...',
      icon: '/RPA-Robotic Process Automation (RPA)/groceries-grocery_svgrepo.com.png'
    },
    {
      title: 'Trading',
      description: 'Speed up reporting cycles, strengthen compliance, and automate order management for seamless business...',
      icon: '/RPA-Robotic Process Automation (RPA)/construction-crane_svgrepo.com.png'
    },
    {
      title: 'Hospitality',
      description: 'Automate reservation handling, deliver enhanced guest experiences, and optimize back-office operations...',
      icon: '/RPA-Robotic Process Automation (RPA)/hospital_svgrepo.com.png'
    },
    {
      title: 'BFSI',
      description: 'Enhance compliance, accelerate fraud detection, and make claims processing faster and more reliable....',
      icon: '/RPA-Robotic Process Automation (RPA)/bank-building-city_svgrepo.com.png'
    },
    {
      title: 'Pharmaceutical',
      description: 'Use RPA to reduce manual errors in regulatory reporting, manage lab data effectively, and optimize...',
      icon: '/RPA-Robotic Process Automation (RPA)/medical-record-medical-hospital-pharmacy-healthcare_svgrepo.com.png'
    },
    {
      title: 'Telecom',
      description: 'Optimize billing, customer onboarding, and service request handling, leveraging robotic process automation processes',
      icon: '/RPA-Robotic Process Automation (RPA)/tower-with-signal_svgrepo.com.png'
    },
    {
      title: 'Healthcare',
      description: 'Improve patient data accuracy, streamline claim processing, and ensure regulatory compliance',
      icon: '/RPA-Robotic Process Automation (RPA)/healthcare-ambulance_svgrepo.com.png'
    },
    {
      title: 'Tourism',
      description: 'Automate bookings, cancellations, and administrative tasks to create a hassle-free travel experience',
      icon: '/RPA-Robotic Process Automation (RPA)/outdoor-trip-traveling_svgrepo.com.png'
    }
  ];

  const industries = content?.industries && content.industries.length > 0 ? content.industries : defaultIndustries;

  return (
    <section className="py-14 bg-white font-sans">
      <div className="container mx-auto max-w-7xl px-6">

        {/* Header */}
        <div className="max-w-4xl mx-auto text-center space-y-2 mb-6">
          {title && (
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-3xl sm:text-4xl font-bold text-[#343274] tracking-tight leading-tight"
            >
              {title}
            </motion.h2>
          )}
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-slate-500 font-light text-base sm:text-lg leading-relaxed max-w-3xl mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* 12-item Table-style Bordered Grid of Industries */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px] bg-slate-200/80 border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
          {industries.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (idx % 4) * 0.04 }}
              className="bg-white p-8 flex flex-col items-start text-left space-y-4 hover:bg-slate-50/50 transition-colors duration-300 group"
            >
              {/* Icon Container */}
              {item.icon && (
                <div className="w-12 h-12 relative flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={item.icon}
                    alt={item.title}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              {/* Text details */}
              <div className="space-y-2 min-w-0">
                <h4 className="text-lg font-bold text-[#343274] transition-colors duration-300">
                  {item.title}
                </h4>
                <p className="text-sm text-slate-500 font-light leading-relaxed">
                  {item.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
