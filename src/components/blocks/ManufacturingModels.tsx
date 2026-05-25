'use client';

import React from 'react';
import { motion } from 'framer-motion';

const models = [
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-1.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-2.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-3.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-4.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-5.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-6.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-7.png'
  },
  {
    title: 'Lorem ipsum',
    desc: 'Lorem ipsum dolor sit amet, labore et dolore magna aliqua. Ut enim ad minim veniam.',
    img: '/Modules-manufacturing/industries-8.png'
  },
];

export default function ManufacturingModels() {
  return (
    <section className="py-14 bg-white px-6">
      <div className="container mx-auto  max-w-7xl">
        <div className="text-center mb-14 space-y-2">
          <div className="text-[14px] font-bold text-slate-800">
            Lorem ipsum
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-[44px] font-extrabold text-[#27256b] leading-[1.1] tracking-tight">
            Lorem ipsum dolor sit amet, consectetur.<br />
            ipsum dolor sit models.
          </h2>
          <p className="text-slate-500 text-[16px] max-w-3xl mx-auto pt-2">
            Lorem ipsum dolor sit amet, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {models.map((model, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col"
            >
              <div className="h-[180px] w-full overflow-hidden">
                <img
                  src={model.img}
                  alt={model.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <h3 className="text-[17px] font-bold text-[#27256b]">{model.title}</h3>
                <p className="text-[13px] text-slate-500">
                  {model.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
