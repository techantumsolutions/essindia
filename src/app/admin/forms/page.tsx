'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, Mail, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';

interface FormSubmission {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  company: string | null;
  country: string | null;
  message: string | null;
  status: string;
  createdAt: string;
}

export default function FormsAdminPage() {
  const [submissions, setSubmissions] = React.useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchSubmissions() {
      try {
        const res = await fetch('/api/admin/forms');
        if (!res.ok) throw new Error('Failed to load');
        const data = await res.json();
        setSubmissions(data);
      } catch (e) {
        toast.error('Failed to load submissions');
      } finally {
        setIsLoading(false);
      }
    }
    fetchSubmissions();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Leads</h1>
          <p className="text-slate-500 font-medium">View and manage inquiries from the Contact Us page.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No submissions found yet.
          </div>
        ) : (
          <div className="overflow-x-visible">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 whitespace-nowrap rounded-tl-3xl">Date</th>
                  <th className="px-6 py-4 whitespace-nowrap">Name</th>
                  <th className="px-6 py-4 whitespace-nowrap">Contact Info</th>
                  <th className="px-6 py-4 whitespace-nowrap">Company & Country</th>
                  <th className="px-6 py-4 whitespace-nowrap w-1/3">Message</th>
                  <th className="px-6 py-4 whitespace-nowrap text-right rounded-tr-3xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {submissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {sub.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <a href={`mailto:${sub.email}`} className="text-[#4B2A63] hover:underline flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5" />
                          {sub.email}
                        </a>
                        {sub.phone && <span className="text-slate-500 text-xs whitespace-nowrap">{sub.phone}</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      <div className="flex flex-col">
                        <span>{sub.company || '-'}</span>
                        <span className="text-xs text-slate-400">{sub.country || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative group cursor-pointer">
                        <p className="text-slate-600 line-clamp-2 text-xs leading-relaxed max-w-[250px]">
                          {sub.message || '-'}
                        </p>
                        {sub.message && sub.message.length > 50 && (
                          <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-[400px] max-w-[90vw] p-4 bg-slate-900 text-white text-xs rounded-xl shadow-2xl z-[999] whitespace-normal break-words">
                            <div className="absolute bottom-full right-8 -mb-1 border-4 border-transparent border-b-slate-900"></div>
                            {sub.message}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <a
                        href={`mailto:${sub.email}?subject=Reply from ESS India&body=Hi ${sub.name},%0D%0A%0D%0ARegarding your message:%0D%0A"${sub.message}"%0D%0A%0D%0A`}
                        className="inline-flex whitespace-nowrap items-center gap-1.5 px-3 py-1.5 bg-[#4B2A63]/10 text-[#4B2A63] font-medium rounded-lg hover:bg-[#4B2A63]/20 transition-colors"
                      >
                        Send Mail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </motion.div>
  );
}
