'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, SlidersHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Testimonial {
  quote: string;
  authorName: string;
  authorTitle: string;
  authorAvatar: string;
  companyName?: string;
  logoUrl?: string;
  topic: string;
  industry: string;
}

interface TestimonialsContent {
  badgeText?: string;
  badgeBgColor?: string;
  badgeTextColor?: string;
  headingText?: string;
  title?: string;
  titleColor?: string;
  subheadingText?: string;
  description?: string;
  descriptionColor?: string;
  bgColor?: string;
  bgImage?: string;
  testimonials?: Testimonial[];
}

interface TestimonialsSectionProps {
  content?: TestimonialsContent;
}

const DEFAULT_TOPICS = [
  'Business Intelligence',
  'ERP Solutions',
  'IoT Solutions',
  'Mobile App Solutions',
  'CRM Solutions',
  'Sales Force Automation',
  'After-Sales Service App'
];

const DEFAULT_INDUSTRIES = [
  'Industries',
  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics'
];

export function TestimonialsSection({ content }: TestimonialsSectionProps) {
  const badge = content?.badgeText || 'Testimonials';
  const badgeBgColor = content?.badgeBgColor || '#ffffff';
  const badgeTextColor = content?.badgeTextColor || '#0d0720';
  const heading = content?.title || content?.headingText || 'Trusted by Businesses Worldwide';
  const headingColor = content?.titleColor || '#ffffff';
  const subheading = content?.description || content?.subheadingText || 'Empowering enterprises across industries with scalable digital solutions and intelligent automation. Trusted by growing businesses and enterprise teams across multiple countries for delivering innovation, efficiency, and measurable business outcomes.';
  const subheadingColor = content?.descriptionColor || '#cbd5e1';
  const bgColor = content?.bgColor || '#0d0720';
  const bgImage = content?.bgImage;
  const testimonials = content?.testimonials || [];

  // State
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = React.useState<string[]>([]);
  const [topicsOpen, setTopicsOpen] = React.useState(true);
  const [industriesOpen, setIndustriesOpen] = React.useState(true);

  // Dynamic lists from testimonials if they have extra tags, combined with defaults
  const topicsList = React.useMemo(() => {
    const uniqueTags = new Set(testimonials.map(t => t.topic).filter(Boolean));
    const merged = Array.from(new Set([...DEFAULT_TOPICS, ...uniqueTags]));
    return merged;
  }, [testimonials]);

  const industriesList = React.useMemo(() => {
    const uniqueTags = new Set(testimonials.map(t => t.industry).filter(Boolean));
    const merged = Array.from(new Set([...DEFAULT_INDUSTRIES, ...uniqueTags]));
    return merged;
  }, [testimonials]);

  // Filter handlers
  const toggleTopic = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic) ? prev.filter(t => t !== topic) : [...prev, topic]
    );
  };

  const toggleIndustry = (industry: string) => {
    setSelectedIndustries(prev =>
      prev.includes(industry) ? prev.filter(i => i !== industry) : [...prev, industry]
    );
  };

  // Filter logic
  const filteredTestimonials = React.useMemo(() => {
    return testimonials.filter(item => {
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(item.topic);
      const matchesIndustry = selectedIndustries.length === 0 || selectedIndustries.includes(item.industry);
      return matchesTopic && matchesIndustry;
    });
  }, [testimonials, selectedTopics, selectedIndustries]);

  return (
    <section className="bg-white min-h-screen">
      {/* Premium Dark Glowing Hero Banner */}
      <div
        className="relative pt-40 pb-28 text-center px-4 overflow-hidden"
        style={{
          backgroundColor: bgColor,
          backgroundImage: bgImage ? `url('${bgImage}')` : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {!bgImage && (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.18)_0%,transparent_60%)] pointer-events-none" />
        )}
        <div className="relative max-w-4xl mx-auto flex flex-col items-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="px-6 py-1.5 rounded-full text-xs font-bold shadow-md uppercase tracking-wider mb-6"
            style={{
              backgroundColor: badgeBgColor,
              color: badgeTextColor,
            }}
          >
            {badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-extralight tracking-tight leading-tight mb-4"
            style={{ color: headingColor }}
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm max-w-2xl font-light leading-relaxed"
            style={{ color: subheadingColor }}
          >
            {subheading}
          </motion.p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          
          {/* Left Column: Filter Sidebar */}
          <div className="col-span-1 space-y-6 lg:sticky lg:top-32 h-fit">
            <div className="bg-white border border-slate-100 rounded-[28px] p-6 shadow-sm space-y-6">
              
              {/* Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-[#4B2A63]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Filters</h3>
              </div>

              {/* Topics Filter */}
              <div className="space-y-3">
                <button
                  onClick={() => setTopicsOpen(!topicsOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-700 text-sm py-1 hover:text-[#4B2A63]"
                >
                  Topic
                  {topicsOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence initial={false}>
                  {topicsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-1 space-y-2.5 pt-1"
                    >
                      {topicsList.map(topic => {
                        const isChecked = selectedTopics.includes(topic);
                        return (
                          <label key={topic} className="flex items-center gap-3 text-xs text-slate-600 font-medium cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTopic(topic)}
                              className="w-4.5 h-4.5 rounded border-slate-300 text-[#4B2A63] focus:ring-[#4B2A63] focus:ring-offset-0 cursor-pointer accent-[#4B2A63]"
                            />
                            <span className={isChecked ? 'text-slate-900 font-bold' : 'group-hover:text-slate-900 transition-colors'}>
                              {topic}
                            </span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Industries Filter */}
              <div className="space-y-3 pt-2 border-t border-slate-50">
                <button
                  onClick={() => setIndustriesOpen(!industriesOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-700 text-sm py-1 hover:text-[#4B2A63]"
                >
                  Industries
                  {industriesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                <AnimatePresence initial={false}>
                  {industriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-1 space-y-2.5 pt-1"
                    >
                      {industriesList.map(industry => {
                        const isChecked = selectedIndustries.includes(industry);
                        return (
                          <label key={industry} className="flex items-center gap-3 text-xs text-slate-600 font-medium cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleIndustry(industry)}
                              className="w-4.5 h-4.5 rounded border-slate-300 text-[#4B2A63] focus:ring-[#4B2A63] focus:ring-offset-0 cursor-pointer accent-[#4B2A63]"
                            />
                            <span className={isChecked ? 'text-slate-900 font-bold' : 'group-hover:text-slate-900 transition-colors'}>
                              {industry}
                            </span>
                          </label>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Right Column: Testimonial Cards Grid */}
          <div className="col-span-1 lg:col-span-3 space-y-8">
            {filteredTestimonials.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-[28px] p-16 text-center border border-dashed border-slate-200"
              >
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-700 mb-2">No testimonials match your filters</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">Try resetting some of your Topics or Industries checkboxes to see more client reviews.</p>
                <button
                  onClick={() => { setSelectedTopics([]); setSelectedIndustries([]); }}
                  className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full mt-6 px-6 py-2.5 text-sm font-bold shadow-sm transition-all"
                >
                  Clear Filters
                </button>
              </motion.div>
            ) : (
              <motion.div
                layout
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {filteredTestimonials.map((item, idx) => {
                    const fallbackAvatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.authorName || 'User'}`;
                    return (
                      <motion.div
                        layout
                        key={`${item.authorName}-${idx}`}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.4 }}
                        whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        className="flex flex-col justify-between bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all"
                      >
                        <div className="space-y-4">
                          {/* Logo or Brand header */}
                          <div className="h-8 flex items-center">
                            {item.logoUrl ? (
                              <img
                                src={item.logoUrl}
                                alt={item.companyName || 'logo'}
                                className="h-full max-w-[120px] object-contain"
                                onError={(e) => {
                                  // Hide broken image and render text fallback
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : item.companyName ? (
                              <span className="text-[#4b6bfb] font-black text-lg tracking-tight">
                                {item.companyName.toLowerCase()}
                              </span>
                            ) : null}
                          </div>

                          {/* Quote text */}
                          <p className="text-slate-600 text-sm leading-relaxed">
                            {item.quote}
                          </p>
                        </div>

                        {/* Author info footer */}
                        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-50">
                          <img
                            src={item.authorAvatar || fallbackAvatar}
                            alt={item.authorName}
                            className="w-10 h-10 rounded-full object-cover border border-slate-100 bg-slate-50"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = fallbackAvatar;
                            }}
                          />
                          <div>
                            <p className="text-xs font-bold text-slate-800">{item.authorName}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{item.authorTitle}</p>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
