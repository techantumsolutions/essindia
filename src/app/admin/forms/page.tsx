'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Loader2, Mail, Eye, X, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
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
  formType: string;
  pageName: string | null;
  pdfUrl: string | null;
  createdAt: string;
}
const formatPageName = (path: string | null) => {
  if (!path) return '-';
  if (!path.startsWith('/')) return path;
  const parts = path.split('/').filter(Boolean);
  const lastPart = parts[parts.length - 1] || path;
  return lastPart.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};

function FormsAdminInner() {
  const [submissions, setSubmissions] = React.useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSub, setSelectedSub] = React.useState<FormSubmission | null>(null);
  
  // Filter State
  const [fromDateFilter, setFromDateFilter] = React.useState('');
  const [toDateFilter, setToDateFilter] = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  
  // Pagination State
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'contact'|'cta'>(() => {
    const t = searchParams?.get('tab');
    return (t === 'cta' ? 'cta' : 'contact') as 'contact' | 'cta';
  });
  const itemsPerPage = 10;

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

  const uniqueCountries = React.useMemo(() => {
    const countries = new Set(submissions.map(s => s.country).filter(Boolean));
    return Array.from(countries) as string[];
  }, [submissions]);

  const filteredSubmissions = React.useMemo(() => {
    return submissions.filter(sub => {
      const type = sub.formType || 'contact';
      
      // Filter by tab
      if (activeTab === 'contact' && type !== 'contact') return false;
      if (activeTab === 'cta' && type !== 'cta') return false;
      
      let dateMatch = true;
      let countryMatch = true;
      
      const subDate = new Date(sub.createdAt).toISOString().split('T')[0];
      
      if (fromDateFilter) {
        dateMatch = dateMatch && (subDate >= fromDateFilter);
      }
      
      if (toDateFilter) {
        dateMatch = dateMatch && (subDate <= toDateFilter);
      }
      
      if (countryFilter) {
        countryMatch = sub.country === countryFilter;
      }
      
      return dateMatch && countryMatch;
    });
  }, [submissions, fromDateFilter, toDateFilter, countryFilter, activeTab]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [fromDateFilter, toDateFilter, countryFilter, activeTab]);

  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage);
  const currentItems = filteredSubmissions.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const exportToCSV = () => {
    if (filteredSubmissions.length === 0) return;
    
    const isContact = activeTab === 'contact';
    const headers = isContact 
      ? ['Date', 'Name', 'Email', 'Phone', 'Company', 'Country', 'Message']
      : ['Date', 'Name', 'Email', 'Phone', 'Country', 'Page Name', 'PDF URL'];
      
    const rows = filteredSubmissions.map(sub => [
      `"${new Date(sub.createdAt).toLocaleString().replace(/"/g, '""')}"`,
      `"${(sub.name || '').replace(/"/g, '""')}"`,
      `"${(sub.email || '').replace(/"/g, '""')}"`,
      `"${(sub.phone || '').replace(/"/g, '""')}"`,
      ...(isContact ? [`"${(sub.company || '').replace(/"/g, '""')}"`] : []),
      `"${(sub.country || '').replace(/"/g, '""')}"`,
      ...(isContact 
        ? [`"${(sub.message || '').replace(/"/g, '""').replace(/\n|\r/g, ' ')}"`]
        : [`"${(sub.pageName || '').replace(/"/g, '""')}"`, `"${(sub.pdfUrl || '').replace(/"/g, '""')}"`])
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${isContact ? 'contact' : 'page'}_leads_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success('Exported to CSV');
  };

  return (
    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="space-y-4 max-w-7xl w-full">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Leads</h1>
          <p className="text-slate-500">View and manage inquiries from the Contact Us page.</p>
        </div>
        <Button size="sm" onClick={exportToCSV} disabled={filteredSubmissions.length === 0 || isLoading}>
          <Download />
          Export CSV
        </Button>
      </div>


      <div className="flex gap-3 border-b border-slate-200">
        <button
          onClick={() => setActiveTab('contact')}
          className={`cursor-pointer pb-2 px-1.5 font-semibold text-xs transition-colors border-b-2 ${activeTab === 'contact' ? 'border-[#4B2A63] text-[#4B2A63]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Contact Leads
        </button>
        <button
          onClick={() => setActiveTab('cta')}
          className={`cursor-pointer pb-2 px-1.5 font-semibold text-xs transition-colors border-b-2 ${activeTab === 'cta' ? 'border-[#4B2A63] text-[#4B2A63]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Page Leads
        </button>
      </div>

      <div className="admin-compact-card flex flex-col md:flex-row gap-2.5 p-3 items-end">
        <div className="flex flex-col flex-1 w-full">
          <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1 tracking-[0.06em]">From Date</label>
          <input
            type="date"
            value={fromDateFilter}
            onChange={(e) => setFromDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-[#4B2A63]/40 transition-colors cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1 w-full">
          <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1 tracking-[0.06em]">To Date</label>
          <input
            type="date"
            value={toDateFilter}
            onChange={(e) => setToDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-[#4B2A63]/40 transition-colors cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1 w-full">
          <label className="text-[10px] font-semibold text-slate-500 uppercase mb-1 tracking-[0.06em]">Filter by Country</label>
          <select
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1.5 text-xs outline-none focus:border-[#4B2A63]/40 transition-colors cursor-pointer"
          >
            <option value="">All Countries</option>
            {uniqueCountries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div>
           <Button
             variant="ghost"
             size="sm"
             onClick={() => { setFromDateFilter(''); setToDateFilter(''); setCountryFilter(''); }}
             disabled={!fromDateFilter && !toDateFilter && !countryFilter}
           >
             Clear filters
           </Button>
        </div>
      </div>

      <div className="admin-compact-card flex flex-col overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            No submissions found yet.
          </div>
        ) : (
          <>
            <div className="w-full overflow-x-auto flex-1">
              <table className="w-full text-left text-sm">
                 <thead className="bg-slate-50/60 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-3 whitespace-nowrap">Date</th>
                    <th className="px-3 whitespace-nowrap">Name</th>
                    <th className="px-3 whitespace-nowrap">Mail</th>
                    <th className="px-3 whitespace-nowrap">Contact</th>
                    {activeTab === 'contact' && <th className="px-3 whitespace-nowrap">Company</th>}
                    <th className="px-3 whitespace-nowrap">Country</th>
                    {activeTab === 'contact' ? (
                      <th className="px-3 whitespace-nowrap w-1/3">Message</th>
                    ) : (
                      <>
                        <th className="px-3 whitespace-nowrap">Page Name</th>
                        <th className="px-3 whitespace-nowrap">PDF URL</th>
                      </>
                    )}
                    <th className="px-3 whitespace-nowrap text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItems.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-3 whitespace-nowrap text-[11px] text-slate-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 text-xs font-medium text-slate-900 whitespace-nowrap">
                        {sub.name}
                      </td>
                      <td className="px-3">
                        <a href={`mailto:${sub.email}`} className="text-[#4B2A63] text-[11px] hover:underline flex items-center gap-1 whitespace-nowrap">
                          <Mail className="w-3 h-3" />
                          {sub.email}
                        </a>
                      </td>
                      <td className="px-3 text-[11px] text-slate-500 whitespace-nowrap">
                        {sub.phone || '-'}
                      </td>
                      {activeTab === 'contact' && (
                        <td className="px-3 text-[11px] text-slate-600 whitespace-nowrap">
                          {sub.company || '-'}
                        </td>
                      )}
                      <td className="px-3 text-[11px] text-slate-600 whitespace-nowrap">
                        {sub.country || '-'}
                      </td>
                      {activeTab === 'contact' ? (
                        <td className="px-3">
                          <div className="relative group cursor-pointer">
                            <p className="text-slate-600 line-clamp-2 text-[11px] leading-relaxed max-w-[250px]">
                              {sub.message || '-'}
                            </p>
                            {sub.message && sub.message.length > 50 && (
                              <div className="absolute right-0 top-full mt-2 hidden group-hover:block w-[400px] max-w-[90vw] p-3 bg-slate-900 text-white text-xs rounded-lg shadow-2xl z-[999] whitespace-normal break-words">
                                <div className="absolute bottom-full right-8 -mb-1 border-4 border-transparent border-b-slate-900"></div>
                                {sub.message}
                              </div>
                            )}
                          </div>
                        </td>
                      ) : (
                        <>
                          <td className="px-3 text-[11px] text-slate-600 whitespace-nowrap">
                            {formatPageName(sub.pageName)}
                          </td>
                          <td className="px-3">
                            {sub.pdfUrl ? (
                              <a href={sub.pdfUrl} target="_blank" rel="noreferrer" className="text-[#4B2A63] text-[11px] hover:underline whitespace-nowrap">
                                View PDF
                              </a>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <a
                            href={`mailto:${sub.email}?subject=Reply from ESS India&body=Hi ${sub.name},%0D%0A%0D%0ARegarding your message:%0D%0A"${sub.message}"%0D%0A%0D%0A`}
                            className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-[#4B2A63] hover:text-white transition-colors"
                            title="Reply"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </a>
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="p-1.5 bg-slate-100 text-slate-500 rounded-md hover:bg-[#4B2A63] hover:text-white transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            {filteredSubmissions.length > 0 && (
              <div className="border-t border-slate-200 px-4 py-2.5 flex items-center justify-between">
                <p className="text-[11px] text-slate-500">
                  Showing <span className="font-medium text-slate-900">{filteredSubmissions.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredSubmissions.length)}</span> of <span className="font-medium text-slate-900">{filteredSubmissions.length}</span> results
                </p>
                <div className="flex items-center gap-1.5">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft /> Previous
                  </Button>
                  <span className="text-[11px] font-semibold text-slate-700 px-1.5">
                    Page {currentPage} of {totalPages || 1}
                  </span>
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages || totalPages === 0}
                  >
                    Next <ChevronRight />
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <Dialog open={!!selectedSub} onOpenChange={(open) => !open && setSelectedSub(null)}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Lead Details</DialogTitle>
          </DialogHeader>
          {selectedSub && (
            <div className="space-y-6 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Type</p>
                  <p className="font-medium text-slate-900 uppercase">{(selectedSub.formType || 'contact')}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Name</p>
                  <p className="font-medium text-slate-900">{selectedSub.name}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Date</p>
                  <p className="font-medium text-slate-900">{new Date(selectedSub.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Email</p>
                  <a href={`mailto:${selectedSub.email}`} className="font-medium text-[#4B2A63] hover:underline">
                    {selectedSub.email}
                  </a>
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Phone</p>
                  <p className="font-medium text-slate-900">{selectedSub.phone || 'N/A'}</p>
                </div>
                {(selectedSub.formType || 'contact') === 'contact' && (
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Company</p>
                    <p className="font-medium text-slate-900">{selectedSub.company || 'N/A'}</p>
                  </div>
                )}
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Country</p>
                  <p className="font-medium text-slate-900">{selectedSub.country || 'N/A'}</p>
                </div>
                {(selectedSub.formType || 'contact') === 'cta' && (
                  <>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Page Name</p>
                      <p className="font-medium text-slate-900">{formatPageName(selectedSub.pageName)}</p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">PDF URL</p>
                      {selectedSub.pdfUrl ? (
                        <a href={selectedSub.pdfUrl} target="_blank" rel="noreferrer" className="font-medium text-[#4B2A63] hover:underline">
                          View PDF
                        </a>
                      ) : (
                        <p className="font-medium text-slate-900">N/A</p>
                      )}
                    </div>
                  </>
                )}
              </div>
              {(selectedSub.formType || 'contact') === 'contact' && (
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Message</p>
                  <div className="bg-slate-50 p-4 rounded-xl text-slate-700 whitespace-pre-wrap border border-slate-100">
                    {selectedSub.message || 'No message provided.'}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

export default function FormsAdminPage() {
  return (
    <React.Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-slate-50/50">
        <Loader2 className="w-8 h-8 animate-spin text-[#4B2A63]" />
      </div>
    }>
      <FormsAdminInner />
    </React.Suspense>
  );
}
