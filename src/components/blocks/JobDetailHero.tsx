'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Clock, Briefcase, Building } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function JobDetailHero({ content }: { content?: any }) {
  const router = useRouter();

  const {
    backLinkText = 'Back to Careers',
    backLinkUrl = '/careers',
    tags = ['Engineering', 'Full-time'],
    jobTitle = 'Microsoft .NET Backend Developer',
    meta = [
      { icon: 'MapPin', text: 'India' },
      { icon: 'Clock', text: '3-5 years' },
      { icon: 'Briefcase', text: 'Full-time' },
      { icon: 'Building', text: 'Engineering' }
    ]
  } = content || {};

  const getIcon = (name: string) => {
    switch (name) {
      case 'MapPin': return <MapPin className="w-4 h-4 mr-1.5 text-[#27256B]" />;
      case 'Clock': return <Clock className="w-4 h-4 mr-1.5 text-[#27256B]" />;
      case 'Briefcase': return <Briefcase className="w-4 h-4 mr-1.5 text-[#27256B]" />;
      case 'Building': return <Building className="w-4 h-4 mr-1.5 text-[#27256B]" />;
      default: return null;
    }
  };

  const handleBack = () => {
    // If there's a history stack, go back to the previous page (e.g. retail-services).
    // Otherwise fall back to the configured backLinkUrl.
    if (window.history.length > 1) {
      router.back();
    } else {
      router.push(backLinkUrl);
    }
  };

  return (
    <section className="bg-[#e4e4e7] pt-32 pb-16 px-6 lg:px-8">
      <div className="container mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="inline-flex items-center text-[13px] font-medium text-slate-500 hover:text-slate-800 transition-colors mb-8 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {backLinkText}
          </button>

          {/* Tags */}
          <div className="flex items-center gap-3 mb-6">
            {tags.map((tag: string, index: number) => (
              <span key={index} className="inline-block bg-white text-slate-800 text-[11px] font-semibold px-3 py-1 rounded-full uppercase tracking-wide">
                {tag}
              </span>
            ))}
          </div>

          {/* Job Title */}
          <h1 className="text-4xl md:text-5xl lg:text-[56px] font-bold text-slate-900 mb-8 tracking-tight">
            {jobTitle}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-6 text-[15px] text-slate-600 font-medium">
            {meta.map((item: any, index: number) => (
              <div key={index} className="flex items-center">
                {getIcon(item.icon)}
                {item.text}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
