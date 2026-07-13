'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Calendar, User, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useInternalNavigate } from '@/hooks/useInternalNavigate';

import { defaultCaseStudies, type CaseStudyPost } from '@/lib/case-studies-data';

interface CaseStudyListContent {
  badgeText?: string;
  headingText?: string;
  subheadingText?: string;
  bgImage?: string;
}

interface CaseStudyListSectionProps {
  content?: CaseStudyListContent;
}

const TOPICS = [
  'Business Intelligence',
  'ERP Solutions',
  'IoT Solutions',
  'Mobile App Solutions',
  'CRM Solutions',
  'Sales Force Automation',
  'After-Sales Service App'
];

const INDUSTRIES = [
  'Industries',
  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics'
];

export function CaseStudyListSection({ content }: CaseStudyListSectionProps) {
  const navigate = useInternalNavigate();
  const badge = content?.badgeText || 'Case Studies';
  const heading = content?.headingText || 'Explore our knowledge hub';
  const subheading = content?.subheadingText || 'Explore how Maathra has helped enterprises worldwide transform their operations with Oracle APEX and Cloud solutions.';
  const bgImage = content?.bgImage || '/Case-studies/banner.png';

  // State
  const [caseStudies, setCaseStudies] = React.useState<CaseStudyPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Accordion State
  const [topicsOpen, setTopicsOpen] = React.useState(false);
  const [industriesOpen, setIndustriesOpen] = React.useState(false);

  // Fetch case studies from API
  React.useEffect(() => {
    async function fetchCaseStudies() {
      try {
        const res = await fetch('/api/case-studies');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            setCaseStudies(data);
          } else {
            setCaseStudies(defaultCaseStudies);
          }
        } else {
          setCaseStudies(defaultCaseStudies);
        }
      } catch (err) {
        console.error('Failed to load dynamic case studies, using fallback', err);
        setCaseStudies(defaultCaseStudies);
      } finally {
        setLoading(false);
      }
    }
    fetchCaseStudies();
  }, []);

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
  const filteredCaseStudies = React.useMemo(() => {
    return caseStudies.filter(cs => {
      // Search matching
      const matchesSearch = searchQuery === '' ||
        cs.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cs.overviewHtml.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(cs.topic);

      const matchesIndustry = selectedIndustries.length === 0 ||
        cs.industries.some(ind => selectedIndustries.includes(ind));

      return matchesSearch && matchesTopic && matchesIndustry;
    });
  }, [caseStudies, searchQuery, selectedTopics, selectedIndustries]);

  const displayedCaseStudies = React.useMemo(() => {
    return filteredCaseStudies.slice(0, visibleCount);
  }, [filteredCaseStudies, visibleCount]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredCaseStudies.length));
  };

  return (
    <section
      className="bg-white min-h-screen"

    >
      {/* Premium Hero Banner with header offset */}
      <div
        className={`relative pt-40 pb-14 text-center px-4 overflow-hidden`}
        style={bgImage ? {
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        } : { backgroundColor: '#242A4A' }}
      >
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="px-6 py-1.5 rounded-full bg-white text-[#4A2C5A] text-sm font-bold shadow-md tracking-wide"
          >
            {badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-[56px] font-light text-white tracking-wide leading-tight mt-2 mb-2"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm md:text-base text-white/80 max-w-2xl font-light leading-relaxed"
          >
            {subheading}
          </motion.p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Left Column: Filter Sidebar */}
          <div className="col-span-1 space-y-3 lg:sticky lg:top-32 h-fit">

            {/* Search Bar */}
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-[#4a2c5a]/20 focus-within:border-[#4a2c5a] transition-all">
              <Search className="w-4 h-4 text-slate-400 mr-3" />
              <input
                type="text"
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent text-sm font-medium outline-none text-slate-700 placeholder:text-slate-400"
              />
            </div>

            <div className="bg-white border border-slate-100 rounded-3xl p-6 shadow-sm space-y-6">

              {/* Header */}
              <div className="flex items-center gap-2 pb-4 border-b border-slate-100">
                <SlidersHorizontal className="w-4 h-4 text-[#4a2c5a]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Filters</h3>
              </div>

              {/* Topics Filter */}
              <div className="space-y-4">
                <button
                  onClick={() => setTopicsOpen(!topicsOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-[#1a1a1a] text-lg py-1"
                >
                  Topic
                  {topicsOpen ? <ChevronUp className="w-5 h-5 text-slate-600 font-light" /> : <ChevronDown className="w-5 h-5 text-slate-600 font-light" />}
                </button>

                <AnimatePresence initial={false}>
                  {topicsOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-1 space-y-2.5 pt-1"
                    >
                      {TOPICS.map(topic => {
                        const isChecked = selectedTopics.includes(topic);
                        return (
                          <label key={topic} className="flex items-center gap-3 text-sm text-[#404040] font-normal cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleTopic(topic)}
                              className="w-[18px] h-[18px] rounded-sm border-slate-300 text-[#242A4A] focus:ring-[#242A4A] focus:ring-offset-0 cursor-pointer accent-[#242A4A]"
                            />
                            <span>
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
              <div className="space-y-4 pt-6">
                <button
                  onClick={() => setIndustriesOpen(!industriesOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-[#1a1a1a] text-lg py-1"
                >
                  Industries
                  {industriesOpen ? <ChevronUp className="w-5 h-5 text-slate-600 font-light" /> : <ChevronDown className="w-5 h-5 text-slate-600 font-light" />}
                </button>

                <AnimatePresence initial={false}>
                  {industriesOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden pl-1 space-y-2.5 pt-1"
                    >
                      {INDUSTRIES.map(industry => {
                        const isChecked = selectedIndustries.includes(industry);
                        return (
                          <label key={industry} className="flex items-center gap-3 text-sm text-[#404040] font-normal cursor-pointer select-none group">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => toggleIndustry(industry)}
                              className="w-[18px] h-[18px] rounded-sm border-slate-300 text-[#242A4A] focus:ring-[#242A4A] focus:ring-offset-0 cursor-pointer accent-[#242A4A]"
                            />
                            <span>
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

          {/* Right Column: Blog Grid */}
          <div className="col-span-1 lg:col-span-3 space-y-12">

            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#5C2B6A] mx-auto"></div>
                <p className="text-slate-400 text-sm mt-4 font-bold">Loading case studies...</p>
              </div>
            ) : displayedCaseStudies.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-slate-50 rounded-[32px] p-16 text-center border border-dashed border-slate-200"
              >
                <SlidersHorizontal className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                <h4 className="text-lg font-bold text-slate-700 mb-2">No articles match your filters</h4>
                <p className="text-sm text-slate-400 max-w-sm mx-auto">Try resetting some of your Topics or Industries checkboxes to see more news.</p>
                <Button
                  onClick={() => { setSelectedTopics([]); setSelectedIndustries([]); setSearchQuery(''); }}
                  className="bg-[#4a2c5a] hover:bg-[#2a1b38] text-white rounded-full mt-6 px-6 h-10 font-bold"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedCaseStudies.map((cs, idx) => {
                      const detailLink = (cs as any).fullPath || `/case-studies/${cs.slug}`;
                      return (
                        <motion.div
                          layout
                          key={cs.slug}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="flex flex-col group cursor-pointer bg-white border border-[#4a2c5a]/20 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all p-3"
                          onClick={() => navigate(detailLink)}
                        >
                          {/* Image */}
                          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                            <motion.img
                              src={cs.image}
                              alt={cs.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>

                          {/* Content Body */}
                          <div className="pt-5 pb-2 px-1 flex-1 flex flex-col justify-between">
                            <div className="space-y-3">
                              <div>
                                <span className="inline-block px-3 py-1 rounded-full border border-[#4a2c5a]/30 text-[10px] font-bold text-[#4a2c5a] tracking-wide">
                                  {cs.topic || 'Category Name'}
                                </span>
                              </div>
                              <h3 className="text-[17px] font-bold text-[#1a1a1a] leading-snug group-hover:text-[#4a2c5a] transition-colors line-clamp-3">
                                {cs.title}
                              </h3>
                            </div>

                            {/* Footer */}
                            <div className="pt-6 flex items-center justify-between mt-auto">
                              <p className="text-[13px] text-slate-500 font-medium">{cs.date}</p>
                              <ArrowRight className="w-5 h-5 text-[#242A4A] transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Trigger */}
                {filteredCaseStudies.length > displayedCaseStudies.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center pt-8"
                  >
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      className="border-[#4a2c5a]/20 hover:border-[#4a2c5a] hover:bg-[#4a2c5a]/5 text-slate-700 rounded-full px-10 h-12 font-bold transition-all hover:scale-105"
                    >
                      Load More
                    </Button>
                  </motion.div>
                )}
              </>
            )}

          </div>

        </div>
      </div>
    </section>
  );
}
