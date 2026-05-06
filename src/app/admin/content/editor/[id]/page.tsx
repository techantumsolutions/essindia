'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Save, 
  RotateCcw, 
  Eye, 
  Code,
  Info,
  Layers,
  Settings,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MotionSection } from '@/components/animations/MotionSection';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';

export default function GenericSectionEditor() {
  const { id } = useParams();
  const router = useRouter();
  const [isSaving, setIsSaving] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);
  const [sectionData, setSectionData] = React.useState<any>(null);
  const [jsonString, setJsonString] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    async function fetchSection() {
      try {
        const res = await fetch(`/api/admin/content/${id}`);
        const data = await res.json();
        if (data) {
          setSectionData(data);
          setJsonString(JSON.stringify(data.content, null, 2));
        }
      } catch (error) {
        toast.error('Failed to load section data');
      } finally {
        setIsLoading(false);
      }
    }
    if (id) fetchSection();
  }, [id]);

  const handleJsonChange = (val: string) => {
    setJsonString(val);
    try {
      JSON.parse(val);
      setError(null);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const handleSave = async () => {
    if (error) {
      toast.error('Please fix JSON errors before saving');
      return;
    }

    setIsSaving(true);
    try {
      const content = JSON.parse(jsonString);
      const res = await fetch(`/api/admin/content/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      
      if (res.ok) {
        toast.success('Section updated successfully');
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
          <RotateCcw className="w-10 h-10 text-[#4B2A63] opacity-20" />
        </motion.div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Loading Schema...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20">
      {/* Top Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/content">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 cursor-pointer">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Configure {sectionData?.type}</h1>
              <span className="bg-slate-100 text-slate-500 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{sectionData?.id.substring(0,8)}</span>
            </div>
            <p className="text-sm text-slate-500 font-medium">Technical configuration and content structure.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="rounded-full border-slate-200 gap-2 active:scale-95 cursor-pointer" onClick={() => window.location.reload()}>
            <RotateCcw className="w-4 h-4" />
            Reload
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving || !!error}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full gap-2 px-8 shadow-lg shadow-[#4B2A63]/20 min-w-[140px] active:scale-95 cursor-pointer"
          >
            {isSaving ? (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RotateCcw className="w-4 h-4" />
              </motion.div>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Apply Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        
        {/* Editor Side (Left 3/4) */}
        <div className="lg:col-span-3 space-y-8">
          
          {/* JSON Editor Card */}
          <MotionSection className="bg-[#1E1E2E] rounded-[32px] overflow-hidden border border-slate-800 shadow-2xl flex flex-col h-[600px]">
            <div className="bg-[#181825] px-6 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-500/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/50" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="h-4 w-[1px] bg-slate-800 mx-2" />
                <div className="flex items-center gap-2 text-slate-400 text-[12px] font-bold uppercase tracking-widest">
                  <Code className="w-4 h-4 text-blue-400" />
                  Content Schema (JSON)
                </div>
              </div>
              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-[11px] font-bold animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  Invalid JSON Structure
                </div>
              )}
            </div>

            <textarea 
              value={jsonString}
              onChange={(e) => handleJsonChange(e.target.value)}
              spellCheck={false}
              className="flex-1 w-full bg-transparent text-blue-100 p-8 font-mono text-[14px] leading-relaxed outline-none resize-none selection:bg-blue-500/30"
            />
            
            <div className="bg-[#181825] px-8 py-3 flex items-center justify-between text-[11px] font-bold text-slate-500 border-t border-slate-800">
              <div className="flex gap-4">
                <span>Ln {jsonString.split('\n').length}</span>
                <span>Col {jsonString.length}</span>
              </div>
              <div className="flex items-center gap-1.5 text-emerald-500/80 uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Connected to Postgres
              </div>
            </div>
          </MotionSection>

        </div>

        {/* Sidebar Controls (Right 1/4) */}
        <div className="space-y-8">
          
          {/* Preview Card */}
          <div className="bg-[#4B2A63] rounded-[32px] p-8 text-white shadow-2xl relative overflow-hidden group">
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-bold uppercase tracking-wider">
                Live View
              </div>
              <h3 className="text-xl font-bold leading-tight">Verify changes instantly</h3>
              <p className="text-white/60 text-sm font-medium leading-relaxed">Save your changes first, then refresh the public site to see the updates.</p>
              <Button className="w-full bg-white text-[#4B2A63] hover:bg-slate-100 rounded-xl font-bold py-6 gap-2 active:scale-95 cursor-pointer" onClick={() => window.open('/', '_blank')}>
                <Eye className="w-4 h-4" />
                Open Website
              </Button>
            </div>
          </div>

          {/* Section Info */}
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-5 h-5 text-slate-400" />
              <h4 className="font-bold text-slate-900">Properties</h4>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Section ID</span>
                <span className="text-[12px] font-mono text-slate-600 break-all">{sectionData?.id}</span>
              </div>
              
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Created At</span>
                <span className="text-[12px] font-bold text-slate-600">{new Date(sectionData?.createdAt).toLocaleString()}</span>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50 text-blue-600">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-[11px] font-medium leading-relaxed">
                  Modifying the JSON schema directly allows for granular control over all section properties including arrays and nested objects.
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
