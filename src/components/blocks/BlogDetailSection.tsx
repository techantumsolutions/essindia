'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, ArrowRight, Loader2 } from 'lucide-react';
import { useInternalNavigate } from '@/hooks/useInternalNavigate';
import { HeroTitle } from '@/components/ui/HeroTitle';
import { FormattedText } from '@/components/ui/FormattedText';

export interface KeyTakeawaysSegment {
  type: 'key-takeaways';
  id?: string;
  tocTitle?: string;
  title?: string;
  points?: string[];
  descriptions?: string[];
}

export interface ItemEntry {
  title?: string;
  descriptions?: string[];
  image?: string;
}

export interface ItemsSegment {
  type: 'items';
  id?: string;
  tocTitle?: string;
  items?: ItemEntry[];
}

export interface CardEntry {
  title?: string;
  description?: string; // 50 char max
}

export interface CardsSegment {
  type: 'cards';
  id?: string;
  tocTitle?: string;
  cards?: CardEntry[];
}

export interface TableRowEntry {
  col1Title?: string;
  col1Desc?: string;
  col2Text?: string;
}

export interface TableSegment {
  type: 'table';
  id?: string;
  tocTitle?: string;
  column1Title?: string;
  column2Title?: string;
  rows?: TableRowEntry[];
}

export type ContentSegment = KeyTakeawaysSegment | ItemsSegment | CardsSegment | TableSegment;

export interface BlogDetailContent {
  // Hero & Basic Details
  heroBgImage?: string;
  category?: string; // topic
  industry?: string;
  bgColor?: string;
  gradientFrom?: string;
  gradientVia?: string;
  gradientTo?: string;
  titleGradientFrom?: string;
  titleGradientTo?: string;
  heroTitle?: string;
  title?: string;
  date?: string;
  readTime?: string;

  // Author Card
  authorCardAvatar?: string;
  authorCardName?: string;
  authorCardRole?: string; // Designation
  authorCardBio?: string;  // Description

  // Compatibility fields
  authorName?: string;
  authorAvatar?: string;
  image?: string;
  description?: string;
  contentHtml?: string;

  // Dynamic Content Segments (Unsequenced)
  contentSegments?: ContentSegment[];

  // Conclusion
  conclusionParagraphs?: string[];

  // Estimation Form
  calcTitle?: string;
  calcDisclaimer?: string;
  calcPoints?: string[];
}

interface BlogAuthor {
  name: string;
  avatar: string;
}

interface BlogPost {
  title: string;
  description: string;
  image: string;
  slug: string;
  date: string;
  topic: string;
  industries: string[];
  author: BlogAuthor;
}

interface BlogDetailSectionProps {
  content?: BlogDetailContent;
}

const defaultRelatedBlogs: BlogPost[] = [
  {
    title: 'How Power BI Services Fix Multi-System Data Mismatches',
    description: 'In most enterprise environments, data flows from CRM platforms, local databases, and legacy solutions.',
    image: '/blog-1.png',
    slug: 'how-power-bi-services-fix-multi-system-data-mismatches',
    date: 'May 15, 2026',
    topic: 'Technology',
    industries: ['Industries'],
    author: {
      name: 'Tracey Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Tracey',
    },
  },
  {
    title: 'How RPA Services Eliminate Bottlenecks in High-Volume Operations',
    description: 'Eliminating operational bottlenecks is key for growth. How RPA services enable organizations to scale operations.',
    image: '/service-rpa.png',
    slug: 'how-rpa-services-eliminate-bottlenecks-in-high-volume-operations',
    date: 'Mat 05, 2026',
    topic: 'App Development',
    industries: ['Manufacturing'],
    author: {
      name: 'Jason Francisco',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jason',
    },
  },
  {
    title: 'Reduce Reporting Time by 70% with AI in BI',
    description: 'Reporting doesn\'t have to be a slow, manual process. Learn how integrating artificial intelligence into Business Intelligence dashboards.',
    image: '/service-bi.png',
    slug: 'reduce-reporting-time-by-70-percent-with-ai-in-bi',
    date: 'March 01, 2026',
    topic: 'Technology',
    industries: ['FMCG'],
    author: {
      name: 'Elizabeth Slavin',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elizabeth',
    },
  },
];

export function BlogDetailSection({ content }: BlogDetailSectionProps) {
  const navigate = useInternalNavigate();

  // Color & Hero Gradient logic
  const bgColor = content?.bgColor;
  const gradientFrom = content?.gradientFrom || '#4A3AFF';
  const gradientVia = content?.gradientVia || '#4842E9';
  const gradientTo = content?.gradientTo || '#6095FF';

  const heroBgImage = content?.heroBgImage;
  const heroTitle = content?.heroTitle || content?.title || 'How Power BI Services Help Fix Multi-System Data Mismatches';
  const date = content?.date || 'May 15,2026';
  const readTime = content?.readTime || '3min read';

  // Author Card details (Author Name calls into Hero section before Published Date)
  const authorCardName = content?.authorCardName || 'Saurabh Singh';
  const authorCardRole = content?.authorCardRole || 'Managing Director';
  const authorCardAvatar = content?.authorCardAvatar || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80';
  const authorCardBio = content?.authorCardBio || 'With over 15 years of experience driving large-scale digital initiatives, Saurabh Singh is the CEO and Managing Director specializing in mobile product strategy, app store optimization, monetization, and digital growth across enterprise, retail, and media.';

  // Segments & Conclusion
  const segments: ContentSegment[] = content?.contentSegments || [
    {
      type: 'key-takeaways',
      id: 'key-takeaways-1',
      tocTitle: 'Key takeaways',
      title: 'Key takeaways:',
      points: [
        'Most enterprise app delays start after approvals, integrations, and infrastructure reviews pile up across different teams.',
        'Real-time features, AI systems, and legacy integrations usually add more time than frontend development work.',
        'A mobile app may launch quickly, but scaling it for production traffic takes much longer.',
        'Teams that release faster usually fix delivery gaps early, not just increase developer headcount.',
        'Enterprise apps often spend months in testing, security validation, and production readiness before public launch.'
      ],
      descriptions: [
        'How Power BI Services Help Fix Multi-System Data Mismatches Today, businesses generate data from almost every direction, including websites, CRMs, marketing platforms, sales software, customer support tools, finance systems, and more.',
        'Different platforms may show different numbers, reports may contain duplicate or incomplete information, and teams often end up spending more time verifying data than actually using it.',
        'This is where Power BI Services and modern Business Intelligence solutions make a real difference.'
      ]
    },
    {
      type: 'items',
      id: 'items-1',
      tocTitle: 'Why Multi-System Data Mismatches Happen',
      items: [
        {
          title: 'Why Multi-System Data Mismatches Happen',
          image: '/blog details/Image.png',
          descriptions: [
            'As businesses grow, they naturally start using multiple tools and software to manage different operations. The sales team may use one CRM, the marketing team may rely on separate analytics platforms, while finance, customer support, and operations work on completely different systems. At first, this setup seems manageable. But over time, it often creates disconnected data across the organization.',
            'For example, your sales dashboard may show one set of customer numbers while your finance reports display something different. Marketing platforms may report leads differently from your CRM, and manually updating spreadsheets only increases the chances of human error. Eventually, teams start questioning which report is actually accurate.',
            'In most cases, businesses already have more data than they can handle. The problem is that the data exists in different systems, making it difficult to get a complete and reliable picture of business performance.',
            'This is exactly why businesses are increasingly adopting Power BI Services. Instead of switching between multiple dashboards, spreadsheets, and software tools, Microsoft Power BI brings all your business data together into one centralized platform. This helps teams access consistent reports, track real-time insights, and make decisions with greater confidence.'
          ]
        },
        {
          title: 'Plan Your Itinerary',
          image: '/blog details/Image@2x-1.png',
          descriptions: [
            'One of the biggest advantages of Power BI Services is their ability to connect with multiple business platforms at the same time. Whether your data comes from CRMs, cloud applications, Excel sheets, accounting software, marketing tools, or internal databases, Power BI can bring everything together into a single reporting environment.',
            'Instead of manually collecting reports from different teams and comparing spreadsheets line by line, businesses can automate the reporting process and reduce inconsistencies across systems.'
          ]
        }
      ]
    },
    {
      type: 'cards',
      id: 'cards-1',
      tocTitle: 'Benefits & Advantages',
      cards: [
        { title: 'Centralize Data from Multiple Sources', description: 'Power BI connects data from different platforms into one dashboard.' },
        { title: 'Reduce Manual Reporting Errors', description: 'Automated data syncing minimizes duplicate entries and spreadsheets.' },
        { title: 'Standardize Inconsistent Data', description: 'Customer names or sales figures clean and organize into consistent format.' },
        { title: 'Provide Real-Time Business Insights', description: 'Track live dashboards and quickly identify unusual trends.' }
      ]
    },
    {
      type: 'table',
      id: 'table-1',
      tocTitle: 'App Complexity Timeline',
      column1Title: 'App Complexity',
      column2Title: 'Estimated Timelines by App Complexity',
      rows: [
        { col1Title: 'Simple Apps', col1Desc: 'Basic features with minimal integrations and workflows.', col2Text: '2 to 4 Months' },
        { col1Title: 'Mid-Complexity Apps', col1Desc: 'More features, user roles, and third-party integrations.', col2Text: '4 to 8 Months' },
        { col1Title: 'Enterprise-Grade Applications', col1Desc: 'Advanced workflows, high scalability, security & compliance.', col2Text: '9 to 18+ Months' },
        { col1Title: 'AI-Powered Applications', col1Desc: 'AI/ML capabilities, data processing, and predictive intelligence.', col2Text: '10 to 20+ Months' }
      ]
    }
  ];

  const conclusionParagraphs = content?.conclusionParagraphs || [
    'Managing data across multiple systems creates confusion, reporting errors, and slower decision-making. Power BI Services help businesses bring all their data into one centralized platform, making reporting more accurate, organized, and easier to understand. With real-time insights, Business Intelligence dashboards, and consistent data, businesses can make faster and more confident decisions.',
    'If you want to learn more about how Power BI Services can help your business eliminate data mismatches and improve reporting efficiency, feel free to contact our team at marketing@essindia.com.'
  ];

  // Form Settings
  const calcTitle = content?.calcTitle || 'Calculate your app development timeline!';
  const calcDisclaimer = content?.calcDisclaimer || 'I agree to receive the personalized development estimation report and future tech insights.';
  const calcPoints = content?.calcPoints || [
    '100% Free & No Commitment',
    'Detailed Timeline Breakdown in 24h',
    'Estimated Cost Range Included'
  ];
  const formButtonHoverBgColor = (content as any)?.formButtonHoverBgColor;
  const formButtonHoverTextColor = (content as any)?.formButtonHoverTextColor;
  const [isFormBtnHovered, setIsFormBtnHovered] = React.useState(false);

  // Dynamic Left Sidebar TOC Items
  const tocItems = React.useMemo(() => {
    const items: Array<{ id: string; label: string }> = [];
    segments.forEach((seg, idx) => {
      const segId = seg.id || `segment-${seg.type}-${idx}`;
      let label = seg.tocTitle;
      if (!label) {
        if (seg.type === 'key-takeaways') label = seg.title || 'Key takeaways';
        else if (seg.type === 'items') label = seg.items?.[0]?.title || 'Featured Content';
        else if (seg.type === 'cards') label = 'Benefits';
        else if (seg.type === 'table') label = seg.column1Title || 'Timeline Table';
      }
      items.push({ id: segId, label: label || `Section ${idx + 1}` });
    });

    if (conclusionParagraphs.length > 0) {
      items.push({ id: 'conclusion', label: 'Conclusion' });
    }
    return items;
  }, [segments, conclusionParagraphs]);

  const [activeToc, setActiveToc] = React.useState<string>(tocItems[0]?.id || 'conclusion');
  const [openTakeawaysMap, setOpenTakeawaysMap] = React.useState<Record<string, boolean>>({});

  // Auto-scroll handler
  const handleTocClick = (id: string) => {
    setActiveToc(id);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Form State
  const [formData, setFormData] = React.useState({
    fullName: '',
    email: '',
    phone: '',
    isRobotChecked: false,
    agreeTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [shareUrl, setShareUrl] = React.useState('');
  const [latestBlogs, setLatestBlogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      window.scrollTo(0, 0);
      setShareUrl(window.location.href);
    }
    async function fetchLatestBlogs() {
      try {
        const res = await fetch('/api/blogs');
        if (res.ok) {
          const data = await res.json();
          const list = Array.isArray(data) ? data : data?.blogs || [];
          const currentPath = typeof window !== 'undefined' ? window.location.pathname.toLowerCase() : '';
          const currentSlug = (content as any)?.slug?.toLowerCase() || (content as any)?.fullPath?.toLowerCase() || '';

          const filtered = list.filter((b: any) => {
            const blogTitle = (b.title || '').trim().toLowerCase();
            const blogSlug = (b.slug || '').trim().toLowerCase();
            const blogFullPath = (b.fullPath || '').trim().toLowerCase();
            const currentTitle = (heroTitle || '').trim().toLowerCase();

            // Exclude if title matches
            if (blogTitle && currentTitle && blogTitle === currentTitle) return false;

            // Exclude if slug matches
            if (blogSlug && currentSlug && (blogSlug === currentSlug || currentSlug.includes(blogSlug))) return false;

            // Exclude if fullPath matches current window pathname
            if (currentPath && blogFullPath && (currentPath === blogFullPath || currentPath.endsWith(blogSlug))) return false;

            return true;
          });
          setLatestBlogs(filtered.slice(0, 3));
        }
      } catch (err) {
        // Leave empty if fetch fails
      }
    }
    fetchLatestBlogs();
  }, [heroTitle, (content as any)?.slug, (content as any)?.fullPath]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      alert('Please fill in all required fields.');
      return;
    }
    if (!formData.agreeTerms) {
      alert('Please agree to the disclaimer terms before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          formType: 'blog-lead',
          pageName: heroTitle || (typeof window !== 'undefined' ? window.location.pathname : ''),
        }),
      });

      if (res.ok) {
        alert('Thank you! Your request for estimation has been submitted.');
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          isRobotChecked: false,
          agreeTerms: false,
        });
      } else {
        alert('Failed to submit request. Please try again.');
      }
    } catch (err) {
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white font-sans text-slate-900">

      {/* 1. HERO SECTION (Customizable BG/Gradient Banner) */}
      <section
        className="w-full py-24 sm:py-32 px-6 flex flex-col items-center justify-center text-center text-white relative overflow-hidden"
        style={{
          background: bgColor
            ? bgColor
            : `linear-gradient(to right, ${gradientFrom}, ${gradientVia}, ${gradientTo})`
        }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.15),transparent_50%)] pointer-events-none" />

        <div className="max-w-5xl mx-auto space-y-6 relative z-10">
          {(content?.titleGradientFrom || content?.titleGradientTo) && (content as any)?.enableTitleGradientAnimation !== false ? (
            <HeroTitle
              as="h1"
              title={heroTitle}
              gradientFrom={content.titleGradientFrom}
              gradientTo={content.titleGradientTo}
              enableAnimation={(content as any)?.enableTitleGradientAnimation}
              className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight max-w-4xl mx-auto justify-center"
            />
          ) : (
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-light tracking-tight leading-tight max-w-4xl mx-auto text-white/95">
              {heroTitle}
            </h1>
          )}

          <div className="flex items-center justify-center gap-3 text-sm sm:text-base font-normal text-white/80">
            <span>{authorCardName}</span>
            <span className="opacity-60">|</span>
            <span>{date}</span>
            <span className="opacity-60">|</span>
            <span>{readTime}</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN BLOG BODY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT SIDEBAR: Dynamic Auto-Scrolling TOC */}
          <aside className="lg:col-span-3 space-y-8 sticky top-24 hidden lg:block">
            <div className="relative pl-4 border-l-2 border-slate-100 space-y-4">
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">In this article</div>
              <ul className="space-y-3 text-xs sm:text-sm font-medium text-slate-500">
                {tocItems.map((item) => {
                  const isActive = activeToc === item.id;
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => handleTocClick(item.id)}
                        className={`text-left transition-colors hover:text-[#4A3AFF] block leading-snug cursor-pointer ${isActive ? 'text-[#2D1577] font-bold' : 'text-slate-600'
                          }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Social Sharing */}
            <div className="pt-8 border-t border-slate-100 space-y-3">
              <span className="text-xs font-semibold text-slate-500 block">Share this article</span>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on Facebook"
                  className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-[#1877F2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                {/* LinkedIn */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on LinkedIn"
                  className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-[#0A66C2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
                </a>
                {/* X / Twitter */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(heroTitle)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Share on X (Twitter)"
                  className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs hover:bg-[#1DA1F2] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
              </div>
            </div>
          </aside>

          {/* CENTER: Main Dynamic Segments */}
          <main className="lg:col-span-6 space-y-12">
            {segments.map((seg, sIdx) => {
              const segId = seg.id || `segment-${seg.type}-${sIdx}`;

              if (seg.type === 'key-takeaways') {
                const isOpen = openTakeawaysMap[segId] ?? true;
                return (
                  <div key={segId} id={segId} className="scroll-mt-28 space-y-6">
                    <div className="bg-[#F2F0FF] rounded-2xl p-6 sm:p-8 space-y-4 border border-[#E5E0FF]">
                      <div
                        className="flex items-center justify-between cursor-pointer select-none"
                        onClick={() => setOpenTakeawaysMap(prev => ({ ...prev, [segId]: !isOpen }))}
                      >
                        <h3 className="text-lg font-bold text-slate-900">{seg.title || 'Key takeaways:'}</h3>
                        <div className="w-7 h-7 rounded-full bg-[#E0D9FF] flex items-center justify-center text-[#4A3AFF]">
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                        </div>
                      </div>

                      <AnimatePresence>
                        {isOpen && (
                          <motion.ul
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="space-y-3 text-xs sm:text-sm text-slate-700 font-normal leading-relaxed pt-2"
                          >
                            {seg.points?.map((pt, pIdx) => (
                              <li key={pIdx} className="flex items-start gap-2.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-[#4A3AFF] shrink-0 mt-2" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </motion.ul>
                        )}
                      </AnimatePresence>
                    </div>

                    {seg.descriptions && seg.descriptions.length > 0 && (
                      <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {seg.descriptions.map((desc, dIdx) => (
                          typeof desc === 'string' && (desc.includes('<p>') || desc.includes('<')) ? (
                            <div key={dIdx} dangerouslySetInnerHTML={{ __html: desc }} />
                          ) : (
                            <p key={dIdx}>{desc}</p>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                );
              }

              if (seg.type === 'items') {
                return (
                  <div key={segId} id={segId} className="scroll-mt-28 space-y-10">
                    {seg.items?.map((item, iIdx) => (
                      <div key={iIdx} className="space-y-6">
                        {item.title && (
                          <FormattedText
                            content={item.title}
                            as="div"
                            className="text-xl sm:text-2xl font-bold text-slate-900 [&_p]:text-inherit [&_p]:font-bold [&_p]:m-0"
                          />
                        )}
                        {item.descriptions && item.descriptions.length > 0 && (
                          <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                            {item.descriptions.map((dText, dIdx) => (
                              <FormattedText key={dIdx} content={dText} />
                            ))}
                          </div>
                        )}
                        {item.image && (
                          <div className="my-6 rounded-2xl overflow-hidden border border-slate-100 bg-white shadow-sm p-3 flex items-center justify-center">
                            <img src={item.image} alt={item.title || 'Item image'} className="w-full h-auto object-contain max-h-[450px]" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                );
              }

              if (seg.type === 'cards') {
                return (
                  <div key={segId} id={segId} className="scroll-mt-28 space-y-4">
                    {seg.cards?.map((card, cIdx) => (
                      <div key={cIdx} className="bg-[#F4F2FF] rounded-2xl p-6 border border-[#EBE6FF] space-y-2">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">{card.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-full">
                          {card.description ? card.description.slice(0, 200) + (card.description.length > 200 ? '...' : '') : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                );
              }

              if (seg.type === 'table') {
                return (
                  <div key={segId} id={segId} className="scroll-mt-28 pt-4 space-y-4">
                    <div className="rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-white">
                      <div className="grid grid-cols-12 bg-[#290d78] text-white font-bold text-xs sm:text-sm border-b-4 border-amber-400">
                        <div className="col-span-6 p-4 border-r border-white/20">{seg.column1Title || 'Column 1'}</div>
                        <div className="col-span-6 p-4 text-center">{seg.column2Title || 'Column 2'}</div>
                      </div>
                      <div className="divide-y divide-slate-100 bg-white text-xs sm:text-sm">
                        {seg.rows?.map((row, rIdx) => (
                          <div key={rIdx} className="grid grid-cols-12 items-center">
                            <div className="col-span-6 p-4 sm:p-5 border-r border-slate-200 space-y-1">
                              <div className="flex items-stretch gap-3">
                                <span className="w-1 bg-amber-400 rounded-full shrink-0 my-0.5" />
                                <div>
                                  <div className="font-bold text-[#290d78] text-base sm:text-lg">{row.col1Title}</div>
                                  {row.col1Desc && (
                                    <div className="text-xs sm:text-sm text-slate-500 font-normal mt-1 leading-relaxed">
                                      {row.col1Desc}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-span-6 p-4 sm:p-5 text-center font-bold text-[#290d78] text-base sm:text-lg">
                              {row.col2Text}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }

              return null;
            })}

            {/* Strictly Single Conclusion Block */}
            {conclusionParagraphs.length > 0 && (
              <div id="conclusion" className="scroll-mt-28 space-y-4 pt-6">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Conclusion</h2>
                <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                  {conclusionParagraphs.map((para, cIdx) => (
                    typeof para === 'string' && (para.includes('<p>') || para.includes('<')) ? (
                      <div key={cIdx} dangerouslySetInnerHTML={{ __html: para }} />
                    ) : (
                      <p key={cIdx}>{para}</p>
                    )
                  ))}
                </div>
              </div>
            )}

            {/* Author Profile Box (Syncs Author Image, Name, Designation, Description) */}
            <div className="bg-[#F8F9FA] rounded-2xl p-6 sm:p-8 border border-slate-200/80 flex flex-col sm:flex-row items-start gap-6 relative mt-10">
              <img
                src={authorCardAvatar}
                alt={authorCardName}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover shrink-0 border border-slate-200"
              />
              <div className="space-y-2 flex-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">THE AUTHOR</span>
                <h3 className="text-lg font-bold text-slate-900">{authorCardName}</h3>
                <p className="text-xs font-semibold text-slate-500">{authorCardRole}</p>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed pt-2">
                  {authorCardBio}
                </p>
              </div>
            </div>

          </main>

          {/* RIGHT SIDEBAR: Estimation Form Card */}
          <aside className="lg:col-span-3 sticky top-24">
            <div className="bg-black text-white rounded-3xl overflow-hidden border border-slate-800 shadow-2xl p-6 sm:p-7 space-y-6">

              <div
                className="relative p-6 sm:p-7 -mx-7 -mt-7 bg-cover bg-center border-b border-purple-900/40 text-center space-y-2 overflow-hidden rounded-t-3xl min-h-[140px] flex items-center justify-center"
                style={{ backgroundImage: 'url("/blog details/hero-header.png")' }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />
                <h3 className="relative z-10 text-lg sm:text-xl font-extrabold text-white leading-snug tracking-tight max-w-[240px] mx-auto text-left sm:text-center">
                  {calcTitle}
                </h3>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
                <div>
                  <input
                    type="text"
                    placeholder="Full Name"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="email"
                    placeholder="Email Address*"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="Phone Number*"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-transparent border-b border-slate-700 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>

                <div className="flex items-start gap-2 text-[10px] text-slate-400 leading-tight pt-2">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                    className="w-3.5 h-3.5 rounded border-slate-700 bg-black text-purple-600 shrink-0 mt-0.5"
                  />
                  <span>{calcDisclaimer}</span>
                </div>

                <button
                  type="submit"
                  disabled={!formData.agreeTerms || isSubmitting}
                  onMouseEnter={() => setIsFormBtnHovered(true)}
                  onMouseLeave={() => setIsFormBtnHovered(false)}
                  style={
                    isFormBtnHovered && (formButtonHoverBgColor || formButtonHoverTextColor)
                      ? {
                          backgroundColor: formButtonHoverBgColor || undefined,
                          backgroundImage: formButtonHoverBgColor ? 'none' : undefined,
                          color: formButtonHoverTextColor || undefined,
                        }
                      : undefined
                  }
                  className={`w-full py-3 rounded-xl font-bold text-xs transition-all duration-200 shadow-lg flex items-center justify-center gap-2 mt-2 ${
                    !formData.agreeTerms || isSubmitting
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed opacity-60'
                      : 'bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] hover:from-[#7C3AED] hover:to-[#6D28D9] text-white cursor-pointer active:scale-[0.98]'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Submitting...</span>
                    </>
                  ) : (
                    <span>Get Free Estimation</span>
                  )}
                </button>
              </form>

              {calcPoints && calcPoints.length > 0 && (
                <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400 font-medium">
                  {calcPoints.map((pt, pIdx) => (
                    <div key={pIdx} className="flex items-center gap-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{pt}</span>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </aside>

        </div>
      </section>

      {/* 3. LATEST BLOGS SECTION (Only rendered if dynamic blogs exist) */}
      {latestBlogs.length > 0 && (
        <section className="border-t border-slate-100 py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Latest blog
              </h2>
              <button
                onClick={() => navigate('/blogs')}
                className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 border border-slate-200 px-4 py-2 rounded-full hover:bg-slate-50 transition-all cursor-pointer"
              >
                <span>View all News blog</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {latestBlogs.map((blog) => (
                <div
                  key={blog.slug || blog.id}
                  onClick={() => navigate(blog.fullPath || `/blog/${blog.slug}`)}
                  className="group cursor-pointer bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="aspect-[16/10] overflow-hidden bg-slate-100 relative">
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[11px] font-semibold">
                        {blog.topic}
                      </span>
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug group-hover:text-[#4A3AFF] transition-colors line-clamp-2">
                        {blog.title}
                      </h3>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <img
                        src={blog.author?.avatar || blog.authorAvatar}
                        alt={blog.author?.name || blog.authorName}
                        className="w-8 h-8 rounded-full bg-slate-100"
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-800">{blog.author?.name || blog.authorName}</p>
                        <p className="text-[10px] text-slate-400">{blog.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
