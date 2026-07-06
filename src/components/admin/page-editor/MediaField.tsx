'use client';

import React from 'react';
import { ImageIcon, X, FolderOpen, Upload, FileText } from 'lucide-react';
import { humanLabel } from './field-utils';
import { toast } from 'sonner';
import { MediaPickerModal } from './MediaPickerModal';

interface MediaFieldProps {
  fieldKey: string;
  value: string;
  onChange: (value: string) => void;
  hint?: string;
}

export function MediaField({ fieldKey, value, onChange, hint }: MediaFieldProps) {
  const [showPreview, setShowPreview] = React.useState(true);
  const [isUploading, setIsUploading] = React.useState(false);
  const [isPickerOpen, setIsPickerOpen] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Enforce 3MB file size limit
    const MAX_SIZE_MB = 3;
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
  const isPdfField = fieldKey.toLowerCase().includes('pdf');
  const isPdfFile = value && value.toLowerCase().endsWith('.pdf');

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
            ) : isPdfFile ? (
              <div className="w-20 h-20 rounded-xl border border-slate-200 bg-slate-50 flex flex-col items-center justify-center text-slate-500">
                <FileText className="w-8 h-8 mb-1" />
                <span className="text-[9px] uppercase font-bold text-slate-400">PDF</span>
              </div>
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
            {isPdfField ? <FileText className="w-6 h-6 text-slate-300" /> : <ImageIcon className="w-6 h-6 text-slate-300" />}
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
          </div>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors disabled:opacity-50"
            >
              {isUploading ? <Upload className="w-3.5 h-3.5 animate-bounce" /> : <Upload className="w-3.5 h-3.5" />}
              {isUploading ? 'Uploading...' : 'Upload File'}
            </button>
            <button
              type="button"
              onClick={() => setIsPickerOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-[#4B2A63] bg-[#4B2A63]/10 hover:bg-[#4B2A63]/20 rounded-lg transition-colors"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              Browse Library
            </button>
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              accept={isPdfField ? "application/pdf" : "image/*,image/gif,video/*"}
              onChange={handleUpload}
            />
          </div>
          <p className="text-[10px] text-slate-400">
            Paste media URL or click "Upload" to upload from your device.
            <span className="block mt-1 text-rose-500 font-medium">
              * Disclaimer: Max upload size is 3MB. Supports {isPdfField ? 'PDF files' : 'images (including GIFs) and videos'}.
            </span>
            {hint && (
              <span className="block mt-1 text-[#4B2A63] font-medium">
                {hint}
              </span>
            )}
          </p>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(url) => {
          onChange(url);
          setShowPreview(true);
          setIsPickerOpen(false);
        }}
      />
    </div>
  );
}
