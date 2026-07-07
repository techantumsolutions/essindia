'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Save,
  Upload,
  Trash2,
  ArrowUp,
  ArrowDown,
  Plus,
  Link as LinkIcon,
  RotateCcw,
  Settings2,
  Globe,
  Share2,
  LayoutGrid,
  ChevronDown,
  Search,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface FooterLink {
  label: string;
  url: string;
  pageId: string | null;
}

interface FooterSettingsData {
  logoUrl: string;
  description: string;
  twitterUrl: string;
  linkedinUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  countries: string[];
  links: {
    company: FooterLink[];
    products: FooterLink[];
    industries: FooterLink[];
    services: FooterLink[];
    social?: {
      twitter: { url: string; enabled: boolean };
      linkedin: { url: string; enabled: boolean };
      facebook: { url: string; enabled: boolean };
      youtube: { url: string; enabled: boolean };
      instagram: { url: string; enabled: boolean };
    };
  };
}

interface SearchablePageSelectProps {
  value: string | null;
  onChange: (pageId: string | null) => void;
  pages: Array<{ id: string; title: string; routePath: string }>;
}

function SearchablePageSelect({ value, onChange, pages }: SearchablePageSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedPage = pages.find(p => p.id === value);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPages = pages.filter(page =>
    page.title.toLowerCase().includes(search.toLowerCase()) ||
    page.routePath.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          setSearch('');
        }}
        className="w-full bg-white border border-slate-200 hover:border-[#4B2A63]/30 rounded-xl px-4 py-2 flex justify-between items-center transition-all cursor-pointer"
      >
        <span className="truncate text-sm font-bold text-slate-700">
          {selectedPage ? `${selectedPage.title} (${selectedPage.routePath})` : 'Select a page...'}
        </span>
        <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Popover */}
      {isOpen && (
        <div className="absolute z-[9999] left-0 w-[300px] md:w-[450px] mt-2 bg-white border border-slate-100 rounded-2xl shadow-[0_15px_35px_rgba(0,0,0,0.1)] overflow-hidden">
          {/* Search bar */}
          <div className="p-3 border-b border-slate-50 relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search pages..."
              className="w-full bg-slate-50 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold border border-transparent focus:outline-none focus:border-[#4B2A63]/20"
              autoFocus
            />
          </div>

          {/* List */}
          <div className="max-h-60 overflow-y-auto p-1 custom-scrollbar">
            <button
              type="button"
              onClick={() => {
                onChange(null);
                setIsOpen(false);
              }}
              className="w-full text-left px-3 py-1.5 text-xs font-black text-rose-600 hover:bg-rose-50 rounded-xl transition-all cursor-pointer flex items-center justify-between"
            >
              <span>Clear Page Link</span>
              <span className="text-[10px] text-rose-400 font-bold font-mono">#</span>
            </button>
            <div className="h-[1px] bg-slate-100 my-1 mx-2" />

            {filteredPages.length === 0 ? (
              <div className="py-4 text-center text-xs font-semibold text-slate-400">
                No pages found
              </div>
            ) : (
              filteredPages.map((page) => (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => {
                    onChange(page.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-between cursor-pointer ${value === page.id
                    ? 'bg-[#4B2A63] text-white'
                    : 'text-slate-700 hover:bg-slate-50'
                    }`}
                >
                  <span className="truncate mr-2">{page.title}</span>
                  <span className={`text-[10px] truncate shrink-0 ${value === page.id ? 'text-white/60' : 'text-slate-400 font-mono'}`}>
                    {page.routePath}
                  </span>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}

type LinkCategory = 'company' | 'products' | 'industries' | 'services';

export default function FooterCMSPage() {
  const [settings, setSettings] = useState<FooterSettingsData | null>(null);
  const [registryPages, setRegistryPages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'branding' | 'links'>('branding');
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    category: LinkCategory | null;
    index: number | null;
    label: string;
  }>({
    isOpen: false,
    category: null,
    index: null,
    label: '',
  });

  // Load configuration and pages list
  useEffect(() => {
    async function loadData() {
      try {
        const [settingsRes, pagesRes] = await Promise.all([
          fetch('/api/admin/footer', { cache: 'no-store' }),
          fetch('/api/admin/pages?registry=true', { cache: 'no-store' }),
        ]);

        if (settingsRes.ok) {
          const data = await settingsRes.json();
          if (data && (!data.links || !data.links.social)) {
            data.links = data.links || {};
            data.links.social = {
              twitter: { url: data.twitterUrl || '#', enabled: !!data.twitterUrl },
              linkedin: { url: data.linkedinUrl || '#', enabled: !!data.linkedinUrl },
              facebook: { url: data.facebookUrl || '#', enabled: !!data.facebookUrl },
              youtube: { url: data.youtubeUrl || '#', enabled: !!data.youtubeUrl },
              instagram: { url: '', enabled: false }
            };
          }
          setSettings(data);
        } else {
          toast.error('Failed to load footer settings');
        }

        if (pagesRes.ok) {
          const pagesData = await pagesRes.json();
          if (Array.isArray(pagesData)) {
            setRegistryPages(pagesData);
          }
        }
      } catch (err) {
        toast.error('An error occurred loading footer settings');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const saveToDb = async (data: FooterSettingsData) => {
    try {
      const res = await fetch('/api/admin/footer', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        toast.success('Footer settings saved successfully');
      } else {
        const errData = await res.json();
        toast.error(errData.error || 'Failed to save settings');
      }
    } catch (err) {
      toast.error('Network error saving settings');
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    // Validate that all links have a non-empty label
    for (const [category, links] of Object.entries(settings.links)) {
      if (category === 'social') continue;
      const linkList = links as FooterLink[];
      for (let i = 0; i < linkList.length; i++) {
        const link = linkList[i];
        if (!link.label.trim()) {
          toast.error(`Please provide a label for item ${i + 1} in the "${category}" column.`);
          return;
        }
      }
    }

    setIsSaving(true);
    await saveToDb(settings);
    setIsSaving(false);
  };

  const handleUploadLogo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !settings) return;

    const MAX_SIZE_MB = 2;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`Logo exceeds ${MAX_SIZE_MB}MB size limit.`);
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/admin/media', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Upload failed');
      }

      const media = await res.json();
      setSettings({
        ...settings,
        logoUrl: media.url,
      });
      toast.success('Logo uploaded and updated');
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload logo');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const updateField = (field: keyof FooterSettingsData, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const updateSocialLink = (platform: 'twitter' | 'linkedin' | 'facebook' | 'youtube' | 'instagram', key: 'url' | 'enabled', value: any) => {
    if (!settings) return;
    const social = settings.links.social || {
      twitter: { url: settings.twitterUrl || '#', enabled: !!settings.twitterUrl },
      linkedin: { url: settings.linkedinUrl || '#', enabled: !!settings.linkedinUrl },
      facebook: { url: settings.facebookUrl || '#', enabled: !!settings.facebookUrl },
      youtube: { url: settings.youtubeUrl || '#', enabled: !!settings.youtubeUrl },
      instagram: { url: '', enabled: false }
    };
    const updatedSocial = {
      ...social,
      [platform]: {
        ...social[platform],
        [key]: value
      }
    };
    setSettings({
      ...settings,
      links: {
        ...settings.links,
        social: updatedSocial
      }
    });
  };

  const addCountry = () => {
    if (!settings) return;
    setSettings({
      ...settings,
      countries: [...settings.countries, ''],
    });
  };

  const removeCountry = (index: number) => {
    if (!settings) return;
    setSettings({
      ...settings,
      countries: settings.countries.filter((_, i) => i !== index),
    });
  };

  const updateCountry = (index: number, val: string) => {
    if (!settings) return;
    const countries = [...settings.countries];
    countries[index] = val;
    updateField('countries', countries);
  };

  // Links management helpers
  const handleAddLink = (category: LinkCategory) => {
    if (!settings) return;
    const list = [...(settings.links[category] || [])];

    const newLink: FooterLink = {
      label: '',
      url: '',
      pageId: null,
    };

    setSettings({
      ...settings,
      links: {
        ...settings.links,
        [category]: [...list, newLink],
      },
    });
  };

  const handleUpdateLink = (
    category: LinkCategory,
    index: number,
    field: keyof FooterLink,
    value: any
  ) => {
    if (!settings) return;
    const list = [...(settings.links[category] || [])];
    const updatedLink = { ...list[index], [field]: value };

    // Auto-update URL if pageId changes
    if (field === 'pageId') {
      const page = registryPages.find(p => p.id === value);
      if (page) {
        updatedLink.url = page.routePath;
      } else {
        updatedLink.url = '#';
        updatedLink.pageId = null;
      }
    }

    list[index] = updatedLink;

    setSettings({
      ...settings,
      links: {
        ...settings.links,
        [category]: list,
      },
    });
  };

  const handleRemoveLink = async (category: LinkCategory, index: number) => {
    if (!settings) return;
    const list = (settings.links[category] || []).filter((_, i) => i !== index);
    const updated = {
      ...settings,
      links: {
        ...settings.links,
        [category]: list,
      },
    };
    setSettings(updated);
    await saveToDb(updated);
  };

  const handleMoveLink = (
    category: LinkCategory,
    index: number,
    direction: 'up' | 'down'
  ) => {
    if (!settings) return;
    const list = [...(settings.links[category] || [])];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;

    if (targetIndex < 0 || targetIndex >= list.length) return;

    // Swap elements
    const temp = list[index];
    list[index] = list[targetIndex];
    list[targetIndex] = temp;

    setSettings({
      ...settings,
      links: {
        ...settings.links,
        [category]: list,
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}>
          <RotateCcw className="w-10 h-10 text-[#4B2A63] opacity-20" />
        </motion.div>
        <p className="mt-4 text-slate-400 font-bold uppercase tracking-widest text-[11px]">Loading Footer CMS...</p>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="space-y-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Footer CMS Manager</h1>
          <p className="text-slate-500 font-medium">Manage company footer columns, branding, and region flags.</p>
        </div>
        <div>
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-full px-10 h-12 font-bold shadow-lg shadow-[#4B2A63]/20 active:scale-95 cursor-pointer gap-2"
          >
            {isSaving ? 'Saving...' : 'Save Settings'}
            <Save className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab('branding')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'branding' ? 'text-[#4B2A63]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          Branding & Socials
          {activeTab === 'branding' && (
            <motion.div layoutId="footerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4B2A63]" />
          )}
        </button>
        <button
          onClick={() => setActiveTab('links')}
          className={`pb-4 text-sm font-bold transition-all relative ${activeTab === 'links' ? 'text-[#4B2A63]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          Column Links
          {activeTab === 'links' && (
            <motion.div layoutId="footerTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4B2A63]" />
          )}
        </button>
      </div>

      {activeTab === 'branding' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo & Description Card */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
              <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Settings2 className="w-5 h-5 text-purple-500" /> General Info
              </h3>

              <div className="space-y-6">
                {/* Logo Uploader */}
                <div className="space-y-2">
                  <label className="admin-label">
                    Footer Logo
                  </label>
                  <div className="flex flex-col sm:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-[180px] h-[60px] bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center p-2">
                      {settings.logoUrl ? (
                        <img src={settings.logoUrl} alt="Footer Logo Preview" className="max-w-full max-h-full object-contain" />
                      ) : (
                        <span className="text-xs text-slate-400 font-bold">No logo set</span>
                      )}
                    </div>
                    <div className="flex-1 w-full space-y-2">
                      <input
                        type="text"
                        value={settings.logoUrl}
                        onChange={(e) => updateField('logoUrl', e.target.value)}
                        placeholder="/footer-logo.png"
                        className="admin-input"
                      />
                      <div className="flex gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleUploadLogo}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isUploading}
                          onClick={() => fileInputRef.current?.click()}
                          className="rounded-lg text-xs font-semibold cursor-pointer"
                        >
                          <Upload className="w-3.5 h-3.5 mr-1.5" />
                          {isUploading ? 'Uploading...' : 'Upload Image'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="admin-label">
                    Branding Description
                  </label>
                  <textarea
                    rows={4}
                    value={settings.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Enter brand description..."
                    className="admin-input min-h-[100px] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Countries Section */}
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2 mb-0">
                  <Globe className="w-5 h-5 text-purple-500" /> Active Regions / Countries
                </h3>
                <Button
                  type="button"
                  onClick={addCountry}
                  size="sm"
                  className="bg-[#4B2A63] hover:bg-[#3b204e] text-white flex items-center gap-1.5 rounded-full px-4"
                >
                  <Plus className="w-4 h-4" /> Add Country
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.countries.map((country, idx) => (
                  <div key={idx} className="space-y-2 relative">
                    <div className="flex justify-between items-center pr-1">
                      <label className="admin-label">
                        Region / Country {idx + 1}
                      </label>
                      {settings.countries.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeCountry(idx)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Delete country"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={country || ''}
                      onChange={(e) => updateCountry(idx, e.target.value)}
                      placeholder={`e.g. India`}
                      className="admin-input font-bold"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Social Media Links Card */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)] h-full">
              <h3 className="font-bold text-lg text-slate-900 mb-6 flex items-center gap-2">
                <Share2 className="w-5 h-5 text-purple-500" /> Social Links
              </h3>

              <div className="space-y-6">
                {(['twitter', 'linkedin', 'facebook', 'youtube', 'instagram'] as const).map((platform) => {
                  const platformLabels: Record<string, string> = {
                    twitter: 'X (formerly Twitter)',
                    linkedin: 'LinkedIn',
                    facebook: 'Facebook',
                    youtube: 'YouTube',
                    instagram: 'Instagram'
                  };
                  const platformPlaceholders: Record<string, string> = {
                    twitter: 'https://x.com/username',
                    linkedin: 'https://linkedin.com/company/name',
                    facebook: 'https://facebook.com/page',
                    youtube: 'https://youtube.com/c/channel',
                    instagram: 'https://instagram.com/username'
                  };

                  const socialData = settings.links?.social?.[platform] || { url: '', enabled: false };

                  return (
                    <div key={platform} className="space-y-2 border-b border-slate-50 pb-4 last:border-0 last:pb-0">
                      <div className="flex items-center justify-between">
                        <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                          {platformLabels[platform]}
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={socialData.enabled}
                            onChange={(e) => updateSocialLink(platform, 'enabled', e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#4B2A63]"></div>
                          <span className="ml-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                            {socialData.enabled ? 'Enabled' : 'Disabled'}
                          </span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={socialData.url}
                        onChange={(e) => updateSocialLink(platform, 'url', e.target.value)}
                        placeholder={platformPlaceholders[platform]}
                        className="w-full bg-slate-50 border border-slate-200 focus:border-[#4B2A63]/30 focus:outline-none rounded-xl px-4 py-3 text-[14px] font-medium"
                      />
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'links' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-2">
            {(['company', 'products', 'industries', 'services'] as LinkCategory[]).map((colName) => (
              <div
                key={colName}
                className="bg-white rounded-[32px] p-8 border border-slate-100 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.03)]"
              >
                <div className="flex justify-between items-center mb-6 border-b border-slate-50 pb-4">
                  <h3 className="font-bold text-lg text-slate-900 capitalize flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-purple-500" /> {colName} links
                  </h3>
                  <Button
                    size="sm"
                    onClick={() => handleAddLink(colName)}
                    className="rounded-full bg-slate-100 hover:bg-slate-200 text-[#4B2A63] border-none font-bold text-xs"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Link
                  </Button>
                </div>

                {settings.links[colName].length === 0 ? (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium text-sm">No links assigned to this column.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {settings.links[colName].map((link, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col md:flex-row gap-4 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100"
                      >
                        {/* Link Label Input */}
                        <div className="flex-1 w-full space-y-1">
                          <label className="admin-label">
                            Link Label
                          </label>
                          <input
                            type="text"
                            value={link.label}
                            onChange={(e) => handleUpdateLink(colName, idx, 'label', e.target.value)}
                            placeholder="Link Title"
                            className="admin-input font-bold"
                          />
                        </div>

                        {/* Page selector */}
                        <div className="flex-1 w-full space-y-1">
                          <label className="admin-label">
                            Assigned Page
                          </label>
                          <SearchablePageSelect
                            value={link.pageId}
                            onChange={(pageId) => handleUpdateLink(colName, idx, 'pageId', pageId)}
                            pages={registryPages}
                          />
                        </div>

                        {/* Link Order Actions */}
                        <div className="flex items-center gap-1.5 justify-end w-full md:w-auto mt-2 md:mt-4 shrink-0">
                          <button
                            onClick={() => handleMoveLink(colName, idx, 'up')}
                            disabled={idx === 0}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white"
                          >
                            <ArrowUp className="w-4 h-4 text-slate-500" />
                          </button>
                          <button
                            onClick={() => handleMoveLink(colName, idx, 'down')}
                            disabled={idx === settings.links[colName].length - 1}
                            className="w-8 h-8 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 flex items-center justify-center disabled:opacity-30 disabled:hover:bg-white"
                          >
                            <ArrowDown className="w-4 h-4 text-slate-500" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const targetLink = settings.links[colName][idx];
                              setDeleteModal({
                                isOpen: true,
                                category: colName,
                                index: idx,
                                label: targetLink.label || `item ${idx + 1}`,
                              });
                            }}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center border border-red-100 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteModal.isOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteModal({ isOpen: false, category: null, index: null, label: '' })}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="relative bg-white rounded-[32px] p-8 max-w-sm w-full border border-slate-100 shadow-2xl flex flex-col items-center text-center space-y-6 z-10"
            >
              <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-slate-900">Delete Link?</h3>
                <p className="text-sm text-slate-500 font-medium leading-relaxed">
                  Are you sure you want to delete <strong className="text-slate-900">"{deleteModal.label}"</strong> from the <strong className="text-slate-900 capitalize">{deleteModal.category}</strong> column?
                </p>
              </div>

              <div className="flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={() => setDeleteModal({ isOpen: false, category: null, index: null, label: '' })}
                  className="flex-1 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-500 font-bold h-11"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (deleteModal.category && deleteModal.index !== null) {
                      handleRemoveLink(deleteModal.category, deleteModal.index);
                      setDeleteModal({ isOpen: false, category: null, index: null, label: '' });
                    }
                  }}
                  className="flex-1 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-bold h-11 border-none shadow-lg shadow-rose-500/20 active:scale-95"
                >
                  Delete
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
