'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type CaseStudyPost, defaultCaseStudies } from '@/lib/case-studies-data';

interface CaseStudyDetailSectionProps {
  content?: any;
}

export function CaseStudyDetailSection({ content }: CaseStudyDetailSectionProps) {
  // We receive content which should match the structure of CaseStudyPost
  const cs = content as CaseStudyPost;

  if (!cs) {
    return <div>Case study not found</div>;
  }

  return (
    <article className="bg-[#fcfdfd] min-h-screen">
      {/* 1. Hero Section */}
      <section className="relative px-6 pt-30 pb-14 overflow-hidden" style={{ background: 'linear-gradient(135deg, #1e2445 0%, #292048 100%)' }}>
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="px-5 py-1.5 bg-white text-[#2B1B41] rounded-full text-sm font-semibold shadow-sm">
                {cs.topic || cs.industry || 'Category Name'}
              </div>
              {cs.date && (
                <div className="text-white text-lg font-medium">
                  {cs.date}
                </div>
              )}
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-white leading-tight mb-6">
              {cs.title}
            </h1>

            {cs.description && (
              <div className="text-slate-200 text-base leading-relaxed line-clamp-4 max-w-xl">
                {cs.description}
              </div>
            )}
          </motion.div>

          {/* Right: Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative h-full flex flex-col justify-center items-end lg:items-center"
          >
            <img
              src={cs.image || '/Case-studies details/image 104.png'}
              alt={cs.title}
              className="object-contain max-w-full lg:max-w-[500px]"
            />
          </motion.div>
        </div>
      </section>

      {/* 2. Overview Section */}
      <section className="py-14 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[40px] font-bold text-[#111827] mb-4">Overview</h2>
          <div className="prose prose-lg prose-slate max-w-none mb-14 text-slate-500 leading-relaxed">
            {cs.overviewHtml ? (
              <div dangerouslySetInnerHTML={{ __html: cs.overviewHtml }} />
            ) : (
              <>
                <p className="mb-4">
                  The client is a well-established wholesaler and retailer of FMCG products with over 20 years of experience in the industry. What began as a small neighborhood shop has steadily evolved into a large and trusted trading business known for its strong customer relationships, reliable service, and consistent market presence. Through dedication, operational efficiency, and a deep understanding of customer needs, the company has built a solid reputation in the FMCG sector.
                </p>
                <p className="mb-4">
                  Over the years, the business has expanded significantly and now operates through three major branches located across Accra. This expansion reflects the company's continuous growth and increasing demand for its products within the market. By maintaining strong supplier networks and efficient distribution practices, the company has been able to serve a wide customer base ranging from retailers and supermarkets to local businesses and individual consumers.
                </p>
                <p>
                  The company supplies a wide range of essential FMCG products including rice, sugar, edible oil, detergents, and other daily-use consumer goods. Their focus on product availability, competitive pricing, and dependable delivery has helped them become a preferred partner for many customers. With decades of industry experience and a growing operational network, the company continues to strengthen its position as a leading FMCG trading business in the region.
                </p>
              </>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {(cs.overviewImages && cs.overviewImages.length > 0) ? (
              cs.overviewImages.map((img, idx) => (
                <div key={idx} className="aspect-square bg-slate-100 overflow-hidden">
                  <img src={img} alt={`Overview ${idx}`} className="w-full h-full object-cover" />
                </div>
              ))
            ) : (
              <>
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img src="/Case-studies details/image 105.png" alt="Overview 1" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img src="/Case-studies details/image 106.png" alt="Overview 2" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-slate-100 overflow-hidden">
                  <img src="/Case-studies details/image 107.png" alt="Overview 3" className="w-full h-full object-cover" />
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 3. Challenge Section */}
      <section className="py-14 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Challenge */}
          <div>
            <h2 className="text-[40px] font-bold text-[#111827] mb-6">The Challenge</h2>
            <div className="prose prose-lg prose-slate max-w-none text-slate-500 leading-relaxed">
              {cs.challengeHtml ? (
                <div dangerouslySetInnerHTML={{ __html: cs.challengeHtml }} />
              ) : (
                <p>
                  They had been using locally developed software for several years. The company has grown multifold over the last few years. However, in the absence of an integrated system, they were facing a lot of difficulties in managing their operations. They felt the need to integrate their business functions with a comprehensive ERP Software solution in Ghana. One of the major challenges that the firm was facing was that there was no integration between disparate departments; they were unable to access data from multiple locations or when on the move. There was no proper control on inventory and neither were they able to generate MIS. After evaluating various options, they decided to go ahead with ebizframe because they felt that ERP System Ghana was the right solution for all their business needs.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Challenge Image */}
          <div className="relative">
            <img
              src={cs.challengeImage || "/Case-studies details/image 108.png"}
              alt="Challenge"
              className="w-full h-auto object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* 3.5 ESS Solution Choice Section */}
      <section className="py-14 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[32px] font-bold text-[#111827] mb-2">ESS Solution Choice</h2>
          <p className="text-slate-500 text-lg mb-8">ebizframe ERP is to be implemented for the following functions</p>

          <div className="flex flex-wrap gap-6">
            {(cs.solutionModules && cs.solutionModules.length > 0) ? (
              cs.solutionModules.map((mod, idx) => (
                <div key={idx} className="flex-1 min-w-[200px] max-w-[280px] border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow bg-white">
                  <img src={mod.icon} alt={mod.name} className="w-10 h-10 object-contain" />
                  <span className="text-slate-700 font-medium">{mod.name}</span>
                </div>
              ))
            ) : (
              <>
                <div className="flex-1 min-w-[200px] max-w-[280px] border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow bg-white">
                  <img src="/Case-studies details/Container/finance-strategy_svgrepo.com.png" alt="Finance" className="w-10 h-10 object-contain" />
                  <span className="text-slate-700 font-medium">Finance</span>
                </div>
                <div className="flex-1 min-w-[200px] max-w-[280px] border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow bg-white">
                  <img src="/Case-studies details/sales--connect_1_.png" alt="Sales" className="w-10 h-10 object-contain" />
                  <span className="text-slate-700 font-medium">Sales</span>
                </div>
                <div className="flex-1 min-w-[200px] max-w-[280px] border border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-4 hover:shadow-lg transition-shadow bg-white">
                  <img src="/Case-studies details/Frame 216.png" alt="Materials Management" className="w-10 h-10 object-contain" />
                  <span className="text-slate-700 font-medium">Materials Management</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* 4. Results Section */}
      <section className="py-14 px-6 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-[40px] font-bold text-[#111827] mb-2">The Results</h2>
          <div className="prose prose-lg prose-slate max-w-none mb-10 text-slate-500 leading-relaxed">
            {cs.resultsHtml ? (
              <div dangerouslySetInnerHTML={{ __html: cs.resultsHtml }} />
            ) : (
              <p>
                The client is expecting the following benefits from ebizframe :
              </p>
            )}
          </div>

          {(cs.resultsItems && cs.resultsItems.length > 0) ? (
            <div className="max-w-4xl">
              <ul className="space-y-4">
                {cs.resultsItems.map((item, idx) => (
                  <motion.li
                    key={idx}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#fffcf0] border border-yellow-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#f5a623]" />
                    </div>
                    <span className="text-slate-600 font-medium">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="max-w-4xl">
              <ul className="space-y-6">
                {[
                  "Integrated Solution",
                  "Financial Reporting",
                  "Tighter control and process orientation with workflow",
                  "Better visibility for top management with online user based Dashboards",
                  "Better coordination between different departments and branches"
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-[#fffcf0] border border-yellow-100 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-[#f5a623]" />
                    </div>
                    <span className="text-slate-600 font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-14 max-w-7xl text-slate-600 leading-relaxed">
            <p>
              For more information on how ebizframe can help you transform your business, please leave your contact details in the contact form or mail us at <br className="hidden sm:block" />
              <span className="font-bold text-[#111827]">marketing@essindia.com.</span>
            </p>
          </div>
        </div>
      </section>

      {/* 5. More Stories Section */}
      <section className="py-14 px-6 bg-[#fcfdfd] border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl lg:text-4xl font-black text-[#1a1a1a]">More Stories</h2>
            <Button variant="outline" className="rounded-full border-slate-200 text-slate-700 hover:bg-[#4a2c5a]/5 hover:text-[#4a2c5a]" onClick={() => window.location.href = '/case-studies'}>
              View All Stories <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {defaultCaseStudies.filter(c => c.slug !== cs.slug).slice(0, 3).map((moreCs, idx) => {
              const detailLink = `/case-studies/${moreCs.slug}`;
              return (
                <motion.div
                  key={moreCs.slug}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex flex-col group cursor-pointer bg-white border border-[#4a2c5a]/20 rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all p-3"
                  onClick={() => window.location.href = detailLink}
                >
                  {/* Image */}
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
                    <img
                      src={moreCs.image}
                      alt={moreCs.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </div>

                  {/* Content Body */}
                  <div className="pt-5 pb-2 px-1 flex-1 flex flex-col justify-between">
                    <div className="space-y-3">
                      <div>
                        <span className="inline-block px-3 py-1 rounded-full border border-[#4a2c5a]/30 text-[10px] font-bold text-[#4a2c5a] tracking-wide">
                          {moreCs.topic || 'Category Name'}
                        </span>
                      </div>
                      <h3 className="text-[17px] font-bold text-[#1a1a1a] leading-snug group-hover:text-[#4a2c5a] transition-colors line-clamp-3">
                        {moreCs.title}
                      </h3>
                    </div>

                    {/* Footer */}
                    <div className="pt-6 flex items-center justify-between mt-auto">
                      <p className="text-[13px] text-slate-500 font-medium">{moreCs.date}</p>
                      <ArrowRight className="w-5 h-5 text-[#242A4A] transition-transform group-hover:translate-x-1" strokeWidth={1.5} />
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

    </article>
  );
}
