'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Search, Calendar, User, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';

import { defaultBlogs, type BlogPost } from '@/lib/blogs-data';

interface BlogListContent {
  badgeText?: string;
  headingText?: string;
  subheadingText?: string;
  bgImage?: string;
  topics?: string[];
  industries?: string[];
}

interface BlogListSectionProps {
  content?: BlogListContent;
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

  'FMCG',
  'Pharma',
  'Manufacturing',
  'Retail',
  'Electronics'
];

export function BlogListSection({ content }: BlogListSectionProps) {
  const badge = content?.badgeText || 'Latest Blogs';
  const heading = content?.headingText || 'Press & Media Resources';
  const subheading = content?.subheadingText || 'Everything journalists, analysts, and partners need to cover ESS — from brand assets to company facts. Everything journalists, analysts, and partners need to cover ESS— from brand assets to company facts.';
  const bgImage = content?.bgImage;
  const topicsList = content?.topics && content.topics.length > 0 ? content.topics : TOPICS;
  const industriesList = content?.industries && content.industries.length > 0 ? content.industries : INDUSTRIES;

  const pathname = usePathname();
  const isPreviewMode = pathname.startsWith('/admin') || pathname.includes('/preview');
  const isDefaultBlogPage = (pathname === '/blog' && content === undefined) || isPreviewMode;

  // State
  const [blogs, setBlogs] = React.useState<BlogPost[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [visibleCount, setVisibleCount] = React.useState(6);
  const [selectedTopics, setSelectedTopics] = React.useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = React.useState<string[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');

  // Accordion State
  const [topicsOpen, setTopicsOpen] = React.useState(false);
  const [industriesOpen, setIndustriesOpen] = React.useState(false);

  // Fetch blogs from API
  React.useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          if (data && data.length > 0) {
            // Sort by date (descending) or keep database order
            setBlogs(data);
          } else {
            setBlogs(isDefaultBlogPage ? defaultBlogs : []);
          }
        } else {
          setBlogs(isDefaultBlogPage ? defaultBlogs : []);
        }
      } catch (err) {
        console.error('Failed to load dynamic blogs', err);
        setBlogs(isDefaultBlogPage ? defaultBlogs : []);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, [isDefaultBlogPage]);

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
  const filteredBlogs = React.useMemo(() => {
    return blogs.filter(blog => {
      // Search matching
      const matchesSearch = searchQuery === '' ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        blog.description.toLowerCase().includes(searchQuery.toLowerCase());

      // If no check boxes are selected, treat as "show all" or "match if matching"
      const matchesTopic = selectedTopics.length === 0 || selectedTopics.includes(blog.topic);

      const matchesIndustry = selectedIndustries.length === 0 ||
        blog.industries.some(ind => selectedIndustries.includes(ind));

      return matchesSearch && matchesTopic && matchesIndustry;
    });
  }, [blogs, searchQuery, selectedTopics, selectedIndustries]);

  const displayedBlogs = React.useMemo(() => {
    return filteredBlogs.slice(0, visibleCount);
  }, [filteredBlogs, visibleCount]);

  const loadMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredBlogs.length));
  };

  return (
    <section
      className="bg-white min-h-screen"

    >
      {/* Premium Hero Banner with header offset */}
      <div
        className={`relative pt-40 pb-28 text-center px-4 overflow-hidden `}
        style={bgImage ? {
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          backgroundAttachment: 'fixed'
        } : undefined}
      >
        <div className="absolute inset-0 opacity-10" />
        <div className="relative max-w-4xl mx-auto flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="px-6 py-1.5  rounded-full bg-white text-[#0A2E2A] text-xs font-bold shadow-md uppercase tracking-wider  border border-slate-100"
          >
            {badge}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl md:text-6xl font-black font-extralight text-white tracking-tight leading-tight"
          >
            {heading}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-sm text-slate-200/90 max-w-2xl font-light leading-relaxed mb-4"
          >
            {subheading}
          </motion.p>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

          {/* Left Column: Filter Sidebar */}
          <div className="col-span-1 space-y-3 lg:sticky lg:top-32 h-fit">

            {/* Search Bar */}
            <div className="relative bg-slate-50 border border-slate-200/60 rounded-2xl px-4 py-2.5 flex items-center shadow-sm focus-within:ring-2 focus-within:ring-[#103D38]/20 focus-within:border-[#103D38] transition-all">
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
                <SlidersHorizontal className="w-4 h-4 text-[#103D38]" />
                <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Filters</h3>
              </div>

              {/* Topics Filter */}
              <div className="space-y-3">
                <button
                  onClick={() => setTopicsOpen(!topicsOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-700 text-sm py-1 hover:text-[#103D38]"
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
                              className="w-4.5 h-4.5 rounded border-slate-300 text-[#103D38] focus:ring-[#103D38] focus:ring-offset-0 cursor-pointer accent-[#103D38]"
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
              <div className="space-y-3 pt-2">
                <button
                  onClick={() => setIndustriesOpen(!industriesOpen)}
                  className="w-full flex items-center justify-between text-left font-bold text-slate-700 text-sm py-1 hover:text-[#103D38]"
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
                              className="w-4.5 h-4.5 rounded border-slate-300 text-[#103D38] focus:ring-[#103D38] focus:ring-offset-0 cursor-pointer accent-[#103D38]"
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

          {/* Right Column: Blog Grid */}
          <div className="col-span-1 lg:col-span-3 space-y-12">

            {loading ? (
              <div className="py-24 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#103D38] mx-auto"></div>
                <p className="text-slate-400 text-sm mt-4 font-bold">Loading articles...</p>
              </div>
            ) : displayedBlogs.length === 0 ? (
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
                  className="bg-[#103D38] hover:bg-[#0A2E2A] text-white rounded-full mt-6 px-6 h-10 font-bold"
                >
                  Clear Filters
                </Button>
              </motion.div>
            ) : (
              <>
                <motion.div
                  layout
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  <AnimatePresence mode="popLayout">
                    {displayedBlogs.map((blog, idx) => {
                      const detailLink = blog.fullPath || `/blog/${blog.slug}`;
                      return (
                        <motion.div
                          layout
                          key={blog.slug}
                          initial={{ opacity: 0, scale: 0.9, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.9, y: 20 }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          whileHover={{ y: -8, transition: { duration: 0.3 } }}
                          className="flex flex-col group cursor-pointer bg-white border border-slate-100 rounded-[28px] overflow-hidden shadow-sm hover:shadow-xl transition-all"
                          onClick={() => window.location.href = detailLink}
                        >
                          {/* Image */}
                          <div className="relative aspect-[16/10] bg-slate-100 overflow-hidden">
                            <motion.img
                              src={blog.image}
                              alt={blog.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = '/blog-1.png';
                              }}
                            />
                            {/* Topic & Industries Floating Tags */}
                            <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 items-center">
                              <div className="bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm text-left flex flex-col justify-center">
                                <span className="text-[9px] text-[#859bfc] font-bold uppercase tracking-wider block leading-none mb-1">Topic</span>
                                <span className="text-xs text-slate-800 font-semibold leading-none">{blog.topic}</span>
                              </div>
                              {blog.industries && blog.industries.filter((ind: string) => ind !== 'Industries').map((ind: string) => (
                                <div key={ind} className="bg-[#103D38]/95 backdrop-blur px-3 py-1.5 rounded-xl shadow-sm text-left flex flex-col justify-center">
                                  <span className="text-[9px] text-emerald-300 font-bold uppercase tracking-wider block leading-none mb-1">Industry</span>
                                  <span className="text-xs text-white font-semibold leading-none">{ind}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Content Body */}
                          <div className="py-4 px-3 flex-1 flex flex-col justify-between">
                            <div className="space-y-0">
                              <h3 className="text-[16px] font-black text-slate-800 leading-snug group-hover:text-[#103D38] transition-colors line-clamp-3">
                                {blog.title}
                              </h3>
                              {/* <p className="text-xs text-slate-400 font-normal leading-relaxed line-clamp-3">
                                {blog.description}
                              </p> */}
                            </div>

                            {/* Author & Footer */}
                            <div className="pt-3  border-t border-slate-50 flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <img
                                  src={blog.author.avatar}
                                  alt={blog.author.name}
                                  className="w-8 h-8 rounded-full border border-slate-100 bg-slate-50"
                                />
                                <div>
                                  <p className="text-[11px] font-black text-slate-700">{blog.author.name}</p>
                                  <p className="text-[9px] text-slate-400">{blog.date}</p>
                                </div>
                              </div>
                              {/* <div className="w-8 h-8 rounded-full bg-[#103D38]/5 group-hover:bg-[#103D38] text-[#103D38] group-hover:text-white flex items-center justify-center transition-colors">
                                <ArrowRight className="w-3.5 h-3.5" />
                              </div> */}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </motion.div>

                {/* Load More Trigger */}
                {filteredBlogs.length > displayedBlogs.length && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center pt-8"
                  >
                    <Button
                      onClick={loadMore}
                      variant="outline"
                      className="border-[#103D38]/20 hover:border-[#103D38] hover:bg-[#103D38]/5 text-slate-700 rounded-full px-10 h-12 font-bold transition-all hover:scale-105"
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
