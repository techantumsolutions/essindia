'use client';

import React from 'react';
import { Phone, Check, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';

export interface Landing1CtaContent {
  badge?: string;
  title?: string;
  description?: string;
  whatWeGet?: string[];
  icon?: string;
  contactTitle?: string;
  mobileNumber?: string;
  form?: {
    title?: string;
    disclaimerText?: string;
    buttonText?: string;
    note?: string;
  };
}

const DEFAULT_CONTENT: Landing1CtaContent = {
  badge: 'GET STARTED',
  title: 'Ready to Transform Your Business?',
  description: "Book a free, no-pressure session with an ERP expert. We'll map your processes, show you a live demo tailored to your industry, and quantify your ROI.",
  whatWeGet: [
    'Free Consultation',
    'Live Demo',
    'Industry Expert',
    'ROI Assessment',
    'No Obligation'
  ],
  icon: '',
  contactTitle: 'Prefer to talk now?',
  mobileNumber: '+91 80 0000 0000',
  form: {
    title: 'Schedule your free demo',
    disclaimerText: 'I agree to the Privacy Policy and consent to be contacted about ESS ERP.',
    buttonText: 'Schedule Free Demo',
    note: 'Your data is secure and never shared.'
  }
};

export function Landing1Cta({ content }: { content?: Landing1CtaContent }) {
  const data = {
    ...DEFAULT_CONTENT,
    ...content,
    form: {
      ...DEFAULT_CONTENT.form,
      ...content?.form
    }
  };
  const pathname = usePathname();

  // Form states
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [industry, setIndustry] = React.useState('');
  const [employees, setEmployees] = React.useState('');
  const [currentErp, setCurrentErp] = React.useState('');
  const [requirement, setRequirement] = React.useState('');
  const [agree, setAgree] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) {
      toast.error('You must agree to the privacy policy');
      return;
    }
    if (!name || !email) {
      toast.error('Name and Email are required');
      return;
    }

    setIsSubmitting(true);
    try {
      const messagePayload = JSON.stringify({
        industry,
        employees,
        currentErp,
        requirement
      });

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          formType: 'landing-1',
          message: messagePayload,
          pageName: pathname || ''
        })
      });

      if (!res.ok) {
        throw new Error('Submission failed');
      }

      toast.success('Demo request submitted successfully!');
      // Reset form
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setIndustry('');
      setEmployees('');
      setCurrentErp('');
      setRequirement('');
      setAgree(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit demo request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-[#FAF9FF] text-slate-900 font-sans select-none border-b border-slate-200">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-[0_15px_50px_rgba(0,0,0,0.03)] overflow-hidden grid grid-cols-1 lg:grid-cols-12">

          {/* Left Column */}
          <div className="lg:col-span-5 p-8 md:p-12 bg-slate-50/50 flex flex-col justify-between border-r border-slate-100">
            <div>
              {data.badge && (
                <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-100 uppercase w-fit mb-6">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse" />
                  {data.badge}
                </span>
              )}
              {data.title && (
                <h2 className="text-3xl md:text-[38px] font-extrabold tracking-tight text-slate-900 leading-tight mb-5">
                  {data.title}
                </h2>
              )}
              {data.description && (
                <p className="text-slate-500 text-sm md:text-base leading-relaxed mb-8">
                  {data.description}
                </p>
              )}

              {/* What you get list */}
              {data.whatWeGet && data.whatWeGet.length > 0 && (
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                    What You Get
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {data.whatWeGet.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 bg-white border border-slate-100 p-3 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.01)]">
                        <span className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        </span>
                        <span className="text-xs font-bold text-slate-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Prefer to talk now / Contact callout */}
            {(data.mobileNumber || data.contactTitle || data.icon) && (
              <div className="mt-10 bg-indigo-50/40 border border-indigo-100/50 rounded-2xl p-4 flex items-center gap-4">
                <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shrink-0 flex items-center justify-center">
                  {data.icon ? (
                    <img src={data.icon} alt="Contact Icon" className="w-5 h-5 object-contain" />
                  ) : (
                    <Phone className="w-5 h-5" />
                  )}
                </div>
                <div>
                  {data.contactTitle && (
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {data.contactTitle}
                    </p>
                  )}
                  {data.mobileNumber && (
                    <a href={`tel:${data.mobileNumber.replace(/\s+/g, '')}`} className="text-sm font-bold text-indigo-900 hover:underline">
                      {data.mobileNumber}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Form) */}
          <div className="lg:col-span-7 p-8 md:p-12">
            {data.form?.title && (
              <h3 className="text-xl font-extrabold text-slate-900 mb-6">
                {data.form.title}
              </h3>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Rahul Verma"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Company</label>
                  <input
                    type="text"
                    placeholder="Acme Industries"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="rahul@acme.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Phone</label>
                  <input
                    type="text"
                    placeholder="+91 90000 00000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Industry</label>
                  <input
                    type="text"
                    placeholder="Select industry"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Employees</label>
                  <input
                    type="text"
                    placeholder="Select range"
                    value={employees}
                    onChange={(e) => setEmployees(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Current ERP</label>
                  <input
                    type="text"
                    placeholder="Select current ERP"
                    value={currentErp}
                    onChange={(e) => setCurrentErp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 mb-1.5 block">Business Requirement</label>
                  <input
                    type="text"
                    placeholder="e.g. Automate finance & inventory"
                    value={requirement}
                    onChange={(e) => setRequirement(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-indigo-600/40 focus:bg-white transition-all font-medium text-slate-800"
                  />
                </div>
              </div>

              {/* Checkbox & Disclaimer */}
              <div className="flex items-start gap-2.5 mt-6">
                <input
                  type="checkbox"
                  id="agree-checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="rounded border-slate-350 text-indigo-600 focus:ring-indigo-500 mt-1 cursor-pointer w-4 h-4 shrink-0"
                />
                <label htmlFor="agree-checkbox" className="text-xs text-slate-500 leading-normal select-none cursor-pointer">
                  {data.form?.disclaimerText || 'I agree to the Privacy Policy and consent to be contacted about ESS ERP.'}
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-2xl text-sm font-bold text-white bg-[#5D38F0] hover:bg-[#4E2ED4] disabled:bg-indigo-300 transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 mt-6 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Submitting...
                  </>
                ) : (
                  <>
                    {data.form?.buttonText || 'Schedule Free Demo'} <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Note / Footer text */}
              {data.form?.note && (
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400 mt-4 font-semibold tracking-wide">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  {data.form.note}
                </div>
              )}
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
