'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Search, Loader2, Image as ImageIcon } from 'lucide-react';
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

export function MediaPickerModal({ isOpen, onClose, onSelect }: MediaPickerModalProps) {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);

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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl font-bold">Select Media</DialogTitle>
          <div className="relative mt-4">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search files..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-[#4B2A63]/20"
            />
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
              <p>No media found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {items.map((item) => {
                const isVideo = item.mimeType.startsWith('video/');
                return (
                  <div
                    key={item.id}
                    onClick={() => onSelect(item.url)}
                    className="group relative aspect-square bg-white rounded-xl border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 hover:ring-[#4B2A63] transition-all"
                  >
                    {isVideo ? (
                      <video src={item.url} className="w-full h-full object-cover" />
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
