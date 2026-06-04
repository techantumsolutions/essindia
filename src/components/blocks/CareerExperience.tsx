'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function CareerExperience({ content }: { content?: any }) {
  const {
    title = 'Get hands-on experience on cutting\nedge enterprise software products.',
    subtitle = 'We believe great engineers deserve more than a desk\nand a deadline.',
    products = [
      { name: 'Aviation Software', icon: '/Career-Page/aprs_svgrepo.com.png' },
      { name: 'Global Payroll', icon: '/Career-Page/global-payroll 1.png' },
      { name: 'ERP Software', icon: '/Career-Page/erp-software 1.png' },
      { name: 'Logistics Software', icon: '/Career-Page/logistics-software 1.png' },
    ]
  } = content || {};

  return (
    <section className="py-15 px-6 bg-white">
      <div className="container mx-auto max-w-7xl text-center">
        <h2
          className="text-3xl md:text-4xl font-bold text-slate-900 mb-6 max-w-2xl mx-auto leading-none"
          dangerouslySetInnerHTML={{ __html: title.replace(/\n/g, '<br />') }}
        />
        <p
          className="text-[#9CA3AF] max-w-2xl mx-auto text-2xl font-light leading-snug mb-20"
          dangerouslySetInnerHTML={{ __html: subtitle.replace(/\n/g, '<br />') }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {products.map((product: any, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center group cursor-pointer"
            >
              <div className="w-24 h-24 mb-6 relative transition-transform duration-300 group-hover:-translate-y-2">
                <img
                  src={product.icon}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              </div>
              <h3 className="text-[20px] font-light text-[#3F3F46]">
                {product.name}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
