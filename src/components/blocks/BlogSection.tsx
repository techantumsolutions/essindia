'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { TextReveal } from '@/components/animations/TextReveal';
import { MotionSection, StaggerContainer } from '@/components/animations/MotionSection';

interface Blog {
  title: string;
  description: string;
  image: string;
  ctaText?: string;
  ctaUrl?: string;
}

interface BlogContent {
  heading?: string;
  subheading?: string;
  blogs?: Blog[];
  viewAllCta?: { label: string; url: string };
}

interface BlogSectionProps {
  content?: BlogContent;
}

const defaultBlogs = [
  {
    title: 'Why Are More Finance Departments Adopting RPA for Core Processes?',
    description: 'How RPA Is Reshaping the Way Finance Departments Operate In most finance departments....',
    image: '/blog-1.png',
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Which Enterprise IT Solutions Are High-Performing Companies Quietly Investing In?',
    description: 'The Patterns Shaping Enterprise IT Solutions Today Not every business investment is visible. Some of the most.....',
    image: '/blog-2.png',
    ctaText: 'Read More',
    ctaUrl: '#',
  },
  {
    title: 'Is Your Business Ready for Oracle Migration? A Checklist for Decision-Makers',
    description: 'Ready for Oracle Migration? Check This First In our previous blogs, we discussed why businesses should....',
    image: '/blog-3.png',
    ctaText: 'Read More',
    ctaUrl: '#',
  },
];

export function BlogSection({ content }: BlogSectionProps) {
  const heading = content?.heading || "News, Launches & Product Thinking";
  const subheading = content?.subheading || "Stay updated on what we're building, learning, and launching.";
  const viewAllCta = content?.viewAllCta || { label: "Explore More", url: "/blog" };

  const [blogs, setBlogs] = useState<Blog[]>(content?.blogs || defaultBlogs);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs');
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const formatted = data.slice(0, 3).map((b: any) => ({
            title: b.title,
            description: b.description || 'Read more about this topic in our blog.',
            image: b.image || '/blog-1.png',
            ctaText: 'Read More',
            ctaUrl: b.fullPath || `/blog/${b.slug}`
          }));
          setBlogs(formatted);
        }
      } catch (err) {
        console.error('[BlogSection]', err);
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
            >
              {/* Image */}
              <div className="rounded-[32px] overflow-hidden bg-slate-200 aspect-[16/10] mb-8 shadow-sm">
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
              <h3 className="text-[20px] font-bold text-[#6240B2] mb-4 leading-tight tracking-tight group-hover:text-black transition-colors pr-2">
                {blog.title}
              </h3>
              
              {/* Description */}
              <p className="text-[14px] text-slate-500 leading-relaxed mb-6 line-clamp-3 font-normal">
                {blog.description}
              </p>

              {/* Link */}
              <div className="text-[#FF3B3B] text-[15px] font-bold group-hover:text-[#CC2E2E] transition-all flex items-center mt-auto cursor-pointer">
                {blog.ctaUrl ? (
                  <a href={blog.ctaUrl} className="flex items-center">
                    {blog.ctaText || 'Read More'}
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </a>
                ) : (
                  <>
                    {blog.ctaText || 'Read More'}
                    <svg className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </StaggerContainer>

        {/* View All Button */}
        <MotionSection variant="fadeUp" delay={0.6} className="mt-16 text-center">
          <Button 
            onClick={() => window.location.href = viewAllCta.url}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-12 h-[54px] text-[16px] font-bold shadow-xl transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 active:scale-95 cursor-pointer"
          >
            {viewAllCta.label}
          </Button>
        </MotionSection>

      </div>
    </section>
  );
}
