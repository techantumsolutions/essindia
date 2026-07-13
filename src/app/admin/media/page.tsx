'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Search, Trash2, Image as ImageIcon, Copy, X, Film, FileText, FileImage, Edit2, Code } from 'lucide-react';
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

type TabType = 'images' | 'videos' | 'gifs' | 'pdfs';

export default function MediaLibraryPage() {
  const [items, setItems] = React.useState<MediaItem[]>([]);
  const [search, setSearch] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState<MediaItem | null>(null);
  const [activeTab, setActiveTab] = React.useState<TabType>('images');
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

    // Validate file type matches the active tab
    if (activeTab === 'images' && (!file.type.startsWith('image/') || file.type === 'image/gif')) {
      toast.error('Only non-GIF images are allowed in the Images tab.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (activeTab === 'videos' && !file.type.startsWith('video/')) {
      toast.error('Only videos are allowed in the Videos tab.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (activeTab === 'gifs' && file.type !== 'image/gif') {
      toast.error('Only GIFs are allowed in the GIFs tab.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }
    if (activeTab === 'pdfs' && file.type !== 'application/pdf') {
      toast.error('Only PDFs are allowed in the PDFs tab.');
      if (fileRef.current) fileRef.current.value = '';
      return;
    }

    let MAX_SIZE_MB = 3;
    if (file.type.startsWith('video/')) {
      MAX_SIZE_MB = 20;
    } else if (file.type === 'application/pdf') {
      MAX_SIZE_MB = 5;
    } else if (file.type === 'image/gif') {
      MAX_SIZE_MB = 3;
    }

    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File size exceeds the ${MAX_SIZE_MB}MB limit for this file type.`);
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
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    navigator.clipboard.writeText(absoluteUrl);
    toast.success('Absolute URL copied to clipboard');
  };

  const copyIframeCode = (url: string) => {
    const absoluteUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
    const iframeCode = `<iframe src="${absoluteUrl}" width="640" height="360" frameborder="0" allowfullscreen></iframe>`;
    navigator.clipboard.writeText(iframeCode);
    toast.success('Iframe embed code copied to clipboard');
  };

  const handleRename = async (id: string, currentName: string) => {
    const newName = window.prompt('Enter new filename:', currentName);
    if (!newName || newName === currentName) return;
    
    try {
      const res = await fetch(`/api/admin/media/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ filename: newName })
      });
      if (res.ok) {
        toast.success('File renamed');
        fetchMedia();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Failed to rename');
      }
    } catch (error) {
      toast.error('Failed to rename');
    }
  };

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

  const getAcceptType = () => {
    switch (activeTab) {
      case 'images': return 'image/jpeg,image/png,image/webp,image/svg+xml';
      case 'videos': return 'video/*';
      case 'gifs': return 'image/gif';
      case 'pdfs': return 'application/pdf';
      default: return 'image/*,video/*,application/pdf';
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Media Library</h1>
          <p className="text-slate-500">Upload and manage assets for pages and sections.</p>
        </div>
        <div>
          <input ref={fileRef} type="file" className="hidden" accept={getAcceptType()} onChange={handleUpload} />
          <Button size="sm" onClick={() => fileRef.current?.click()} disabled={isUploading}>
            <Upload />
            {isUploading ? 'Uploading...' : 'Upload file'}
          </Button>
        </div>
      </div>

      <div className="admin-compact-card px-3 py-2 flex flex-col md:flex-row gap-2 justify-between items-center">
        <div className="flex p-0.5 bg-slate-100 rounded-lg space-x-0.5 w-full md:w-auto overflow-x-auto">
          {(['images', 'videos', 'gifs', 'pdfs'] as TabType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors capitalize ${activeTab === tab ? 'bg-white text-[#4B2A63] shadow-sm' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'}`}
            >
              {tab === 'gifs' ? 'GIFs' : tab === 'pdfs' ? 'PDFs' : tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search files..."
            className="w-full bg-slate-50 rounded-md pl-8 pr-3 py-1.5 text-xs font-medium outline-none border border-transparent focus:border-[#4B2A63]/30 focus:bg-white transition-colors"
          />
        </div>
      </div>

      {isLoading ? (
        <p className="text-center text-xs text-slate-400 py-14">Loading media...</p>
      ) : filteredItems.length === 0 ? (
        <div className="text-center py-14 admin-compact-card border-dashed">
          {activeTab === 'images' && <ImageIcon className="w-8 h-8 text-slate-300 mx-auto mb-3" />}
          {activeTab === 'videos' && <Film className="w-8 h-8 text-slate-300 mx-auto mb-3" />}
          {activeTab === 'gifs' && <FileImage className="w-8 h-8 text-slate-300 mx-auto mb-3" />}
          {activeTab === 'pdfs' && <FileText className="w-8 h-8 text-slate-300 mx-auto mb-3" />}
          <p className="text-xs text-slate-400 font-medium">No {activeTab} yet. Upload your first file.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {filteredItems.map((item, i) => {
            const isVideo = item.mimeType.startsWith('video/');
            const isPdf = item.mimeType === 'application/pdf';

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                className="admin-compact-card overflow-hidden group cursor-pointer hover:border-[#4B2A63]/30 transition-colors"
                onClick={() => setSelectedImage(item)}
              >
                <div className="aspect-square bg-slate-50 flex items-center justify-center overflow-hidden relative">
                  {isVideo ? (
                    <>
                      <video src={item.url} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <Film className="w-6 h-6 text-white drop-shadow-md" />
                      </div>
                    </>
                  ) : isPdf ? (
                    <FileText className="w-8 h-8 text-rose-500" />
                  ) : item.mimeType.startsWith('image/') ? (
                    <img src={item.url} alt={item.altText || item.filename} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <ImageIcon className="w-8 h-8 text-slate-300" />
                  )}
                </div>
                <div className="p-2.5 space-y-1">
                  <p className="text-xs font-semibold text-slate-900 truncate">{item.filename}</p>
                  <p className="text-[10px] text-slate-400 font-mono truncate">{item.url}</p>
                  <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity justify-between">
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyUrl(item.url);
                        }}
                        className="text-slate-400 hover:text-[#4B2A63]"
                        title="Copy direct URL"
                      >
                        <Copy />
                      </Button>
                      {isVideo && (
                        <Button
                          variant="ghost"
                          size="icon-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyIframeCode(item.url);
                          }}
                          className="text-slate-400 hover:text-[#4B2A63]"
                          title="Copy Iframe code"
                        >
                          <Code />
                        </Button>
                      )}
                    </div>
                    <div className="flex gap-0.5">
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRename(item.id, item.filename);
                        }}
                        className="text-slate-400 hover:text-[#4B2A63]"
                        title="Rename file"
                      >
                        <Edit2 />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-xs"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        className="text-rose-400 hover:bg-rose-50"
                        title="Delete file"
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {selectedImage && (
        <div 
          className="fixed inset-0 bg-slate-900/90 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-6xl w-full h-[90vh] flex flex-col items-center justify-center gap-6"
            onClick={e => e.stopPropagation()}
          >
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedImage(null)}
              className="fixed top-6 right-6 text-white hover:bg-white/20 rounded-full w-12 h-12 z-[110] bg-black/20 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </Button>
            
            <div className="flex-1 w-full flex items-center justify-center min-h-0">
              {selectedImage.mimeType.startsWith('video/') ? (
                <video 
                  src={selectedImage.url} 
                  controls 
                  className="max-w-full max-h-full rounded-2xl shadow-2xl" 
                  autoPlay 
                />
              ) : selectedImage.mimeType === 'application/pdf' ? (
                <iframe 
                  src={selectedImage.url} 
                  className="w-full h-full rounded-2xl shadow-2xl bg-white" 
                />
              ) : selectedImage.mimeType.startsWith('image/') ? (
                <img 
                  src={selectedImage.url} 
                  alt={selectedImage.altText || selectedImage.filename} 
                  className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl" 
                />
              ) : (
                 <div className="bg-white p-20 rounded-[32px] shadow-2xl flex flex-col items-center gap-4">
                   <ImageIcon className="w-24 h-24 text-slate-300" />
                   <p className="font-bold text-slate-500">{selectedImage.filename}</p>
                   <a href={selectedImage.url} target="_blank" rel="noreferrer" className="text-blue-500 hover:underline">Open File</a>
                 </div>
              )}
            </div>

            {selectedImage.mimeType.startsWith('video/') && (
              <div className="flex gap-4 pb-4">
                <Button
                  onClick={() => copyUrl(selectedImage.url)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                >
                  <Copy className="w-4 h-4" /> Copy Direct Link
                </Button>
                <Button
                  onClick={() => copyIframeCode(selectedImage.url)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full px-6 py-2.5 text-xs font-bold transition-all flex items-center gap-2 border border-white/10"
                >
                  <Code className="w-4 h-4" /> Copy Iframe Embed Code
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
