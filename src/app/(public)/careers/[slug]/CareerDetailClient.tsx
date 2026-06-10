'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Users, UploadCloud, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import JobDetailHero from '@/components/blocks/JobDetailHero';

interface CareerDetailClientProps {
  job: {
    id: string;
    title: string;
    slug: string;
    department: string;
    description: string;
    type: string;
    experience: string;
    location: string;
    aboutText: string;
    requirements: string[];
    responsibilities: string[];
    niceToHave: string[];
    whatWeOffer: string[];
    status: string;
  };
}

export default function CareerDetailClient({ job }: CareerDetailClientProps) {
  // Form State
  const [fullName, setFullName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [experience, setExperience] = React.useState('');
  const [currentCompany, setCurrentCompany] = React.useState('');
  const [noticePeriod, setNoticePeriod] = React.useState('');
  const [linkedInProfile, setLinkedInProfile] = React.useState('');
  const [portfolioUrl, setPortfolioUrl] = React.useState('');
  const [coverLetter, setCoverLetter] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitSuccess, setSubmitSuccess] = React.useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error('Resume file size must be less than 5MB');
        return;
      }
      setResumeFile(selectedFile);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !experience || !noticePeriod || !resumeFile) {
      toast.error('Please fill in all required fields and upload your resume');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('email', email);
      formData.append('phone', phone);
      formData.append('experience', experience);
      formData.append('currentCompany', currentCompany);
      formData.append('noticePeriod', noticePeriod);
      formData.append('linkedInProfile', linkedInProfile);
      formData.append('portfolioUrl', portfolioUrl);
      formData.append('coverLetter', coverLetter);
      formData.append('resume', resumeFile);

      // Always use the UUID id for the apply API endpoint
      const res = await fetch(`/api/careers/${job.id}/apply`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        toast.success('Application submitted successfully!');
        setSubmitSuccess(true);
        // Reset form
        setFullName('');
        setEmail('');
        setPhone('');
        setExperience('');
        setCurrentCompany('');
        setNoticePeriod('');
        setLinkedInProfile('');
        setPortfolioUrl('');
        setCoverLetter('');
        setResumeFile(null);
      } else {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit application');
      }
    } catch (err: any) {
      toast.error(err.message || 'An error occurred while submitting your application');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Format meta list for JobDetailHero
  const metaList = [
    { icon: 'MapPin', text: job.location },
    { icon: 'Clock', text: job.experience },
    { icon: 'Briefcase', text: job.type },
    { icon: 'Building', text: job.department }
  ];

  // Map requirements, responsibilities, whatWeOffer lists
  const detailSections = [
    { title: 'Key Responsibilities', items: job.responsibilities || [] },
    { title: 'Requirements', items: job.requirements || [] },
    { title: 'Nice to Have', items: job.niceToHave || [] },
    { title: 'What We Offer', items: job.whatWeOffer || [] }
  ].filter(s => s.items && s.items.length > 0);

  return (
    <>
      <JobDetailHero
        content={{
          backLinkText: 'Back to Careers',
          backLinkUrl: '/careers',
          tags: [job.department, job.type],
          jobTitle: job.title,
          meta: metaList
        }}
      />

      <section className="py-16 bg-white relative">
        <div className="container mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

            {/* Left Column: Job Description */}
            <div className="lg:col-span-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="prose prose-slate max-w-none"
              >
                {/* About Section */}
                <div className="mb-12">
                  <h2 className="text-[22px] font-bold text-slate-900 mb-4">About the Role</h2>
                  <p className="text-[15px] leading-relaxed text-slate-600 font-light whitespace-pre-line">
                    {job.aboutText || job.description}
                  </p>
                </div>

                {/* Dynamic List Sections */}
                {detailSections.map((sect: any, sIdx: number) => (
                  <div key={sIdx} className="mb-12">
                    <h2 className="text-[22px] font-bold text-slate-900 mb-6">{sect.title}</h2>
                    <ul className="space-y-4">
                      {sect.items.map((item: string, iIdx: number) => (
                        <li key={iIdx} className="flex items-start">
                          <CheckCircle2 className="w-[18px] h-[18px] text-[#4B2A63] mr-3 mt-1 flex-shrink-0" strokeWidth={2} />
                          <span className="text-[15px] text-slate-600 font-light leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column: Sticky Application Form */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-white border border-slate-100 rounded-[14px] shadow-[0_2px_10px_rgba(0,0,0,0.04)] p-8"
                >
                  {submitSuccess ? (
                    <div className="text-center py-8 space-y-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                        <CheckCircle2 className="w-10 h-10" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900">Application Submitted!</h3>
                      <p className="text-sm text-slate-500">
                        Thank you for applying. We will review your profile and get back to you soon.
                      </p>
                      <button
                        onClick={() => setSubmitSuccess(false)}
                        className="mt-4 text-xs font-bold text-[#4B2A63] hover:underline cursor-pointer"
                      >
                        Submit another application
                      </button>
                    </div>
                  ) : (
                    <>
                      {/* Form Header */}
                      <div className="flex items-center gap-4 mb-8">
                        <div className="w-12 h-12 rounded-xl bg-[#23173D] flex items-center justify-center text-white">
                          <Users className="w-6 h-6 " />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 leading-tight">Apply Now</h3>
                          <p className="text-[13px] text-slate-500">Join our team</p>
                        </div>
                      </div>

                      {/* Form Inputs */}
                      <form className="space-y-5" onSubmit={handleSubmit}>

                        {/* Full Name & Email */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Email Address *</label>
                            <input
                              type="email"
                              required
                              placeholder="john@example.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300"
                            />
                          </div>
                        </div>

                        {/* Phone & Experience */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Phone Number *</label>
                            <input
                              type="text"
                              required
                              placeholder="+91 9876543210"
                              value={phone}
                              onChange={(e) => setPhone(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Total Experience *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. 3 years"
                              value={experience}
                              onChange={(e) => setExperience(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors"
                            />
                          </div>
                        </div>

                        {/* Current Company & Notice Period */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Current Company</label>
                            <input
                              type="text"
                              value={currentCompany}
                              onChange={(e) => setCurrentCompany(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Notice Period *</label>
                            <input
                              type="text"
                              required
                              placeholder="e.g. Immediate, 30 days"
                              value={noticePeriod}
                              onChange={(e) => setNoticePeriod(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors"
                            />
                          </div>
                        </div>

                        {/* LinkedIn & Portfolio */}
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">LinkedIn Profile</label>
                            <input
                              type="url"
                              placeholder="https://linkedin.com/..."
                              value={linkedInProfile}
                              onChange={(e) => setLinkedInProfile(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300"
                            />
                          </div>
                          <div className="space-y-1.5">
                            <label className="text-[11px] font-bold text-slate-700">Portfolio/GitHub</label>
                            <input
                              type="url"
                              placeholder="https://github.com/..."
                              value={portfolioUrl}
                              onChange={(e) => setPortfolioUrl(e.target.value)}
                              className="w-full h-10 px-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300"
                            />
                          </div>
                        </div>

                        {/* Resume File Upload */}
                        <div className="space-y-2 pt-2">
                          <label className="text-[11px] font-bold text-slate-700 flex items-center">
                            Resume/CV * <span className="font-normal text-slate-500 ml-1">(PDF or Word, max 5MB)</span>
                          </label>
                          <div className="flex items-center gap-3">
                            <label className="inline-flex items-center px-4 h-9 bg-white border border-slate-200 rounded-lg text-[13px] font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer">
                              <UploadCloud className="w-4 h-4 mr-2" />
                              Choose file
                              <input
                                type="file"
                                accept=".pdf,.doc,.docx"
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </label>
                            {resumeFile && (
                              <span className="text-xs text-slate-500 truncate max-w-[200px]" title={resumeFile.name}>
                                {resumeFile.name}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Cover Letter */}
                        <div className="space-y-1.5 pt-2">
                          <label className="text-[11px] font-bold text-slate-700">Cover Letter (Optional)</label>
                          <textarea
                            placeholder="Tell us why you're interested in this role..."
                            value={coverLetter}
                            onChange={(e) => setCoverLetter(e.target.value)}
                            className="w-full h-24 p-3 bg-white border border-slate-200 rounded-lg text-sm outline-none focus:border-[#4B2A63] transition-colors placeholder:text-slate-300 resize-none"
                          ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full h-[42px] bg-[#2B1C50] hover:bg-[#1a1130] disabled:bg-slate-300 text-white text-[13px] font-medium rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer"
                          >
                            {isSubmitting ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Submitting...
                              </>
                            ) : (
                              'Submit Application'
                            )}
                          </button>
                        </div>

                      </form>
                    </>
                  )}
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
