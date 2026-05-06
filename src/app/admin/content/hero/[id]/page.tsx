'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Eye, 
  Type,
  Link as LinkIcon,
  MousePointer
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MotionSection } from '@/components/animations/MotionSection';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function HeroEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [content, setContent] = React.useState({
    title: "",
    subtitle: "",
    primaryCta: { label: "", url: "" },
    secondaryCta: { label: "", url: "" },
    image: ""
  });

  React.useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch(`/api/admin/content/${id}`);
        const data = await res.json();
        if (data.content) {
          setContent(data.content);
        }
      } catch (error) {
        toast.error('Failed to load section data');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchSection();
  }, [id]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (res.ok) {
        toast.success('Hero section updated successfully');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Failed to save changes');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RotateCcw className="w-10 h-10 text-[#4B2A63]" />
        </motion.div>
        <p className="mt-4 text-slate-500 font-medium tracking-tight">Initializing Editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Edit Hero Section</h1>
            <p className="text-sm text-slate-500 font-medium">Customize the first impression of your website.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-slate-200 gap-2 active:scale-95 cursor-pointer" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full gap-2 px-8 shadow-lg shadow-[#4B2A63]/20 min-w-[140px] active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Editor Form (Left 2/3) */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Main Content Card */}
          <MotionSection className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                <Type className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Heading & Subtitle</h2>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Hero Title</label>
                <textarea 
                  value={content.title}
                  onChange={(e) => setContent({...content, title: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl p-4 text-lg font-bold text-slate-900 transition-all outline-none min-h-[120px] resize-none"
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-[13px] font-bold text-slate-400 uppercase tracking-wider ml-1">Subtitle Description</label>
                <textarea 
                  value={content.subtitle}
                  onChange={(e) => setContent({...content, subtitle: e.target.value})}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl p-4 text-[15px] font-medium text-slate-600 transition-all outline-none min-h-[100px] resize-none"
                />
              </div>
            </div>
          </MotionSection>

          {/* CTA Buttons Card */}
          <MotionSection delay={0.1} className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-8">
            <div className="flex items-center gap-3 pb-6 border-b border-slate-50">
              <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
                <MousePointer className="w-5 h-5" />
              </div>
              <h2 className="font-bold text-lg text-slate-900">Call to Actions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900">Primary Button</p>
                <div className="space-y-3">
                  <input 
                    type="text" placeholder="Label" 
                    value={content.primaryCta?.label} 
                    onChange={(e) => setContent({...content, primaryCta: {...content.primaryCta, label: e.target.value}})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#4B2A63]" 
                  />
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" placeholder="URL" 
                      value={content.primaryCta?.url} 
                      onChange={(e) => setContent({...content, primaryCta: {...content.primaryCta, url: e.target.value}})}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#4B2A63]" 
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-4 p-5 rounded-2xl bg-slate-50/50 border border-slate-100">
                <p className="text-sm font-bold text-slate-900">Secondary Button</p>
                <div className="space-y-3">
                  <input 
                    type="text" placeholder="Label" 
                    value={content.secondaryCta?.label} 
                    onChange={(e) => setContent({...content, secondaryCta: {...content.secondaryCta, label: e.target.value}})}
                    className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm outline-none focus:border-[#4B2A63]" 
                  />
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <input 
                      type="text" placeholder="URL" 
                      value={content.secondaryCta?.url} 
                      onChange={(e) => setContent({...content, secondaryCta: {...content.secondaryCta, url: e.target.value}})}
                      className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-[#4B2A63]" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </MotionSection>

        </div>

        {/* Sidebar Controls (Right 1/3) */}
        <div className="space-y-8">
          <div className="bg-[#4B2A63] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider">
                Live Preview
              </div>
              <h3 className="text-xl font-bold leading-tight">Check your changes in real-time</h3>
              <Button className="w-full bg-white text-[#4B2A63] hover:bg-slate-100 rounded-xl font-bold py-6 gap-2 active:scale-95 cursor-pointer" onClick={() => window.open('/', '_blank')}>
                <Eye className="w-4 h-4" />
                Launch Preview
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
