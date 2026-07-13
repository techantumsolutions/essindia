'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit2,
  Briefcase,
  Users,
  MapPin,
  Clock,
  Eye,
  Download,
  Calendar,
  X,
  FileText,
  ExternalLink,
  ChevronDown,
  Building,
  CheckCircle,
  AlertCircle,
  Upload,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';

// Types matching schema
type JobOpening = {
  id: string;
  title: string;
  department: string;
  description: string;
  type: string;
  experience: string;
  location: string;
  locations?: string[];
  aboutText: string;
  requirements: string[];
  responsibilities: string[];
  niceToHave: string[];
  whatWeOffer: string[];
  status: 'active' | 'draft' | 'closed';
  createdAt: string;
  updatedAt: string;
  applicantCount?: number;
  jdUrl?: string | null;
  budgetRange?: string | null;
  hrEmails?: string[];
};

type Application = {
  id: string;
  careerId: string;
  fullName: string;
  email: string;
  phone: string;
  experience: string;
  currentCompany: string | null;
  noticePeriod: string;
  linkedInProfile: string | null;
  portfolioUrl: string | null;
  resumeUrl: string;
  coverLetter: string | null;
  status: 'applied' | 'reviewed' | 'shortlisted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  career?: {
    title: string;
    department: string;
  };
  jobTitle?: string;
  jobDepartment?: string;
};

const defaultJobForm = {
  title: '',
  department: '',
  description: '',
  type: 'Full-Time',
  experience: '',
  location: '',
  locations: [] as string[],
  aboutText: '',
  requirements: [] as string[],
  responsibilities: [] as string[],
  niceToHave: [] as string[],
  whatWeOffer: [] as string[],
  status: 'active' as 'active' | 'draft' | 'closed',
  jdUrl: '',
  budgetRange: '',
  hrEmails: [] as string[]
};

export default function AdminCareersPortal() {
  const [activeTab, setActiveTab] = React.useState<'jobs' | 'applications'>('jobs');
  const [jobs, setJobs] = React.useState<JobOpening[]>([]);
  const [applications, setApplications] = React.useState<Application[]>([]);
  const [isLoadingJobs, setIsLoadingJobs] = React.useState(true);
  const [isLoadingApps, setIsLoadingApps] = React.useState(true);

  // Job Modal State
  const [isJobModalOpen, setIsJobModalOpen] = React.useState(false);
  const [editingJobId, setEditingJobId] = React.useState<string | null>(null);
  const [jobForm, setJobForm] = React.useState(defaultJobForm);
  const [isParsing, setIsParsing] = React.useState(false);
  const [parsedFileName, setParsedFileName] = React.useState<string | null>(null);
  const [hrEmail, setHrEmail] = React.useState('hr@example.com');
  const [isSavingHrEmail, setIsSavingHrEmail] = React.useState(false);

  // List field entry states
  const [locInput, setLocInput] = React.useState('');
  const [reqInput, setReqInput] = React.useState('');
  const [respInput, setRespInput] = React.useState('');
  const [niceInput, setNiceInput] = React.useState('');
  const [offerInput, setOfferInput] = React.useState('');
  const [hrEmailInput, setHrEmailInput] = React.useState('');

  // Application Details Modal State
  const [selectedApp, setSelectedApp] = React.useState<Application | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [positionFilter, setPositionFilter] = React.useState<string>('all');

  const uniquePositions = React.useMemo(() => {
    const positions = new Set<string>();
    applications.forEach((app) => {
      if (app.jobTitle) positions.add(app.jobTitle);
    });
    return Array.from(positions);
  }, [applications]);

  const filteredApplications = React.useMemo(() => {
    return applications.filter((app) => {
      const matchStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchPosition = positionFilter === 'all' || app.jobTitle === positionFilter;
      return matchStatus && matchPosition;
    });
  }, [applications, statusFilter, positionFilter]);

  // Fetch functions
  const fetchJobs = React.useCallback(async () => {
    setIsLoadingJobs(true);
    try {
      const res = await fetch('/api/admin/careers');
      if (!res.ok) throw new Error('Failed to fetch jobs');
      const data = await res.json();
      setJobs(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load jobs');
    } finally {
      setIsLoadingJobs(false);
    }
  }, []);

  const fetchApplications = React.useCallback(async () => {
    setIsLoadingApps(true);
    try {
      const res = await fetch('/api/admin/applications');
      if (!res.ok) throw new Error('Failed to fetch applications');
      const data = await res.json();
      setApplications(data);
    } catch (err: any) {
      toast.error(err.message || 'Failed to load applications');
    } finally {
      setIsLoadingApps(false);
    }
  }, []);

  const fetchHrEmail = React.useCallback(async () => {
    try {
      const res = await fetch('/api/admin/careers/settings');
      if (!res.ok) throw new Error('Failed to fetch HR email');
      const data = await res.json();
      if (data?.hrEmail) {
        setHrEmail(data.hrEmail);
      }
    } catch (err: any) {
      console.error('Failed to load HR email setting:', err);
    }
  }, []);

  React.useEffect(() => {
    fetchJobs();
    fetchApplications();
    fetchHrEmail();
  }, [fetchJobs, fetchApplications, fetchHrEmail]);

  const handleSaveHrEmail = async () => {
    if (!hrEmail || !hrEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsSavingHrEmail(true);
    try {
      const res = await fetch('/api/admin/careers/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ hrEmail }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save HR email settings');
      }

      toast.success('HR department email updated successfully!');
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving email settings');
    } finally {
      setIsSavingHrEmail(false);
    }
  };

  // Action Handlers
  const handleOpenCreateJob = () => {
    setEditingJobId(null);
    setJobForm(defaultJobForm);
    setLocInput('');
    setReqInput('');
    setRespInput('');
    setNiceInput('');
    setOfferInput('');
    setParsedFileName(null);
    setIsJobModalOpen(true);
  };

  const downloadJDTemplate = () => {
    try {
      const htmlContent = `
        <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
        <head>
          <title>Job Description Template</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            h1 { color: #4B2A63; border-bottom: 2px solid #4B2A63; padding-bottom: 5px; }
            h2 { color: #4B2A63; margin-top: 20px; }
            .field { margin-bottom: 10px; }
            .label { font-weight: bold; color: #64748b; text-transform: uppercase; font-size: 11px; }
            .value { font-size: 14px; color: #1e293b; }
            ul { margin-top: 5px; margin-bottom: 5px; }
          </style>
        </head>
        <body>
          <h1>JOB DESCRIPTION TEMPLATE</h1>
          
          <div class="field"><span class="label">Job Title:</span> <span class="value">[e.g. Senior React Developer]</span></div>
          <div class="field"><span class="label">Department:</span> <span class="value">[e.g. Engineering]</span></div>
          <div class="field"><span class="label">Locations:</span> <span class="value">[e.g. Noida, Delhi NCR (comma-separated if multiple)]</span></div>
          <div class="field"><span class="label">Job Type:</span> <span class="value">[e.g. Full-Time, Part-Time, Contract]</span></div>
          <div class="field"><span class="label">Experience Level:</span> <span class="value">[e.g. 5+ Years]</span></div>
          <div class="field"><span class="label">Budget Range:</span> <span class="value">[e.g. 12L - 18L]</span></div>
          
          <h2>Short Card Description:</h2>
          <p>Provide a brief 1-2 sentence overview of the role to be shown on the search page card.</p>
          <p>Example: We are looking for a Senior React Developer to join our team and build next-gen enterprise UI.</p>
          
          <h2>Full "About the Role":</h2>
          <p>Provide a comprehensive description of the role, team environment, and project scope.</p>
          <p>Example: As a Senior Developer, you will collaborate with cross-functional teams to design and implement scalable web applications, mentor junior engineers, and champion coding best practices.</p>
          
          <h2>Role Requirements:</h2>
          <ul>
            <li>Requirement 1: Strong experience in React, TypeScript, and modern state management.</li>
            <li>Requirement 2: Solid understanding of REST APIs, Tailwind CSS, and web performance optimization.</li>
            <li>Requirement 3: Excellent communication and teamwork skills.</li>
          </ul>
          
          <h2>Key Responsibilities:</h2>
          <ul>
            <li>Responsibility 1: Develop clean, well-tested, and performant user interface components.</li>
            <li>Responsibility 2: Lead frontend architectural discussions and conduct code reviews.</li>
            <li>Responsibility 3: Collaborate with backend team members to integrate APIs.</li>
          </ul>
          
          <h2>Nice to Have (Optional):</h2>
          <ul>
            <li>Nice to Have 1: Familiarity with Next.js, Turbopack, or Docker containerization.</li>
            <li>Nice to Have 2: Contributions to open-source libraries.</li>
          </ul>
          
          <h2>What We Offer:</h2>
          <ul>
            <li>Offer 1: Competitive salary and comprehensive health benefits.</li>
            <li>Offer 2: Flexible work-from-home policy and learning allowances.</li>
            <li>Offer 3: Collaborative workspace with regular team building events.</li>
          </ul>
        </body>
        </html>
      `;

      const blob = new Blob(['\ufeff' + htmlContent], {
        type: 'application/msword'
      });
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Job_Description_Template.doc';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast.success('Job Description Word template downloaded successfully!');
    } catch (err) {
      console.error('Failed to generate Word template:', err);
      toast.error('Failed to download template. Please try again.');
    }
  };

  const handleOpenEditJob = (job: JobOpening) => {
    setEditingJobId(job.id);
    setJobForm({
      title: job.title,
      department: job.department,
      description: job.description,
      type: job.type,
      experience: job.experience,
      location: job.location,
      locations: job.location ? job.location.split(',').map(l => l.trim()).filter(Boolean) : [],
      aboutText: job.aboutText,
      requirements: job.requirements || [],
      responsibilities: job.responsibilities || [],
      niceToHave: job.niceToHave || [],
      whatWeOffer: job.whatWeOffer || [],
      status: job.status,
      jdUrl: job.jdUrl || '',
      budgetRange: job.budgetRange || '',
      hrEmails: job.hrEmails || []
    });
    setLocInput('');
    setReqInput('');
    setRespInput('');
    setNiceInput('');
    setOfferInput('');
    setHrEmailInput('');
    setParsedFileName(null);
    setIsJobModalOpen(true);
  };

  const handleJDUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const fileNameLower = file.name.toLowerCase();
    if (!fileNameLower.endsWith('.pdf') && !fileNameLower.endsWith('.docx')) {
      alert('Only PDF and Word (.docx) files are supported for Job Description parsing.');
      toast.error('Only PDF and Word (.docx) files are supported for Job Description parsing.');
      e.target.value = '';
      return;
    }

    setIsParsing(true);
    const formData = new FormData();
    formData.append('file', file);

    const parseToastId = toast.loading('Reading and parsing JD. Please wait...');

    try {
      const res = await fetch('/api/admin/careers/parse-jd', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to parse JD');
      }

      const parsedData = await res.json();

      if (parsedData.parsed === false) {
        setJobForm((prev) => ({
          ...prev,
          jdUrl: parsedData.jdUrl || '',
        }));
        setParsedFileName(file.name);
        toast.error('Due to some issue, unable to extract content. Please enter details manually.', { id: parseToastId });
        alert('Due to some issue, unable to extract content. Please enter details manually.');
        return;
      }
      
      setJobForm({
        title: parsedData.title || '',
        department: parsedData.department || '',
        description: parsedData.description || '',
        type: parsedData.type || 'Full-Time',
        experience: parsedData.experience || '',
        location: (parsedData.locations || []).join(', '),
        locations: parsedData.locations || [],
        aboutText: parsedData.aboutText || '',
        requirements: parsedData.requirements || [],
        responsibilities: parsedData.responsibilities || [],
        niceToHave: parsedData.niceToHave || [],
        whatWeOffer: parsedData.whatWeOffer || [],
        status: 'active',
        jdUrl: parsedData.jdUrl || '',
        budgetRange: parsedData.budgetRange || '',
        hrEmails: []
      });

      setParsedFileName(file.name);
      toast.success('JD successfully parsed! Form has been autofilled.', { id: parseToastId });
    } catch (err: any) {
      setParsedFileName(null);
      toast.error(err.message || 'An error occurred while parsing the JD', { id: parseToastId });
    } finally {
      setIsParsing(false);
      // Reset input value to allow the same file to be selected again
      e.target.value = '';
    }
  };

  const handleSaveJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.department || !jobForm.description || !jobForm.experience || (!jobForm.location && jobForm.locations?.length === 0) || !jobForm.aboutText) {
      toast.error('Please fill in all basic job fields');
      return;
    }

    const payload = { ...jobForm };
    if (payload.locations && payload.locations.length > 0) {
      payload.location = payload.locations.join(', ');
    }

    const isEditing = !!editingJobId;
    const url = isEditing ? `/api/admin/careers/${editingJobId}` : '/api/admin/careers';
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to save job opening');
      }

      toast.success(isEditing ? 'Job opening updated successfully!' : 'Job opening created successfully!');
      setIsJobModalOpen(false);
      fetchJobs();
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while saving the job opening');
    }
  };

  const handleDeleteJob = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete the opening for "${title}"? This will also delete all applications for this job.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/careers/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete job');
      toast.success('Job opening deleted successfully');
      fetchJobs();
      fetchApplications(); // refresh applications list since some might be cascaded deleted
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete job opening');
    }
  };

  const handleToggleStatus = async (id: string, currentStatus: 'active' | 'draft' | 'closed') => {
    const newStatus: 'active' | 'closed' = currentStatus === 'active' ? 'closed' : 'active';
    
    // Optimistic UI update
    setJobs(prev => prev.map(job => job.id === id ? { ...job, status: newStatus } : job));

    try {
      const res = await fetch(`/api/admin/careers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update status');
      }

      toast.success(newStatus === 'active' ? 'Job opening activated!' : 'Job opening deactivated!');
      fetchJobs();
    } catch (err: any) {
      // Revert optimistic update
      setJobs(prev => prev.map(job => job.id === id ? { ...job, status: currentStatus } : job));
      toast.error(err.message || 'Failed to toggle status');
    }
  };

  const handleUpdateAppStatus = async (appId: string, status: string) => {
    try {
      const res = await fetch(`/api/admin/applications/${appId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error('Failed to update status');
      
      toast.success(`Application status updated to ${status}`);
      // Update local state
      setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: status as any } : app));
      if (selectedApp?.id === appId) {
        setSelectedApp(prev => prev ? { ...prev, status: status as any } : null);
      }
    } catch (err: any) {
      toast.error(err.message || 'Failed to update application status');
    }
  };

  // List Items management
  const addListItem = (field: 'locations' | 'requirements' | 'responsibilities' | 'niceToHave' | 'whatWeOffer' | 'hrEmails', text: string, setter: (val: string) => void) => {
    if (!text.trim()) return;
    setJobForm(prev => ({
      ...prev,
      [field]: [...prev[field], text.trim()]
    }));
    setter('');
  };

  const removeListItem = (field: 'locations' | 'requirements' | 'responsibilities' | 'niceToHave' | 'whatWeOffer' | 'hrEmails', index: number) => {
    setJobForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, idx) => idx !== index)
    }));
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'active': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'draft': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'closed': return 'bg-rose-50 text-rose-700 border-rose-100';
      
      case 'applied': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'reviewed': return 'bg-indigo-50 text-indigo-700 border-indigo-100';
      case 'shortlisted': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'rejected': return 'bg-rose-50 text-rose-700 border-rose-100';
      
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="font-semibold text-slate-900">Careers Portal</h1>
          <p className="text-slate-500">
            Manage job postings and review submitted applications.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-md px-2.5 h-8">
            <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.06em] whitespace-nowrap">HR Email:</span>
            <input
              type="email"
              value={hrEmail}
              onChange={(e) => setHrEmail(e.target.value)}
              placeholder="hr@example.com"
              className="bg-transparent text-xs font-medium text-slate-700 focus:outline-none w-44 border-none p-0"
            />
            <Button size="xs" variant="outline" onClick={handleSaveHrEmail} disabled={isSavingHrEmail}>
              {isSavingHrEmail ? <Loader2 className="animate-spin" /> : 'Save'}
            </Button>
          </div>
          <Button size="sm" onClick={handleOpenCreateJob}>
            <Plus strokeWidth={3} />
            Post new job
          </Button>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200">
        <button
          onClick={() => setActiveTab('jobs')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'jobs'
              ? 'border-[#4B2A63] text-[#4B2A63]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Briefcase className="w-3.5 h-3.5" />
          Job Openings ({jobs.length})
        </button>
        <button
          onClick={() => setActiveTab('applications')}
          className={`px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 cursor-pointer ${
            activeTab === 'applications'
              ? 'border-[#4B2A63] text-[#4B2A63]'
              : 'border-transparent text-slate-400 hover:text-slate-600'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Applications ({applications.length})
        </button>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-[24px] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] overflow-hidden">
        {activeTab === 'jobs' ? (
          // JOB LIST TAB
          isLoadingJobs ? (
            <div className="p-16 text-center text-slate-400 font-medium">Loading openings list...</div>
          ) : jobs.length === 0 ? (
            <div className="p-16 text-center text-slate-400 font-medium">
              No job openings found. Click "Post New Job" to list your first vacancy.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="py-4 px-6">Job Details</th>
                    <th className="py-4 px-4">Department</th>
                    <th className="py-4 px-4">Location & Type</th>
                    <th className="py-4 px-4">Experience</th>
                    <th className="py-4 px-4 text-center">Applicants</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-4 px-6">
                        <div>
                          <p className="font-bold text-slate-900">{job.title}</p>
                          <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{job.description}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium bg-slate-100/70 px-2.5 py-1 rounded-full text-xs">
                          <Building className="w-3.5 h-3.5 text-slate-400" />
                          {job.department}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <div className="space-y-0.5">
                          <p className="text-slate-700 font-medium flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            {job.location}
                          </p>
                          <p className="text-xs text-slate-400 font-light pl-4.5">{job.type}</p>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-slate-600 font-medium flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          {job.experience}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className="inline-flex items-center justify-center font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 min-w-[32px]">
                          {job.applicantCount || 0}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-bold border ${getStatusBadgeClass(job.status)}`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <div className="flex justify-end items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(job.id, job.status)}
                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[#4B2A63] focus:ring-offset-2 ${
                              job.status === 'active' ? 'bg-emerald-500' : 'bg-slate-200'
                            }`}
                            title={job.status === 'active' ? 'Deactivate job posting' : 'Activate job posting'}
                          >
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                job.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                              }`}
                            />
                          </button>
                          <Button
                            variant="ghost"
                            size="icon"
                            title="Edit"
                            className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600"
                            onClick={() => handleOpenEditJob(job)}
                          >
                            <Edit2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          // CANDIDATE APPLICATIONS TAB
          isLoadingApps ? (
            <div className="p-16 text-center text-slate-400 font-medium">Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="p-16 text-center text-slate-400 font-medium">
              No candidate applications found yet.
            </div>
          ) : (
            <div className="flex flex-col">
              {/* Filter Bar */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/30 flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Status:</label>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#4B2A63] transition-colors cursor-pointer"
                    >
                      <option value="all">All Statuses</option>
                      <option value="applied">Applied</option>
                      <option value="reviewed">Reviewed</option>
                      <option value="shortlisted">Shortlisted</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Position:</label>
                    <select
                      value={positionFilter}
                      onChange={(e) => setPositionFilter(e.target.value)}
                      className="h-9 rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-700 outline-none focus:border-[#4B2A63] transition-colors cursor-pointer max-w-[240px] truncate"
                    >
                      <option value="all">All Positions</option>
                      {uniquePositions.map((pos) => (
                        <option key={pos} value={pos}>
                          {pos}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="text-xs font-bold text-slate-400">
                  Showing {filteredApplications.length} of {applications.length} applications
                </div>
              </div>

              {filteredApplications.length === 0 ? (
                <div className="p-16 text-center text-slate-400 font-medium bg-white">
                  No applications match your selected filters. Try resetting them.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        <th className="py-4 px-6">Applicant</th>
                        <th className="py-4 px-4">Position</th>
                        <th className="py-4 px-4">Experience & Notice</th>
                        <th className="py-4 px-4">CV / Resume</th>
                        <th className="py-4 px-4">Status</th>
                        <th className="py-4 px-4">Date Applied</th>
                        <th className="py-4 px-6 text-right">Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredApplications.map((app) => (
                        <tr key={app.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="py-4 px-6">
                            <div>
                              <p className="font-bold text-slate-900">{app.fullName}</p>
                              <p className="text-xs text-slate-400 mt-0.5">{app.email}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span className="text-slate-800 font-bold">
                              {app.jobTitle || 'Unknown Position'}
                            </span>
                            {app.jobDepartment && (
                              <p className="text-[11px] text-slate-400 font-medium mt-0.5">{app.jobDepartment}</p>
                            )}
                          </td>
                          <td className="py-4 px-4">
                            <div className="space-y-0.5">
                              <p className="text-slate-700 font-medium text-xs">Exp: {app.experience}</p>
                              <p className="text-[11px] text-slate-400">NP: {app.noticePeriod}</p>
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <a
                              href={app.resumeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs text-[#4B2A63] hover:text-[#3B198F] font-bold bg-[#4B2A63]/5 hover:bg-[#4B2A63]/10 px-2.5 py-1.5 rounded-lg border border-[#4B2A63]/10 transition-colors cursor-pointer"
                            >
                              <Download className="w-3.5 h-3.5" />
                              Resume
                            </a>
                          </td>
                          <td className="py-4 px-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                              className={`px-2.5 py-1 rounded-full text-xs font-bold border outline-none bg-white cursor-pointer ${getStatusBadgeClass(app.status)}`}
                            >
                              <option value="applied">Applied</option>
                              <option value="reviewed">Reviewed</option>
                              <option value="shortlisted">Shortlisted</option>
                              <option value="rejected">Rejected</option>
                            </select>
                          </td>
                          <td className="py-4 px-4 text-slate-500 font-medium text-xs">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5 text-slate-400" />
                              {new Date(app.createdAt).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              title="View Details"
                              className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-600"
                              onClick={() => setSelectedApp(app)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )
        )}
      </div>

      {/* ----------------- JOB POST/EDIT MODAL (Slide-over/Full-width side panel look) ----------------- */}
      <AnimatePresence>
        {isJobModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              {/* Dark backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900 transition-opacity"
                onClick={() => setIsJobModalOpen(false)}
              />

              {/* Slide-over panel container */}
              <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
                <motion.div
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', stiffness: 220, damping: 25 }}
                  className="pointer-events-auto w-screen max-w-2xl"
                >
                  <form onSubmit={handleSaveJob} className="flex h-full flex-col bg-white shadow-2xl overflow-y-scroll">
                    <div className="flex-1 py-8 px-6 sm:px-8">
                      {/* Header */}
                      <div className="flex items-center justify-between border-b border-slate-100 pb-5">
                        <div>
                          <h2 className="text-xl font-bold text-slate-900">
                            {editingJobId ? 'Edit Job Opening' : 'Post New Job Opening'}
                          </h2>
                          <p className="text-slate-500 text-xs mt-1">
                            Provide standard and additional details for your job posting.
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          {!editingJobId && (
                            <button
                              type="button"
                              onClick={downloadJDTemplate}
                              className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-[#4B2A63] text-xs font-bold rounded-xl border border-slate-200 transition-colors shadow-sm cursor-pointer"
                              title="Download Word JD Template"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download Template</span>
                            </button>
                          )}
                          <button
                            type="button"
                            className="rounded-xl p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                            onClick={() => setIsJobModalOpen(false)}
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      {/* Form Body */}
                      <div className="space-y-6 mt-8">
                        {/* HR Emails List Editor */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">HR Notification Emails (Optional)</label>
                          
                          {/* List of items */}
                          {jobForm.hrEmails && jobForm.hrEmails.length > 0 && (
                            <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                              {jobForm.hrEmails.map((email, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
                                  <span className="truncate flex-1 mr-3">{email}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeListItem('hrEmails', idx)}
                                    className="text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="email"
                              placeholder="e.g. hr.manager@company.com"
                              value={hrEmailInput}
                              onChange={(e) => setHrEmailInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('hrEmails', hrEmailInput, setHrEmailInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('hrEmails', hrEmailInput, setHrEmailInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer font-sans"
                            >
                              Add
                            </button>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">If left empty, applications will be sent to the global HR email setting.</p>
                        </div>

                        {/* Attached JD File (Visible when jdUrl is present) */}
                        {jobForm.jdUrl && (
                          <div className="bg-emerald-50/30 border border-emerald-100/70 rounded-2xl p-4 flex items-center justify-between shadow-sm">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                                <FileText className="w-5 h-5" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-slate-800">Job Description Attached</p>
                                <p className="text-xs text-slate-500 mt-0.5">Original specifications document is active</p>
                              </div>
                            </div>
                            <a
                              href={jobForm.jdUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 bg-[#4B2A63] hover:bg-[#3B198F] text-white text-xs font-bold px-4 py-2 rounded-full shadow-sm shadow-[#4B2A63]/10 transition-all cursor-pointer"
                            >
                              <span>View File</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        )}

                        {/* JD Upload Section (Only visible when creating a new job) */}
                        {!editingJobId && (
                          <div className="bg-[#4B2A63]/5 border-2 border-dashed border-[#4B2A63]/20 rounded-2xl p-5 text-center transition-all hover:bg-[#4B2A63]/10 hover:border-[#4B2A63]/40">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              {isParsing ? (
                                <div className="flex flex-col items-center space-y-2">
                                  <Loader2 className="w-8 h-8 text-[#4B2A63] animate-spin" />
                                  <p className="text-sm font-bold text-[#4B2A63]">Analyzing Job Description...</p>
                                  <p className="text-xs text-slate-500">Extracting details and structuring fields</p>
                                </div>
                              ) : parsedFileName ? (
                                <>
                                  <div className="mx-auto p-3 bg-emerald-50 rounded-xl shadow-sm text-emerald-600 w-fit">
                                    <CheckCircle className="w-5 h-5 animate-pulse" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">JD Loaded & Autofilled</p>
                                    <p className="text-xs text-emerald-600 font-semibold mt-1 flex items-center justify-center gap-1.5 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 max-w-xs mx-auto truncate">
                                      <FileText className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                                      <span className="truncate">{parsedFileName}</span>
                                    </p>
                                  </div>
                                  <label className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-full transition-colors cursor-pointer shadow-sm mt-1">
                                    <span>Use Different File</span>
                                    <input
                                      type="file"
                                      accept=".pdf,.docx"
                                      onChange={handleJDUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </>
                              ) : (
                                <>
                                  <div className="mx-auto p-3 bg-white rounded-xl shadow-sm text-[#4B2A63] w-fit">
                                    <Upload className="w-5 h-5" />
                                  </div>
                                  <div>
                                    <p className="text-sm font-bold text-slate-900">Auto-fill via Job Description</p>
                                    <p className="text-xs text-slate-500 mt-0.5">Upload a PDF or Word (.docx) file to populate fields automatically</p>
                                  </div>
                                  <label className="inline-flex items-center px-4 py-2 bg-[#4B2A63] hover:bg-[#3B198F] text-white text-xs font-bold rounded-full transition-colors cursor-pointer shadow-sm mt-1">
                                    <span>Upload JD File</span>
                                    <input
                                      type="file"
                                      accept=".pdf,.docx"
                                      onChange={handleJDUpload}
                                      className="hidden"
                                    />
                                  </label>
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Title & Department */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Job Title *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Senior Backend Engineer"
                              value={jobForm.title}
                              onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Department *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Engineering, Sales"
                              value={jobForm.department}
                              onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        {/* Location Tag Input */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Locations *</label>
                          
                          {jobForm.locations && jobForm.locations.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                              {jobForm.locations.map((loc, idx) => (
                                <div key={idx} className="flex items-center gap-1 bg-white border border-slate-200 px-2 py-1 rounded-lg text-xs font-semibold text-slate-700 shadow-sm">
                                  <span>{loc}</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const newLocations = [...(jobForm.locations || [])];
                                      newLocations.splice(idx, 1);
                                      setJobForm({ ...jobForm, locations: newLocations });
                                    }}
                                    className="text-slate-400 hover:text-rose-500 transition-colors"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Noida, Pune, Remote"
                              value={locInput}
                              onChange={(e) => setLocInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('locations', locInput, setLocInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('locations', locInput, setLocInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* Type & Experience */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Job Type</label>
                            <select
                              value={jobForm.type}
                              onChange={(e) => setJobForm({ ...jobForm, type: e.target.value })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            >
                              <option value="Full-Time">Full-Time</option>
                              <option value="Part-Time">Part-Time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Experience Level *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 3-5 Years"
                              value={jobForm.experience}
                              onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            />
                          </div>
                        </div>

                        {/* Status & Budget Range */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Posting Status</label>
                            <select
                              value={jobForm.status}
                              onChange={(e) => setJobForm({ ...jobForm, status: e.target.value as any })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            >
                              <option value="active">Active (Visible Publicly)</option>
                              <option value="draft">Draft (Hidden)</option>
                              <option value="closed">Closed (Archive)</option>
                            </select>
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Budget Range (optional)</label>
                            <input
                              type="text"
                              placeholder="e.g. ₹6L - ₹10L"
                              value={jobForm.budgetRange}
                              onChange={(e) => setJobForm({ ...jobForm, budgetRange: e.target.value })}
                              className="w-full bg-slate-50 rounded-xl px-4 py-2.5 text-sm font-semibold border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all"
                            />
                          </div>
                        </div>



                        {/* Description (Short summary for cards) */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Short Card Description *</label>
                          <textarea
                            required
                            placeholder="Briefly state what this role entails. Shown on job listing cards."
                            value={jobForm.description}
                            onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl p-4 text-sm font-medium border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all min-h-[70px] resize-none"
                          />
                        </div>

                        {/* About Role (Detailed markdown/plain text overview) */}
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">Full "About the Role" *</label>
                          <textarea
                            required
                            placeholder="Provide a comprehensive introduction to the role, responsibilities, culture, and team structure."
                            value={jobForm.aboutText}
                            onChange={(e) => setJobForm({ ...jobForm, aboutText: e.target.value })}
                            className="w-full bg-slate-50 rounded-xl p-4 text-sm font-medium border border-transparent outline-none focus:border-[#4B2A63] focus:bg-white transition-all min-h-[120px] resize-y"
                          />
                        </div>

                        {/* List items editor: Requirements */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Role Requirements</label>
                          
                          {/* List of items */}
                          {jobForm.requirements.length > 0 && (
                            <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                              {jobForm.requirements.map((req, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
                                  <span className="truncate flex-1 mr-3">{req}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeListItem('requirements', idx)}
                                    className="text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Strong knowledge of Node.js & NestJS"
                              value={reqInput}
                              onChange={(e) => setReqInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('requirements', reqInput, setReqInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('requirements', reqInput, setReqInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* List items editor: Responsibilities */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Key Responsibilities</label>
                          
                          {jobForm.responsibilities.length > 0 && (
                            <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                              {jobForm.responsibilities.map((resp, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
                                  <span className="truncate flex-1 mr-3">{resp}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeListItem('responsibilities', idx)}
                                    className="text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Design and execute highly modular REST endpoints"
                              value={respInput}
                              onChange={(e) => setOriginalText(e.target.value, setRespInput)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('responsibilities', respInput, setRespInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('responsibilities', respInput, setRespInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* List items editor: Nice to Have */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">Nice to Have (Optional)</label>
                          
                          {jobForm.niceToHave.length > 0 && (
                            <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                              {jobForm.niceToHave.map((nice, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
                                  <span className="truncate flex-1 mr-3">{nice}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeListItem('niceToHave', idx)}
                                    className="text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. AWS Certification or Docker experience"
                              value={niceInput}
                              onChange={(e) => setNiceInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('niceToHave', niceInput, setNiceInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('niceToHave', niceInput, setNiceInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>

                        {/* List items editor: What We Offer */}
                        <div className="space-y-3 p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                          <label className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">What We Offer</label>
                          
                          {jobForm.whatWeOffer.length > 0 && (
                            <ul className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
                              {jobForm.whatWeOffer.map((offer, idx) => (
                                <li key={idx} className="flex justify-between items-center bg-white border border-slate-100 rounded-lg px-3 py-1.5 text-xs text-slate-600 font-medium">
                                  <span className="truncate flex-1 mr-3">{offer}</span>
                                  <button
                                    type="button"
                                    onClick={() => removeListItem('whatWeOffer', idx)}
                                    className="text-rose-400 hover:text-rose-600 flex-shrink-0 cursor-pointer"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}

                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="e.g. Competitive pay + yearly bonus & health insurance"
                              value={offerInput}
                              onChange={(e) => setOfferInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  addListItem('whatWeOffer', offerInput, setOfferInput);
                                }
                              }}
                              className="w-full bg-white rounded-lg px-3 py-2 text-xs font-medium border border-slate-200 outline-none focus:border-[#4B2A63] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => addListItem('whatWeOffer', offerInput, setOfferInput)}
                              className="px-3 h-[32px] bg-[#4B2A63] text-white text-xs font-bold rounded-lg hover:bg-[#3B198F] transition-colors flex items-center justify-center cursor-pointer"
                            >
                              Add
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer buttons */}
                    <div className="flex flex-shrink-0 justify-end gap-3 border-t border-slate-100 px-6 py-4 bg-slate-50">
                      <Button
                        type="button"
                        variant="ghost"
                        onClick={() => setIsJobModalOpen(false)}
                        className="rounded-full"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        disabled={isParsing}
                        className="bg-[#4B2A63] text-white hover:bg-[#3B198F] rounded-full px-6 font-bold shadow-md shadow-[#4B2A63]/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isParsing ? (
                          <span className="flex items-center gap-1.5 justify-center">
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Parsing...
                          </span>
                        ) : editingJobId ? (
                          'Save Changes'
                        ) : (
                          'Create Job Posting'
                        )}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ----------------- APPLICATION DETAILS MODAL ----------------- */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 overflow-hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="absolute inset-0 overflow-hidden">
              {/* Dark backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900 transition-opacity"
                onClick={() => setSelectedApp(null)}
              />

              {/* Center Modal */}
              <div className="fixed inset-0 z-10 overflow-y-auto flex items-center justify-center p-4 sm:p-6">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="relative transform overflow-hidden rounded-[24px] bg-white text-left shadow-2xl transition-all w-full max-w-2xl"
                >
                  <div className="bg-white p-6 sm:p-8">
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-5">
                      <div>
                        <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border mb-2 ${getStatusBadgeClass(selectedApp.status)}`}>
                          {selectedApp.status}
                        </span>
                        <h3 className="text-xl font-bold text-slate-900 leading-tight">
                          {selectedApp.fullName}
                        </h3>
                        <p className="text-[#4B2A63] text-xs font-bold mt-1">
                          Applied for: {selectedApp.jobTitle || 'Unknown Position'}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="rounded-xl p-2 bg-slate-50 hover:bg-slate-100 text-slate-500 transition-colors"
                        onClick={() => setSelectedApp(null)}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    {/* Modal Details Grid */}
                    <div className="grid grid-cols-2 gap-y-4 gap-x-6 py-6 border-b border-slate-100 text-sm">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Email Address</p>
                        <p className="text-slate-800 font-bold mt-0.5">{selectedApp.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Phone Number</p>
                        <p className="text-slate-800 font-bold mt-0.5">{selectedApp.phone}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Total Experience</p>
                        <p className="text-slate-800 font-bold mt-0.5">{selectedApp.experience}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Notice Period</p>
                        <p className="text-slate-800 font-bold mt-0.5">{selectedApp.noticePeriod}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Current Company</p>
                        <p className="text-slate-800 font-bold mt-0.5">{selectedApp.currentCompany || 'Not Provided'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Links</p>
                        <div className="flex gap-3 mt-1">
                          {selectedApp.linkedInProfile ? (
                            <a
                              href={selectedApp.linkedInProfile}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-[#4B2A63] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              LinkedIn <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 font-light">No LinkedIn</span>
                          )}
                          {selectedApp.portfolioUrl ? (
                            <a
                              href={selectedApp.portfolioUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs font-bold text-[#4B2A63] hover:underline inline-flex items-center gap-0.5 cursor-pointer"
                            >
                              Portfolio <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 font-light">No Portfolio</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Cover Letter Section */}
                    <div className="py-5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Cover Letter</p>
                      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 text-xs text-slate-600 leading-relaxed font-light whitespace-pre-line max-h-[180px] overflow-y-auto">
                        {selectedApp.coverLetter || 'No cover letter was provided with this application.'}
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between border-t border-slate-100 pt-5 mt-4">
                      {/* Left: Change status */}
                      <div className="flex items-center gap-2">
                        <label className="text-[11px] font-bold text-slate-500 uppercase">Status:</label>
                        <select
                          value={selectedApp.status}
                          onChange={(e) => handleUpdateAppStatus(selectedApp.id, e.target.value)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border outline-none bg-white cursor-pointer ${getStatusBadgeClass(selectedApp.status)}`}
                        >
                          <option value="applied">Applied</option>
                          <option value="reviewed">Reviewed</option>
                          <option value="shortlisted">Shortlisted</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </div>

                      {/* Right: Download Resume & Close */}
                      <div className="flex gap-2">
                        <a
                          href={selectedApp.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs text-white font-bold bg-[#4B2A63] hover:bg-[#3B198F] shadow-sm hover:shadow-md transition-all cursor-pointer"
                        >
                          <Download className="w-4 h-4" />
                          Download Resume
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Helper to keep code clean and typed without input warnings
function setOriginalText(val: string, setter: (val: string) => void) {
  setter(val);
}
