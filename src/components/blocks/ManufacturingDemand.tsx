'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ManufacturingDemand() {
  return (
    <section className="py-14 bg-white px-6 border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-[40px] font-bold text-[#27256b] leading-[1.3] tracking-tight">
              Connect demand, capacity,<br />
              material, manpower,<br />
              machines, and quality.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-slate-500 text-[14px] leading-relaxed border-l-[1.5px] border-slate-200 pl-8 md:pl-12 py-2"
          >
            <p>
              The ESS India Manufacturing Module is designed to simplify complex production processes and improve operational efficiency. From planning and procurement to shop floor execution and quality control, ebizframe ERP connects every stage of manufacturing into one intelligent platform.
            </p>
            <p>
              With real-time data, automated workflows, and advanced production monitoring, manufacturers can improve productivity, reduce waste, and make faster business decisions.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
