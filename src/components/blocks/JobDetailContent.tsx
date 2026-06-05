'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, UploadCloud } from 'lucide-react';

export default function JobDetailContent({ content }: { content?: any }) {
  const {
    aboutTitle = 'About the Role',
    aboutText = 'We are seeking a highly skilled Senior Software Engineer with expertise in .NET Core to design, develop, and maintain robust backend services. The ideal candidate will have strong experience in building scalable APIs, working with Entity Framework Core, and writing efficient LINQ queries. Additional responsibilities include implementing caching strategies, performance tuning, and ensuring security best practices.',
    sections = [
      {
        title: 'Key Responsibilities',
        items: [
          'Write clean, scalable, and maintainable code using C#, .NET Core, ASP.NET Core MVC, and Web API',
          'Implement data access layers using Entity Framework Core (EF Core) and write optimized LINQ queries',
          'Design and develop RESTful APIs for backend services',
          'Ensure application performance, scalability, and security',
          'Implement caching strategies and optimize application performance',
          'Collaborate with cross-functional teams including QA and DevOps',
          'Participate in code reviews and enforce best practices',
          'Troubleshoot and resolve technical issues in production environments'
        ]
      },
      {
        title: 'Requirements',
        items: [
          'Strong experience with C#, .NET Core, ASP.NET Core MVC, and Web API',
          'Proficiency in Entity Framework Core and LINQ for data manipulation',
          'Solid understanding of relational databases such as MS SQL Server or MySQL',
          'Ability to write efficient queries and optimize database performance',
          'Knowledge of asynchronous programming and dependency injection',
          'Familiarity with unit testing frameworks (xUnit, NUnit, or MSTest)',
          'Understanding of Git and version control workflows',
          'Experience with caching mechanisms (e.g., MemoryCache, Redis)',
          'Knowledge of security best practices in API development'
        ]
      },
      {
        title: 'Nice to Have',
        items: [
          'Experience with Microservices architecture',
          'Knowledge of Docker and containerization',
          'Familiarity with Azure or other cloud platforms',
          'Exposure to CI/CD pipelines'
        ]
      },
      {
        title: 'What We Offer',
        items: [
          'Competitive salary & bonus structure',
          'Corporate medical cover for employees and immediate dependents',
          '14 days of paid holidays plus yearly defined calendar holidays',
          'Wiki-Wednesdays (Knowledge sessions across Deep Tech, Trends & more)',
          'Wellness sessions & Friday-Fundays',
          'Quarterly team building days - work hard, play hard!'
        ]
      }
    ],
    formHeader = 'Apply Now',
    formSubheader = 'Join our team',
    submitText = 'Submit Application'
  } = content || {};

  return (
    <section className="py-16 bg-white relative">
      <div className="container mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Left Column: Job Description */}
          <div className="lg:col-span-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="prose prose-slate max-w-none"
            >
              {/* About Section */}
              <div className="mb-12">
                <h2 className="text-[22px] font-bold text-slate-900 mb-4">{aboutTitle}</h2>
                <p className="text-[15px] leading-relaxed text-slate-600 font-light">
                  {aboutText}
                </p>
              </div>

              {/* Dynamic List Sections */}
              {sections.map((section: any, sIdx: number) => (
                <div key={sIdx} className="mb-12">
                  <h2 className="text-[22px] font-bold text-slate-900 mb-6">{section.title}</h2>
                  <ul className="space-y-4">
                    {section.items.map((item: string, iIdx: number) => (
                      <li key={iIdx} className="flex items-start">
                        <CheckCircle2 className="w-[18px] h-[18px] text-[#4B2A63] mr-3 mt-1 flex-shrink-0" strokeWidth={2} />
                        <span className="text-[15px] text-slate-600 font-light leading-relaxed">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right Column: Sticky Application Form */}
          <div className="lg:col-span-4">
            <div className="sticky top-28">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white border border-slate-100 rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8"
              >
                {/* Form Header */}
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 rounded-xl bg-[#23173D] flex items-center justify-center text-white">
                    <Users className="w-6 h-6 " />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 leading-tight">{formHeader}</h3>
                    <p className="text-[13px] text-slate-500">{formSubheader}</p>
                  </div>
                </div>

                {/* Form Inputs */}
                <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>

                  {/* Two Column Grid Inputs */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                      <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Email Address *</label>
                      <input type="email" placeholder="john@example.com" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Phone Number *</label>
                      <input type="text" placeholder="+91 9876543210" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Total Experience *</label>
                      <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Current Company</label>
                      <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Notice Period *</label>
                      <input type="text" className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">LinkedIn Profile</label>
                      <input type="url" placeholder="https://linkedin.com/..." className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-slate-700">Portfolio/GitHub</label>
                      <input type="url" placeholder="https://github.com/..." className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300" />
                    </div>
                  </div>

                  {/* File Upload */}
                  <div className="space-y-2 pt-2">
                    <label className="text-[11px] font-bold text-slate-700 flex items-center">
                      Resume/CV * <span className="font-normal text-slate-500 ml-1">(PDF or Word, max 5MB)</span>
                    </label>
                    <div className="flex items-center">
                      <button type="button" className="inline-flex items-center px-4 h-9 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors">
                        <UploadCloud className="w-4 h-4 mr-2" />
                        Choose file
                      </button>
                    </div>
                  </div>

                  {/* Textarea */}
                  <div className="space-y-1.5 pt-2">
                    <label className="text-[11px] font-bold text-slate-700">Cover Letter (Optional)</label>
                    <textarea
                      placeholder="Tell us why you're interested in this role..."
                      className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300 resize-none"
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-4">
                    <button type="submit" className="w-full h-[42px] bg-[#2B1C50] hover:bg-[#1a1130] text-white text-[13px] font-medium rounded-lg transition-colors">
                      {submitText}
                    </button>
                  </div>

                </form>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
