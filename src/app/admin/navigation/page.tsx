'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  GripVertical, 
  ExternalLink, 
  Layout, 
  Columns, 
  Settings2,
  Trash2,
  Link as LinkIcon,
  ChevronDown,
  Monitor,
  Smartphone,
  Tablet,
  CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { StaggerContainer } from '@/components/animations/MotionSection';

const menuItems = [
  { id: '1', label: 'Home', url: '/', mega: false },
  { id: '2', label: 'About', url: '/about', mega: false },
  { 
    id: '3', 
    label: 'Solutions', 
    url: '/solutions', 
    mega: true,
    columns: [
      { title: 'ERP Software', items: ['Overview', 'Modules', 'Industries'] },
      { title: 'Data & AI', items: ['Business Intelligence', 'RPA', 'Data Lake'] },
      { title: 'Development', items: ['Mobile Apps', 'Custom Software', 'Cloud Migration'] },
    ]
  },
  { id: '4', label: 'Industries', url: '/industries', mega: true },
  { id: '5', label: 'Resources', url: '/resources', mega: false },
  { id: '6', label: 'Contact', url: '/contact', mega: false },
];

export default function NavigationModule() {
  const [activeMenu, setActiveMenu] = React.useState('header-main');
  const [selectedItem, setSelectedItem] = React.useState<string | null>('3');

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Navigation Manager</h1>
          <p className="text-slate-500 font-medium">Design your multi-level Mega Menus and site-wide navigation.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-full px-6 h-12 font-bold border-slate-200 active:scale-95 cursor-pointer">
            Discard
          </Button>
          <Button className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold shadow-lg shadow-[#4B2A63]/20 active:scale-95 cursor-pointer gap-2">
            Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Left Column: Menu Structure (1/3) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-8">
              <h3 className="font-bold text-lg text-slate-900">Menu Hierarchy</h3>
              <Button size="icon" variant="ghost" className="rounded-full bg-slate-50 text-[#4B2A63]">
                <Plus className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-2">
              {menuItems.map((item) => (
                <motion.div
                  key={item.id}
                  onClick={() => setSelectedItem(item.id)}
                  className={cn(
                    "flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer group",
                    selectedItem === item.id 
                      ? "bg-[#4B2A63] border-[#4B2A63] text-white shadow-xl shadow-[#4B2A63]/20" 
                      : "bg-white border-slate-50 text-slate-600 hover:border-[#4B2A63]/20 hover:bg-slate-50"
                  )}
                >
                  <GripVertical className={cn("w-4 h-4 shrink-0", selectedItem === item.id ? "text-white/40" : "text-slate-300")} />
                  <span className="flex-1 font-bold text-[14px]">{item.label}</span>
                  {item.mega && (
                    <span className={cn(
                      "text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter",
                      selectedItem === item.id ? "bg-white/20 text-white" : "bg-purple-50 text-purple-600"
                    )}>
                      Mega
                    </span>
                  )}
                  <ChevronDown className={cn("w-4 h-4 shrink-0 transition-transform", selectedItem === item.id ? "-rotate-90 opacity-40" : "opacity-20")} />
                </motion.div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6 rounded-2xl border-dashed border-2 py-8 text-slate-400 font-bold gap-2">
              <Plus className="w-4 h-4" />
              Add Menu Item
            </Button>
          </div>
        </div>

        {/* Right Column: Configuration & Preview (2/3) */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Item Configuration */}
          <div className="bg-white rounded-[32px] p-10 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
            <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-[#4B2A63] flex items-center justify-center">
                  <Settings2 className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-xl text-slate-900">Item Configuration</h3>
                  <p className="text-sm text-slate-400 font-medium">Customize behavior and mega menu layout.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" size="icon" className="rounded-xl text-slate-400 hover:text-rose-500">
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Label</label>
                  <input type="text" defaultValue="Solutions" className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl px-6 py-4 text-[15px] font-bold outline-none transition-all" />
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Link URL / Page</label>
                  <div className="relative">
                    <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" defaultValue="/solutions" className="w-full bg-slate-50 border-2 border-transparent focus:border-[#4B2A63]/10 focus:bg-white focus:ring-4 focus:ring-[#4B2A63]/5 rounded-2xl pl-14 pr-6 py-4 text-[15px] font-bold outline-none transition-all" />
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Behavior</label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl bg-[#4B2A63]/5 border-2 border-[#4B2A63] flex flex-col items-center gap-2 cursor-pointer">
                      <Layout className="w-6 h-6 text-[#4B2A63]" />
                      <span className="text-[12px] font-bold text-[#4B2A63]">Mega Menu</span>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-50 border-2 border-transparent flex flex-col items-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                      <ExternalLink className="w-6 h-6 text-slate-400" />
                      <span className="text-[12px] font-bold text-slate-500">Simple Link</span>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">Mega Menu Template</label>
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Columns className="w-5 h-5 text-slate-400" />
                      <span className="text-[14px] font-bold text-slate-700">3-Column Grid with Cards</span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-300" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Mega Menu Visual Builder (Mock) */}
          <div className="bg-[#1A1A2E] rounded-[32px] p-10 text-white shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: 'radial-gradient(white 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
            
            <div className="flex items-center justify-between mb-10 relative z-10">
              <h4 className="font-bold text-lg">Mega Menu Preview</h4>
              <div className="flex gap-2 bg-white/10 rounded-xl p-1">
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8 bg-white/20"><Monitor className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8"><Tablet className="w-4 h-4" /></Button>
                <Button size="icon" variant="ghost" className="rounded-lg h-8 w-8"><Smartphone className="w-4 h-4" /></Button>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 text-slate-900 min-h-[300px] relative z-10">
              <div className="grid grid-cols-3 gap-8">
                {[1,2,3].map(i => (
                  <div key={i} className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h5 className="font-black text-[11px] uppercase tracking-[0.2em] text-slate-400">Column {i}</h5>
                      <Plus className="w-3.5 h-3.5 text-slate-300" />
                    </div>
                    <div className="space-y-2">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold flex items-center justify-between group">
                        Link Component
                        <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[13px] font-bold flex items-center justify-between group">
                        Feature Card
                        <GripVertical className="w-3.5 h-3.5 text-slate-200 group-hover:text-slate-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
