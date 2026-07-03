'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2, Image as ImageIcon, Film, FileText, FileImage } from 'lucide-react';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number | null;
  createdAt: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
}

type TabType = 'images' | 'videos' | 'gifs' | 'pdfs';

export function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [activeTab, setActiveTab] = React.useState<TabType>('images');

  const fetchMedia = React.useCallback(async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (search) params.set('search', search);
      const res = await fetch(`/api/admin/media?${params}`);
      if (res.ok) setItems(await res.json());
    } catch {
      toast.error('Failed to load media');
    } finally {
      setIsLoading(false);
    }
  }, [search]);

  React.useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(fetchMedia, 300);
    return () => clearTimeout(t);
  }, [fetchMedia, isOpen]);

  const filteredItems = items.filter(item => {
    if (activeTab === 'images') {
      return item.mimeType.startsWith('image/') && item.mimeType !== 'image/gif';
    }
    if (activeTab === 'videos') {
      return item.mimeType.startsWith('video/');
    }
    if (activeTab === 'gifs') {
      return item.mimeType === 'image/gif';
    }
    if (activeTab === 'pdfs') {
      return item.mimeType === 'application/pdf';
    }
    return false;
  });

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">Select Media</DialogTitle>
          <div className="flex flex-col md:flex-row gap-4 mt-4 justify-between items-center">
            <div className="flex p-1 bg-slate-100 rounded-xl space-x-1 w-full md:w-auto overflow-x-auto">
              <button
                onClick={() => setActiveTab('images')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'images' ? 'bg-white text-[#4B2A63] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                Images
              </button>
              <button
                onClick={() => setActiveTab('videos')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'videos' ? 'bg-white text-[#4B2A63] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                Videos
              </button>
              <button
                onClick={() => setActiveTab('gifs')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'gifs' ? 'bg-white text-[#4B2A63] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                GIFs
              </button>
              <button
                onClick={() => setActiveTab('pdfs')}
                className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-colors ${activeTab === 'pdfs' ? 'bg-white text-[#4B2A63] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
              >
                PDFs
              </button>
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search files..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/20 transition-all"
              />
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              {activeTab === 'images' && <ImageIcon className="w-12 h-12 mb-4 opacity-20" />}
              {activeTab === 'videos' && <Film className="w-12 h-12 mb-4 opacity-20" />}
              {activeTab === 'gifs' && <FileImage className="w-12 h-12 mb-4 opacity-20" />}
              {activeTab === 'pdfs' && <FileText className="w-12 h-12 mb-4 opacity-20" />}
              <p>No {activeTab} found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredItems.map((item) => {
                const isVideo = item.mimeType.startsWith('video/');
                const isPdf = item.mimeType === 'application/pdf';

                return (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item.url)}
                    className="group relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#4B2A63] transition-all flex items-center justify-center"
                  >
                    {isVideo ? (
                      <>
                        <video src={item.url} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40 transition-colors">
                          <Film className="w-6 h-6 text-white drop-shadow-md" />
                        </div>
                      </>
                    ) : isPdf ? (
                      <div className="flex items-center justify-center bg-slate-50 w-full h-full group-hover:bg-slate-100 transition-colors">
                        <FileText className="w-10 h-10 text-rose-500" />
                      </div>
                    ) : (
                      <img src={item.url} alt={item.filename} className="w-full h-full object-cover" />
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs truncate">{item.filename}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
