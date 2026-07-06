'use client';

import React from 'react';
import { motion } from 'framer-motion';
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

export default function FormsAdminPage() {
  const [submissions, setSubmissions] = React.useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [selectedSub, setSelectedSub] = React.useState<FormSubmission | null>(null);
  
  // Filter State
  const [dateFilter, setDateFilter] = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  
  // Pagination State
  const [currentPage, setCurrentPage] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<'contact'|'cta'>('contact');
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
      
      if (dateFilter) {
        const subDate = new Date(sub.createdAt).toISOString().split('T')[0];
        dateMatch = subDate === dateFilter;
      }
      
      if (countryFilter) {
        countryMatch = sub.country === countryFilter;
      }
      
      return dateMatch && countryMatch;
    });
  }, [submissions, dateFilter, countryFilter, activeTab]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [dateFilter, countryFilter, activeTab]);

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
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Leads</h1>
          <p className="text-slate-500 font-medium">View and manage inquiries from the Contact Us page.</p>
        </div>
        <Button 
          onClick={exportToCSV} 
          disabled={filteredSubmissions.length === 0 || isLoading}
          className="bg-[#4B2A63] text-white hover:bg-[#3A1F4D]"
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      
      <div className="flex gap-4 border-b border-slate-200 mb-6">
        <button 
          onClick={() => setActiveTab('contact')} 
          className={`cursor-pointer pb-3 px-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'contact' ? 'border-[#4B2A63] text-[#4B2A63]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Contact Leads
        </button>
        <button 
          onClick={() => setActiveTab('cta')} 
          className={`cursor-pointer pb-3 px-2 font-semibold text-sm transition-colors border-b-2 ${activeTab === 'cta' ? 'border-[#4B2A63] text-[#4B2A63]' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
        >
          Page Leads
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4
 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm items-end">
        <div className="flex flex-col flex-1 w-full">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 tracking-wider">Filter by Date</label>
          <input 
            type="date" 
            value={dateFilter} 
            onChange={(e) => setDateFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/20 transition-all cursor-pointer"
          />
        </div>
        <div className="flex flex-col flex-1 w-full">
          <label className="text-xs font-semibold text-slate-500 uppercase mb-2 tracking-wider">Filter by Country</label>
          <select 
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#4B2A63]/20 transition-all cursor-pointer"
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
             onClick={() => { setDateFilter(''); setCountryFilter(''); }}
             className="text-slate-500 hover:text-slate-900 rounded-xl h-[42px] px-6"
             disabled={!dateFilter && !countryFilter}
           >
             Clear Filters
           </Button>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col">
        {isLoading ? (
          <div className="flex justify-center p-12">
            <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
          </div>
        ) : submissions.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            No submissions found yet.
          </div>
        ) : (
          <>
            <div className="overflow-visible flex-1">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-500 font-medium border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 whitespace-nowrap rounded-tl-3xl">Date</th>
                    <th className="px-6 py-4 whitespace-nowrap">Name</th>
                    <th className="px-6 py-4 whitespace-nowrap">Mail</th>
                    <th className="px-6 py-4 whitespace-nowrap">Contact</th>
                    {activeTab === 'contact' && <th className="px-6 py-4 whitespace-nowrap">Company</th>}
                    <th className="px-6 py-4 whitespace-nowrap">Country</th>
                    {activeTab === 'contact' ? (
                      <th className="px-6 py-4 whitespace-nowrap w-1/3">Message</th>
                    ) : (
                      <>
                        <th className="px-6 py-4 whitespace-nowrap">Page Name</th>
                        <th className="px-6 py-4 whitespace-nowrap">PDF URL</th>
                      </>
                    )}
                    <th className="px-6 py-4 whitespace-nowrap text-right rounded-tr-3xl">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {currentItems.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                        {sub.name}
                      </td>
                      <td className="px-6 py-4">
                        <a href={`mailto:${sub.email}`} className="text-[#4B2A63] hover:underline flex items-center gap-1.5 whitespace-nowrap">
                          <Mail className="w-3.5 h-3.5" />
                          {sub.email}
                        </a>
                      </td>
                      <td className="px-6 py-4 text-slate-500 whitespace-nowrap">
                        {sub.phone || '-'}
                      </td>
                      {activeTab === 'contact' && (
                        <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                          {sub.company || '-'}
                        </td>
                      )}
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                        {sub.country || '-'}
                      </td>
                      {activeTab === 'contact' ? (
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
                      ) : (
                        <>
                          <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                            {formatPageName(sub.pageName)}
                          </td>
                          <td className="px-6 py-4">
                            {sub.pdfUrl ? (
                              <a href={sub.pdfUrl} target="_blank" rel="noreferrer" className="text-[#4B2A63] hover:underline whitespace-nowrap">
                                View PDF
                              </a>
                            ) : '-'}
                          </td>
                        </>
                      )}
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`mailto:${sub.email}?subject=Reply from ESS India&body=Hi ${sub.name},%0D%0A%0D%0ARegarding your message:%0D%0A"${sub.message}"%0D%0A%0D%0A`}
                            className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#4B2A63] hover:text-white transition-colors"
                            title="Reply"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                          <button
                            onClick={() => setSelectedSub(sub)}
                            className="p-2 bg-slate-100 text-slate-500 rounded-lg hover:bg-[#4B2A63] hover:text-white transition-colors cursor-pointer"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="border-t border-slate-200 px-6 py-4 flex items-center justify-between">
                <p className="text-sm text-slate-500">
                  Showing <span className="font-medium text-slate-900">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium text-slate-900">{Math.min(currentPage * itemsPerPage, filteredSubmissions.length)}</span> of <span className="font-medium text-slate-900">{filteredSubmissions.length}</span> results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 rounded-lg"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <span className="text-sm font-medium text-slate-700 px-2">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 rounded-lg"
                  >
                    <ChevronRight className="w-4 h-4" />
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
