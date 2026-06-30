'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Trash2, Image as ImageIcon, Copy, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface MediaItem {
  id: string;
  filename: string;
  url: string;
  mimeType: string;
  size: number | null;
  altText: string | null;
  folder: string | null;
  createdAt: string;
}

export default function MediaLibraryPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<MediaItem | null>(null);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const fetchMedia = React.useCallback(async () => {
    try {
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
    const t = setTimeout(fetchMedia, 300);
    return () => clearTimeout(t);
  }, [fetchMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const MAX_SIZE_MB = 3;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File size exceeds the ${MAX_SIZE_MB}MB limit.`);
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success('File uploaded');
      fetchMedia();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this file?')) return;
    const res = await fetch(`/api/admin/media/${id}`, { method: 'DELETE' });
    if (res.ok) {
      toast.success('Deleted');
      fetchMedia();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Media Library</h1>
          <p className="text-slate-500 font-medium">Upload and manage assets for pages and sections.</p>
        </div>
        <div>
          <input ref={fileRef} type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} />
          <Button
            onClick={() => fileRef.current?.click()}
            disabled={isUploading}
            className="bg-[#4B2A63] text-white rounded-full px-8 h-12 font-bold"
          >
            <Upload className="w-5 h-5 mr-2" />
            {isUploading ? 'Uploading...' : 'Upload File'}
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 border border-slate-100 flex gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-slate-50 rounded-xl pl-12 pr-4 py-2.5 text-sm font-medium outline-none"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-slate-400 py-16">Loading media...</p>
      ) : items.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-[32px] border border-dashed border-slate-200">
          <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-400 font-medium">No media yet. Upload your first file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {items.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-[20px] border border-slate-100 overflow-hidden group cursor-pointer hover:shadow-xl hover:shadow-slate-200/50 transition-all"
              onClick={() => setSelectedImage(item)}
            >
              <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
                {item.mimeType.startsWith('image/') ? (
                  <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <ImageIcon className="w-10 h-10 text-slate-300" />
                )}
              </div>
              <div className="p-4 space-y-2">
                <p className="font-bold text-sm text-slate-900 truncate">{item.filename}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">{item.url}</p>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(item.id);
                    }}
                    className="rounded-xl text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-14 right-0 text-white hover:bg-white/20 rounded-full w-10 h-10"
            >
              <X className="w-6 h-6" />
            </Button>
            {selectedImage.mimeType.startsWith('image/') ? (
              <img 
                src={selectedImage.url} 
                alt={selectedImage.altText || selectedImage.filename} 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl" 
              />
            ) : (
               <div className="bg-white p-20 rounded-[32px] shadow-2xl flex flex-col items-center gap-4">
                 <ImageIcon className="w-24 h-24 text-slate-300" />
                 <p className="font-bold text-slate-500">{selectedImage.filename}</p>
               </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
