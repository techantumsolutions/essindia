'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CareerPositions({ content }: { content?: any }) {
  const router = useRouter();
  const [dynamicPositions, setDynamicPositions] = React.useState<any[] | null>(null);

  React.useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch('/api/careers');
        if (res.ok) {
          const data = await res.json();
          setDynamicPositions(data);
        }
      } catch (err) {
        console.error('Failed to load career opportunities', err);
      }
    };
    fetchPositions();
  }, []);

  const {
    title = 'Open Positions',
    subtitle = 'Find your perfect role and help us shape the future of enterprise software.',
    positions: staticPositions = [
      {
        id: '1',
        title: 'Technical Writer / Documentation Specialist',
        department: 'Product',
        description: 'Develop clear and comprehensive technical documentation, user guides, and API documentation for our products.',
        type: 'Full-Time',
        experience: '0-2 Years',
        location: 'Remote',
      },
      {
        id: '2',
        title: 'Technical Content Developer',
        department: 'Marketing',
        description: 'Write and manage content that explains complex technical topics in an accessible way for the wider audience.',
        type: 'Full-Time',
        experience: '0-2 Years',
        location: 'Hybrid',
      },
      {
        id: '3',
        title: 'Python Backend Developer',
        department: 'Engineering',
        description: 'Build scalable backend systems and APIs using Python and related frameworks. Ensure high performance and responsiveness.',
        type: 'Full-Time',
        experience: '2-5 Years',
        location: 'In-office',
      }
    ]
  } = content || {};

  const displayPositions = dynamicPositions && dynamicPositions.length > 0 ? dynamicPositions : staticPositions;

  return (
    <section className="py-14 px-6 bg-white">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{title}</h2>
          <p className="max-w-2xl mx-auto text-xl font-medium leading-relaxed text-slate-500">
            {subtitle}
          </p>
        </div>

        <div className="space-y-4">
          {displayPositions.map((pos: any, index: number) => (
            <motion.div
              key={pos.id || index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 md:p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-md transition-shadow"
            >
              <div className="flex-1">
                <div className="text-xs font-bold text-[#422295] uppercase tracking-wider mb-2">
                  {pos.department}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{pos.title}</h3>
                <p className="text-slate-500 text-sm mb-4 max-w-2xl">
                  {pos.description}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-semibold">
                  {pos.location ? pos.location.split(',').map((loc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1 rounded-md">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {loc.trim()}
                    </div>
                  )) : null}
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-slate-400" />
                    {pos.experience}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Briefcase className="w-4 h-4 text-slate-400" />
                    {pos.type}
                  </div>
                </div>
              </div>
              <div className="flex-shrink-0 pt-4 md:pt-0 md:border-l border-slate-100 md:pl-8 flex items-center">
                <button
                  onClick={() => router.push(`/careers/${pos.slug || pos.id}`)}
                  className="bg-[#422295] text-white cursor-pointer hover:bg-[#321575] px-6 py-2.5 rounded-full text-xs font-bold transition-all duration-300 inline-flex items-center gap-2 shadow-sm hover:shadow-md"
                >
                  View & Apply
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
