'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';
import { useCtaAction, type CtaFormType } from '@/hooks/useCtaAction';
import { useInternalNavigate } from '@/hooks/useInternalNavigate';

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

const defaultBlogs = [
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
];

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

  const [blogs, setBlogs] = useState<Blog[]>(content?.blogs || defaultBlogs);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (!res.ok) return;
        const data = await res.json();
        const blogList = Array.isArray(data) ? data : data?.blogs || [];
        if (Array.isArray(blogList) && blogList.length > 0) {
          const formatted = blogList.slice(0, 3).map((b: any) => ({
            title: b.title,
            description: b.description || 'Read more about this topic in our blog.',
            image: b.image || '/blog-1.png',
            topic: b.topic || 'Technology',
            industries: Array.isArray(b.industries) ? b.industries : (b.industry ? [b.industry] : []),
            ctaText: 'Read More',
            ctaUrl: b.fullPath || `/blog/${b.slug}`
          }));
          setBlogs(formatted);
        }
      } catch (err) {
        // Silently preserve default static blogs on fetch failure
      }
    }
    fetchBlogs();
  }, []);

  return (
    <section className="py-14 bg-[#F8F9FA] overflow-hidden">
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

        {/* Grid */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {blogs.map((blog, index) => (
            <motion.div
              key={index}
              variants={{
                initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
                animate: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
              }}
              whileHover={{ y: -8, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } }}
              className="flex flex-col group cursor-pointer"
              onClick={() => blog.ctaUrl && blog.ctaUrl !== '#' && (window.location.href = blog.ctaUrl)}
            >
              {/* Image */}
              <div className="rounded-[32px] overflow-hidden bg-slate-200 aspect-[16/10] mb-6 shadow-sm relative">
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

                {/* Topic & Industries Floating Tags */}
                <div className="absolute bottom-4 left-4 flex flex-wrap gap-2 items-center">
                  {blog.topic && (
                    <div className="bg-white/95 backdrop-blur px-2.5 py-1 rounded-xl shadow-sm text-left flex flex-col justify-center">
                      <span className="text-[8px] text-[#859bfc] font-bold uppercase tracking-wider block leading-none mb-0.5">Topic</span>
                      <span className="text-[11px] text-slate-800 font-semibold leading-none">{blog.topic}</span>
                    </div>
                  )}
                  {blog.industries && blog.industries.filter((ind: string) => ind && ind !== 'Industries').map((ind: string) => (
                    <div key={ind} className="bg-[#103D38]/95 backdrop-blur px-2.5 py-1 rounded-xl shadow-sm text-left flex flex-col justify-center">
                      <span className="text-[8px] text-emerald-300 font-bold uppercase tracking-wider block leading-none mb-0.5">Industry</span>
                      <span className="text-[11px] text-white font-semibold leading-none">{ind}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Title - Black color */}
              <h3 className="text-[20px] font-bold text-slate-900 mb-3 leading-tight tracking-tight group-hover:text-[#4A3AFF] transition-colors pr-2">
                {blog.title}
              </h3>
              
              {/* Description */}
              <p className="text-[14px] text-slate-500 leading-relaxed mb-6 line-clamp-3 font-normal">
                {blog.description}
              </p>

              {/* Link */}
              <div className="text-[#FF3B3B] text-[15px] font-bold group-hover:text-[#CC2E2E] transition-all flex items-center mt-auto cursor-pointer">
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    if (blog.ctaUrl && blog.ctaUrl !== '#') {
                      window.location.href = blog.ctaUrl;
                    }
                  }}
                  className="flex items-center"
                >
                  {blog.ctaText || 'Read More'}
                  <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                </span>
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

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
