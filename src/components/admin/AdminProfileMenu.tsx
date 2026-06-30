'use client';

import React, { useState, useEffect } from 'react';
import { Settings, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MediaField } from '@/components/admin/page-editor/MediaField';

export function AdminProfileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    role: 'Super Administrator',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Admin'
  });

  const [editForm, setEditForm] = useState(profile);

  useEffect(() => {
    const saved = localStorage.getItem('admin-profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setProfile(parsed);
        setEditForm(parsed);
      } catch (e) {
        // ignore
      }
    }
  }, []);

  const handleSave = () => {
    setProfile(editForm);
    localStorage.setItem('admin-profile', JSON.stringify(editForm));
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div 
        className="flex items-center gap-3 pl-2 cursor-pointer group"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-slate-900 leading-none group-hover:text-purple-600 transition-colors">
            {profile.name}
          </p>
          <p className="text-[11px] font-medium text-slate-400 mt-1">{profile.role}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden border-2 border-slate-50 group-hover:border-purple-200 transition-colors relative">
          <img src={profile.avatar} alt="Avatar" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <Settings className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-[60]" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -10 }}
              className="absolute top-full right-0 mt-4 bg-white rounded-3xl w-[380px] overflow-hidden shadow-2xl border border-slate-100 z-[70] origin-top-right"
            >
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-purple-600" />
                  Edit Profile
                </h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Full Name</label>
                  <input
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Role</label>
                  <input
                    value={editForm.role}
                    onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-100 rounded-xl px-4 py-2.5 text-sm font-medium focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-slate-500">Profile Icon</label>
                  <MediaField
                    fieldKey="profile-avatar"
                    value={editForm.avatar}
                    onChange={(val) => setEditForm({ ...editForm, avatar: val })}
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2">
                <Button variant="ghost" onClick={() => setIsOpen(false)} className="rounded-xl">
                  Cancel
                </Button>
                <Button onClick={handleSave} className="bg-[#4B2A63] hover:bg-[#3B198F] text-white rounded-xl">
                  Save Changes
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div >
  );
}
