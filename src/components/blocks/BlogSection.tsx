'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';

interface Blog {
  title: string;
  description: string;
  image: string;
  topic?: string;
  industries?: string[];
  ctaText?: string;
  ctaUrl?: string;
  ctaFormType?: string;
}

interface BlogContent {
  heading?: string;
  subheading?: string;
  blogs?: Blog[];
  buttonText?: string;
  buttonBgColor?: string;
  buttonHoverBgColor?: string;
  buttonTextColor?: string;
  buttonHoverTextColor?: string;
  buttonUrl?: string;
  buttonFormType?: string;
  pdfUrl?: string;
  viewAllCta?: { label?: string; url?: string; formType?: string; pdfUrl?: string };
}

interface BlogSectionProps {
  content?: BlogContent;
}

const defaultBlogs: Blog[] = [
  {
    title: 'Why Are More Finance Departments Adopting RPA for Core Processes?',
    description: 'How RPA Is Reshaping the Way Finance Departments Operate In most finance departments....',
    image: '/blog-1.png',
    topic: 'App Development',
    industries: ['Finance'],
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Which Enterprise IT Solutions Are High-Performing Companies Quietly Investing In?',
    description: 'The Patterns Shaping Enterprise IT Solutions Today Not every business investment is visible. Some of the most.....',
    image: '/blog-2.png',
    topic: 'Technology',
    industries: ['Enterprise'],
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Is Your Business Ready for Oracle Migration? A Checklist for Decision-Makers',
    description: 'Ready for Oracle Migration? Check This First In our previous blogs, we discussed why businesses should....',
    image: '/blog-3.png',
    topic: 'Digital Transformation',
    industries: ['Manufacturing'],
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Cloud ERP vs. On-Premise: Making the Right Strategic Move in 2026',
    description: 'Evaluate cost, scalability, and security when selecting the best ERP deployment model for your organization...',
    image: '/blog-1.png',
    topic: 'Cloud Solutions',
    industries: ['IT & Services'],
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Maximizing Supply Chain Resilience Through Real-Time AI Analytics',
    description: 'Discover how predictive forecasting and intelligent dashboards eliminate supply chain bottlenecks before they occur...',
    image: '/blog-2.png',
    topic: 'Supply Chain',
    industries: ['Logistics'],
    ctaText: 'Read More',
    ctaUrl: '#',
  },
];

function BlogCard({ blog, isCarousel }: { blog: Blog; isCarousel?: boolean }) {
  return (
    <motion.div
      variants={{
        initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
        animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
      }}
      whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
      className={`flex flex-col group cursor-pointer border border-slate-200 bg-white p-4 ${
        isCarousel ? 'snap-start shrink-0 w-full sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)]' : ''
      }`}
      onClick={() => blog.ctaUrl && blog.ctaUrl !== '#' && (window.location.href = blog.ctaUrl)}
    >
      {/* Image */}
      <div className="overflow-hidden bg-slate-200 aspect-[16/10] mb-4 shadow-sm relative">
        <motion.img 
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          src={blog.image} 
          alt={blog.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
          }}
        />
      </div>

      {/* Title */}
      <h3 className="text-[20px] font-bold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-[#462294] transition-colors">
        {blog.title}
      </h3>
      
      {/* Description */}
      <p className="text-[14px] text-slate-500 leading-relaxed mb-6 line-clamp-3 font-normal">
        {blog.description}
      </p>

      {/* Read More Button */}
      <div className="mt-auto">
        <span
          onClick={(e) => {
            e.stopPropagation();
            if (blog.ctaUrl && blog.ctaUrl !== '#') {
              window.location.href = blog.ctaUrl;
            }
          }}
          className="inline-flex items-center text-[#462294] text-[15px] font-bold px-5 py-2.5 cursor-pointer hover:bg-[#3a1d7a] hover:text-white transition-colors"
        >
          {blog.ctaText || 'Read More'}
          <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
        </span>
      </div>
    </motion.div>
  );
}

export function BlogSection({ content }: BlogSectionProps) {
  const [isBtnHovered, setIsBtnHovered] = useState(false);
  const heading = content?.heading || "News, Launches & Product Thinking";
  const subheading = content?.subheading || "Stay updated on what we're building, learning, and launching.";

  const btnText = content?.buttonText || content?.viewAllCta?.label || "Explore More";
  const btnUrl = content?.buttonUrl || content?.viewAllCta?.url || "/blogs";
  const btnFormType = (content?.buttonFormType || content?.viewAllCta?.formType || '') as CtaFormType;
  const pdfUrl = content?.pdfUrl || content?.viewAllCta?.pdfUrl;

  const buttonBgColor = content?.buttonBgColor || '#4B2A63';
  const buttonHoverBgColor = content?.buttonHoverBgColor || '#3B198F';
  const buttonTextColor = content?.buttonTextColor || '#ffffff';
  const buttonHoverTextColor = content?.buttonHoverTextColor;

  const { handleClick, modalNode } = useCtaAction(btnUrl, btnFormType, pdfUrl);

  const initialBlogs = (() => {
    const custom = content?.blogs || [];
    if (custom.length >= 5) return custom.slice(0, 5);
    const existingTitles = new Set(custom.map((b) => b.title.toLowerCase().trim()));
    const extras = defaultBlogs.filter((b) => !existingTitles.has(b.title.toLowerCase().trim()));
    return [...custom, ...extras].slice(0, 5);
  })();
  const [blogs, setBlogs] = useState<Blog[]>(initialBlogs);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScrollState = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  }, []);

  useEffect(() => {
    if (blogs.length <= 3) return;
    checkScrollState();
    const timer1 = setTimeout(checkScrollState, 150);
    const timer2 = setTimeout(checkScrollState, 500);
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScrollState, { passive: true });
    }
    window.addEventListener('resize', checkScrollState);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      if (el) {
        el.removeEventListener('scroll', checkScrollState);
      }
      window.removeEventListener('resize', checkScrollState);
    };
  }, [blogs, checkScrollState]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const card = container.firstElementChild as HTMLElement | null;
      const next = card?.nextElementSibling as HTMLElement | null;
      const scrollStep = card && next
        ? next.offsetLeft - card.offsetLeft
        : card
          ? card.offsetWidth + 32
          : 380;
      const scrollAmount = direction === 'left' ? -scrollStep : scrollStep;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) return;
        const data = await res.json();
        const blogList = Array.isArray(data) ? data : data?.blogs || [];
        if (Array.isArray(blogList) && blogList.length > 0) {
          const formatted = blogList.slice(0, 5).map((b: any) => ({
            title: b.title,
            description: b.description || 'Read more about this topic in our blog.',
            image: b.image || '/blog-1.png',
            topic: b.topic || 'Technology',
            industries: Array.isArray(b.industries) ? b.industries : (b.industry ? [b.industry] : []),
            ctaText: 'Read More',
            ctaUrl: b.fullPath || `/blog/${b.slug}`
          }));
          if (formatted.length < 5) {
            const existingTitles = new Set(formatted.map((b: any) => b.title.toLowerCase().trim()));
            const extras = defaultBlogs.filter((b) => !existingTitles.has(b.title.toLowerCase().trim()));
            setBlogs([...formatted, ...extras].slice(0, 5));
          } else {
            setBlogs(formatted.slice(0, 5));
          }
        }
      } catch (err) {
        // Silently preserve initial blogs on fetch failure
      }
    }
    fetchBlogs();
  }, []);

  const isCarousel = blogs.length > 3;

  return (
    <section className="py-14 bg-[#F8F9FA]">
      <div className="container mx-auto px-4 md:px-8 max-w-7xl">
        
        {/* Header */}
        <div className="text-center mb-16 max-w-2xl mx-auto flex flex-col items-center">
          <TextReveal 
            as="h2"
            text={heading}
            className="text-4xl md:text-[48px] font-bold text-slate-900 mb-6 tracking-tight leading-tight justify-center"
          />
          <MotionSection variant="fadeUp" delay={0.4}>
            <p className="text-lg text-slate-500 font-light">
              {subheading}
            </p>
          </MotionSection>
        </div>

        {/* If more than 3 blogs, show Carousel with dynamic Left/Right arrows. Otherwise, show clean 3-col Grid. */}
        {isCarousel ? (
          <div className="relative group/carousel">
            {/* Left Arrow Button */}
            <button
              type="button"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              aria-label="Previous blogs"
              className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1 md:-translate-x-3 lg:-translate-x-14 xl:-translate-x-16 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-slate-200 text-[#462294] shadow-md hover:shadow-lg flex items-center justify-center hover:bg-[#462294] hover:text-white hover:border-[#462294] transition-all duration-200 active:scale-95 ${
                canScrollLeft
                  ? 'opacity-100 scale-100 cursor-pointer pointer-events-auto'
                  : 'opacity-0 pointer-events-none scale-90'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Cards Scroll Track */}
            <div
              ref={scrollRef}
              className="flex items-stretch gap-8 overflow-x-auto scroll-smooth py-4 -my-4 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
              role="region"
              aria-label="Blogs carousel"
            >
              {blogs.map((blog, index) => (
                <BlogCard key={index} blog={blog} isCarousel={true} />
              ))}
            </div>

            {/* Right Arrow Button */}
            <button
              type="button"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              aria-label="Next blogs"
              className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 md:translate-x-3 lg:translate-x-14 xl:translate-x-16 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white border border-slate-200 text-[#462294] shadow-md hover:shadow-lg flex items-center justify-center hover:bg-[#462294] hover:text-white hover:border-[#462294] transition-all duration-200 active:scale-95 ${
                canScrollRight
                  ? 'opacity-100 scale-100 cursor-pointer pointer-events-auto'
                  : 'opacity-0 pointer-events-none scale-90'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogs.map((blog, index) => (
              <BlogCard key={index} blog={blog} isCarousel={false} />
            ))}
          </StaggerContainer>
        )}

        {/* View All Button */}
        {btnText && (
          <MotionSection variant="fadeUp" delay={0.6} className="mt-16 text-center">
            <Button 
              onClick={handleClick}
              onMouseEnter={() => setIsBtnHovered(true)}
              onMouseLeave={() => setIsBtnHovered(false)}
              style={{
                backgroundColor: isBtnHovered && buttonHoverBgColor ? buttonHoverBgColor : buttonBgColor,
                color: isBtnHovered && buttonHoverTextColor ? buttonHoverTextColor : buttonTextColor,
              }}
              className="rounded-full px-12 h-[54px] text-[16px] font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer border-none"
            >
              {btnText}
            </Button>
          </MotionSection>
        )}

      </div>
      {modalNode}
    </section>
  );
}

export default BlogSection;
