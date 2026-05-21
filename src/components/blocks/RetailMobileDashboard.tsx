'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';

export interface DashboardModule {
  title: string;
  features: string[];
}

export interface RetailMobileDashboardContent {
  modules?: DashboardModule[];
}

export function RetailMobileDashboard({ content }: { content: RetailMobileDashboardContent }) {
  const {
    modules = [
      {
        title: 'Lorem Ipsum Dolor',
        features: [
          'Lorem ipsum dolor sit amet',
          'Consectetur adipiscing elit',
          'Sed do eiusmod tempor',
          'Incididunt ut labore',
          'Et dolore magna aliqua',
          'Ut enim ad minim veniam',
          'Quis nostrud exercitation',
          'Ullamco laboris nisi',
          'Ut aliquip ex ea commodo',
          'Consequat duis aute irure'
        ]
      },
      {
        title: 'Lorem Ipsum Dolor',
        features: [
          'Lorem ipsum dolor sit amet',
          'Consectetur adipiscing elit',
          'Sed do eiusmod tempor',
          'Incididunt ut labore'
        ]
      },
      {
        title: 'Lorem Ipsum Dolor',
        features: [
          'Lorem ipsum dolor sit amet',
          'Consectetur adipiscing elit',
          'Sed do eiusmod tempor',
          'Incididunt ut labore'
        ]
      }
    ],
  } = content || {};

  const [openIndex, setOpenIndex] = useState<number>(0);

  return (
    <section className="py-14 bg-[#fbfcfd]">
      <div className="container mx-auto px-4 md:px-6 max-w-7xl">
        <div className="flex flex-col gap-4">
          {modules.map((mod, idx) => (
            <div 
              key={idx} 
              className={`border rounded-xl bg-white shadow-sm overflow-hidden transition-colors ${openIndex === idx ? 'border-indigo-200' : 'border-slate-200 hover:border-indigo-100'}`}
            >
              <button
                onClick={() => setOpenIndex(openIndex === idx ? -1 : idx)}
                className="w-full px-6 py-4 flex items-center justify-between focus:outline-none"
              >
                <h3 className={`font-semibold text-lg ${openIndex === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {mod.title}
                </h3>
                <div className={`p-1 rounded-full ${openIndex === idx ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400'}`}>
                  {openIndex === idx ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </div>
              </button>
              
              <AnimatePresence>
                {openIndex === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="px-6 pb-6 pt-2">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                        {mod.features.map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start space-x-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-slate-600 text-sm md:text-base">{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
