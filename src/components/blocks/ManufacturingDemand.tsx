'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { FormattedText } from '@/components/ui/FormattedText';

export default function ManufacturingDemand({ content }: { content?: any }) {
  const title = content?.title || 'Lorem demand, Lorem,<br />ipsum, incididunt ,<br />commodo ,  adipiscing.';
  const paragraph1 = content?.paragraph1 || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.';
  const paragraph2 = content?.paragraph2 || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

  return (
    <section className="py-14 bg-white px-6 border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="grid md:grid-cols-2 gap-4 md:gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <FormattedText content={title} as="h2" className="text-3xl md:text-[40px] font-bold text-[#27256b] leading-[1.3] tracking-tight" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6 text-slate-500 text-[14px] leading-relaxed border-l-0 md:border-l-[1.5px] border-slate-200 pl-0 md:pl-6 lg:pl-12 py-2"
          >
            <FormattedText content={paragraph1} />
            <FormattedText content={paragraph2} />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
