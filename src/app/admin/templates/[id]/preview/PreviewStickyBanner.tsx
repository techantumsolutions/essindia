'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, ArrowLeft, Plus } from 'lucide-react';

interface PreviewStickyBannerProps {
  templateId: string;
  templateName: string;
  isPageMode?: boolean;
}

export function PreviewStickyBanner({ templateId, templateName, isPageMode }: PreviewStickyBannerProps) {
  const handleAction = () => {
    if (isPageMode) {
      window.location.href = `/admin/pages/${templateId}`;
    } else {
      window.location.href = `/admin/pages?createPage=true&templateId=${templateId}`;
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 h-16 bg-[#4B2A63]/90 backdrop-blur-md border-b border-white/10 z-[9999] flex items-center justify-between px-6 md:px-12 text-white shadow-lg shadow-[#4B2A63]/25">
      <div className="flex items-center gap-3.5">
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
          <Eye className="w-4 h-4 text-[#FFD54F]" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black tracking-widest text-[#FFD54F] uppercase bg-white/10 px-2 py-0.5 rounded-full">
              {isPageMode ? 'Page Preview' : 'Preview Mode'}
            </span>
            <h4 className="text-sm font-black truncate max-w-[200px] md:max-w-xs">{templateName}</h4>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          onClick={() => window.close()}
          className="text-white/80 hover:text-white hover:bg-white/5 rounded-full px-4 text-xs font-bold shrink-0 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
          Close
        </Button>
        <Button
          onClick={handleAction}
          className="bg-[#FFD54F] hover:bg-[#F7C844] text-[#4B2A63] font-black rounded-full px-5 h-9 text-xs shadow-md transition-all duration-300 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5 stroke-[3]" />
          {isPageMode ? 'Edit Page' : 'Use Template'}
        </Button>
      </div>
    </div>
  );
}
