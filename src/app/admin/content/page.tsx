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
import { getSectionDefinition } from '@/lib/cms/section-registry';
import { useRouter } from 'next/navigation';

export default function ContentManager() {
  const router = useRouter();
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
    const def = getSectionDefinition(type);
    if (def) return { icon: def.icon, label: def.label, color: def.color, desc: def.description };
    return { icon: FileText, label: 'Custom Section', color: 'bg-slate-50 text-slate-400', desc: 'Generic content section' };
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Content Manager</h1>
          <p className="text-slate-500">Configure and optimize your homepage sections.</p>
        </div>
        <Button size="sm" onClick={() => router.push('/admin/pages')}>
          Manage pages
        </Button>
      </div>

      {/* Sections List */}
      <div className="admin-compact-card overflow-hidden">
        <div className="bg-slate-50/60 px-4 py-2 grid grid-cols-12 gap-2 text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] border-b border-slate-200">
          <div className="col-span-5">Section</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-2 text-center">Status</div>
          <div className="col-span-1 text-center">Updated</div>
          <div className="col-span-2 text-right">Actions</div>
        </div>
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
              <RotateCcw className="w-6 h-6 text-[#4B2A63] opacity-30" />
            </motion.div>
            <p className="mt-3 text-slate-400 text-[11px] font-medium">Loading sections...</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {sections.map((section) => {
              const meta = getSectionMetadata(section.type);
              return (
                <div
                  key={section.id}
                  className="grid grid-cols-12 gap-2 items-center px-4 py-2 hover:bg-slate-50/80 transition-colors"
                >
                  <div className="col-span-5 flex items-center gap-2.5 min-w-0">
                    <div className={cn("w-7 h-7 rounded-md flex items-center justify-center shrink-0", meta.color)}>
                      <meta.icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 truncate">{meta.label}</p>
                      <p className="text-[11px] text-slate-400 truncate">{meta.desc}</p>
                    </div>
                  </div>
                  <div className="col-span-2 font-mono text-[11px] text-slate-500 truncate">{section.type}</div>
                  <div className="col-span-2 text-center">
                    <span className={cn("text-[9px] font-bold px-2 py-0.5 rounded-full uppercase", section.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500")}>
                      {section.isActive ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  <div className="col-span-1 text-center text-[11px] text-slate-400">
                    {new Date(section.updatedAt).toLocaleDateString()}
                  </div>
                  <div className="col-span-2 flex justify-end">
                    <Link href={`/admin/content/${section.type === 'hero' ? 'hero' : 'editor'}/${section.id}`}>
                      <Button size="xs">
                        Configure <ArrowRight />
                      </Button>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
