'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Layout, 
  Type, 
  ImageIcon, 
  Grid,
  Briefcase,
  FileText,
  History,
  RotateCcw,
  MousePointer,
  Layers,
  ArrowRight
} from 'lucide-react';
import { StaggerContainer } from '@/components/animations/MotionSection';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ContentManager() {
  const [sections, setSections] = React.useState<any[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch('/api/admin/content/page/index');
        const data = await res.json();
        if (data.sections) {
          setSections(data.sections);
        }
      } catch (error) {
        toast.error('Failed to load sections');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSections();
  }, []);

  const getSectionMetadata = (type: string) => {
    switch (type) {
      case 'hero': return { icon: Layout, label: 'Hero Banner', color: 'bg-blue-50 text-blue-600', desc: 'Main brand message and primary CTA' };
      case 'trusted-brands': return { icon: Grid, label: 'Brand Trust', color: 'bg-slate-50 text-slate-600', desc: 'Client logos and partner grid' };
      case 'intro': return { icon: Type, label: 'Intro Text', color: 'bg-purple-50 text-purple-600', desc: 'Mission statement and key metrics' };
      case 'services': return { icon: Briefcase, label: 'Services Grid', color: 'bg-emerald-50 text-emerald-600', desc: 'Core business offerings and solutions' };
      case 'industries': return { icon: ImageIcon, label: 'Industries', color: 'bg-amber-50 text-amber-600', desc: 'Vertical specific solution blocks' };
      case 'why-ess': return { icon: MousePointer, label: 'Value Prop', color: 'bg-rose-50 text-rose-600', desc: 'Unique selling points and differentiators' };
      case 'portfolio': return { icon: Layers, label: 'Portfolio', color: 'bg-indigo-50 text-indigo-600', desc: 'Case studies and project highlights' };
      case 'blog': return { icon: FileText, label: 'Resources', color: 'bg-cyan-50 text-cyan-600', desc: 'Latest news and thought leadership' };
      default: return { icon: FileText, label: 'Custom Section', color: 'bg-slate-50 text-slate-400', desc: 'Generic content section' };
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Content Manager</h1>
          <p className="text-slate-500 font-medium">Configure and optimize your homepage sections.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full gap-2 active:scale-95 cursor-pointer">
            <History className="w-4 h-4" />
            History
          </Button>
          <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-8 font-bold shadow-lg shadow-[#4B2A63]/20 active:scale-95 cursor-pointer">
            Manage Pages
          </Button>
        </div>
      </div>

      {/* Sections List */}
      <StaggerContainer className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[32px] border border-dashed border-slate-200">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <RotateCcw className="w-10 h-10 text-[#4B2A63] opacity-20" />
            </motion.div>
            <p className="mt-6 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Syncing with Database...</p>
          </div>
        ) : sections.map((section) => {
          const meta = getSectionMetadata(section.type);
          return (
            <motion.div
              key={section.id}
              variants={{
                initial: { opacity: 0, y: 10 },
                animate: { opacity: 1, y: 0, transition: { duration: 0.4 } }
              }}
              className="group bg-white rounded-[24px] p-6 border border-slate-100 flex flex-col md:flex-row items-center gap-6 hover:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] hover:border-[#4B2A63]/10 transition-all cursor-pointer"
            >
              <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110", meta.color)}>
                <meta.icon className="w-7 h-7" />
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="font-bold text-slate-900 group-hover:text-[#4B2A63] transition-colors uppercase text-[15px] tracking-tight">
                    {meta.label}
                  </h3>
                  <span className={cn("text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter", section.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-50 text-slate-400")}>
                    {section.isActive ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <p className="text-[13px] text-slate-400 font-medium">
                  {meta.desc}
                </p>
              </div>

              <div className="hidden lg:flex items-center gap-10 px-8 border-x border-slate-50">
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Type</span>
                  <span className="text-[12px] font-bold text-slate-600">{section.type}</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest mb-1">Last Update</span>
                  <span className="text-[12px] font-bold text-slate-600">
                    {new Date(section.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* We use a specific editor for hero, and generic for others for now */}
                <Link href={`/admin/content/${section.type === 'hero' ? 'hero' : 'editor'}/${section.id}`}>
                  <Button className="bg-slate-50 hover:bg-[#4B2A63] text-slate-600 hover:text-white rounded-full h-12 px-8 font-bold transition-all active:scale-95 cursor-pointer border border-transparent hover:shadow-lg hover:shadow-[#4B2A63]/20 gap-2">
                    Configure
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          );
        })}
      </StaggerContainer>


    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
