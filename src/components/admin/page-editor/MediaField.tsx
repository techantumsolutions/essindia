'use client';

import React from 'react';
import { ImageIcon, X } from 'lucide-react';
import { humanLabel } from './field-utils';
import { toast } from 'sonner';

interface MediaFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
}

export function MediaField({ fieldKey, value, onChange }: MediaFieldProps) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 10MB file size limit
    const MAX_SIZE_MB = 10;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    if (file.size > MAX_SIZE_BYTES) {
      toast.error(`File size exceeds the ${MAX_SIZE_MB}MB limit.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch('/api/admin/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.url);
      setShowPreview(true);
      toast.success('File uploaded successfully');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const isVideo = value && (value.toLowerCase().match(/\.(mp4|webm|ogg|mov)$/) || value.includes('video'));

  return (
    <div className="space-y-2">
      <label className="text-xs font-semibold text-slate-500">{humanLabel(fieldKey)}</label>
      <div className="flex items-start gap-3">
        {value && showPreview ? (
          <div className="relative group shrink-0">
            {isVideo ? (
              <video
                src={value}
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-50"
                controls={false}
                muted
                playsInline
                onError={() => setShowPreview(false)}
              />
            ) : (
              <img
                src={value}
                alt=""
                className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-slate-50"
                onError={() => setShowPreview(false)}
              />
            )}
            <button
              type="button"
              onClick={() => onChange('')}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-center bg-slate-50 shrink-0">
            <ImageIcon className="w-6 h-6 text-slate-300" />
          </div>
        )}
        <div className="flex-1 space-y-2">
          <div className="flex gap-2">
            <input
              type="text"
              value={value}
              onChange={(e) => {
                onChange(e.target.value);
                setShowPreview(true);
              }}
              placeholder="Enter file URL or path..."
              className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-[#4B2A63]/10 border border-transparent focus:border-[#4B2A63]/20"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2.5 bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shrink-0"
            >
              {isUploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
          <p className="text-[10px] text-slate-400">
            Paste media URL or click "Upload" to upload from your device.
            <span className="block mt-1 text-rose-500 font-medium">
              * Disclaimer: Max upload size is 10MB. Supports images and videos.
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

