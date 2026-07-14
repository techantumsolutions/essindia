'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Briefcase, MessageSquare, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

type Lead = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

type App = {
  id: string;
  fullName: string;
  email: string;
  createdAt: string;
};

export function AdminNotificationMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch('/api/admin/notifications');
        if (res.ok) {
          const data = await res.json();
          setLeads(data.leads || []);
          setApps(data.apps || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // refresh every minute
    return () => clearInterval(interval);
  }, []);

  const totalUnread = leads.length + apps.length;

  const handleClear = async () => {
    try {
      await fetch('/api/admin/notifications', { method: 'DELETE' });
      setLeads([]);
      setApps([]);
    } catch {
      // ignore
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative cursor-pointer"
      >
        <Bell className="w-5 h-5 text-slate-600" />
        {totalUnread > 0 && (
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
        )}
      </button>

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
                  <Bell className="w-5 h-5 text-purple-600" />
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {totalUnread > 0 && (
                    <button
                      onClick={handleClear}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-500 transition-colors px-2 cursor-pointer"
                    >
                      Clear All
                    </button>
                  )}
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 rounded-full hover:bg-slate-200 text-slate-400 transition-colors cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="max-h-[60vh] overflow-y-auto">
                {loading ? (
                  <p className="text-center text-sm text-slate-400 py-8">Loading...</p>
                ) : totalUnread === 0 ? (
                  <div className="text-center py-12 px-6">
                    <div className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mx-auto mb-3">
                      <Bell className="w-5 h-5 text-slate-300" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">All caught up!</p>
                    <p className="text-xs text-slate-400 mt-1">You have no new notifications.</p>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {leads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/admin/forms');
                        }}
                        className="px-4 py-2 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                          <MessageSquare className="w-3 h-3 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">New Contact Lead</p>
                          {/* <p className="text-xs text-slate-500 mt-0.5">{lead.name} ({lead.email}) submitted a new inquiry.</p> */}
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(lead.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}

                    {apps.map(app => (
                      <div
                        key={app.id}
                        onClick={() => {
                          setIsOpen(false);
                          router.push('/admin/careers');
                        }}
                        className="p-4 hover:bg-slate-50 transition-colors cursor-pointer flex gap-3"
                      >
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
                          <Briefcase className="w-3 h-3 text-emerald-500" />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 leading-tight">New Job Application</p>
                          {/* <p className="text-xs text-slate-500 mt-0.5">{app.fullName} applied for a position.</p> */}
                          <p className="text-[10px] text-slate-400 mt-1">{new Date(app.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
