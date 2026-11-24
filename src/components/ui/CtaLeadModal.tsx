'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { validateAndFormatPhone } from '@/lib/phone-validation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_COUNTRIES_LIST } from '@/lib/countries';
import { DEFAULT_PHONE_COUNTRY } from '@/lib/dial-codes';
import {
  FORM_COUNTRY_ERROR,
  submitErrorMessage,
  validateEmail,
  validateName,
  validatePrivacy,
} from '@/lib/form-validation';
import { completeFormSuccess } from '@/lib/forms/form-success';
import { PhoneField } from '@/components/ui/PhoneField';

interface CtaLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl?: string;
  pageName?: string;
  isCareerCta?: boolean;
  formType?: string;
}

export function CtaLeadModal({ isOpen, onClose, pdfUrl, pageName, isCareerCta, formType }: CtaLeadModalProps) {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
  });
  const [resumeFile, setResumeFile] = React.useState<File | null>(null);

  const [selectedCountry, setSelectedCountry] = React.useState<string>(DEFAULT_PHONE_COUNTRY);
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedDialCode, setSelectedDialCode] = React.useState<string>(DEFAULT_PHONE_COUNTRY);
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState<boolean>(false);

  const filteredCountries = ALL_COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDialChange = (code: string) => {
    setSelectedDialCode(code);
    if (ALL_COUNTRIES_LIST.some((c) => c.code === code)) {
      setSelectedCountry(code);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateName(formData.name);
    if (!nameCheck.isValid) {
      toast.error(nameCheck.message);
      return;
    }
    const emailCheck = validateEmail(formData.email);
    if (!emailCheck.isValid) {
      toast.error(emailCheck.message);
      return;
    }
    const validation = validateAndFormatPhone(formData.phone, selectedDialCode);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }
    if (!selectedCountry) {
      toast.error(FORM_COUNTRY_ERROR);
      return;
    }
    const privacyCheck = validatePrivacy(acceptedPrivacy);
    if (!privacyCheck.isValid) {
      toast.error(privacyCheck.message);
      return;
    }

    if (isCareerCta && !resumeFile) {
      toast.error('Please upload your resume to apply.');
      return;
    }

    setIsSubmitting(true);

    try {
      let uploadedResumeUrl = '';
      if (isCareerCta && resumeFile) {
        const uploadData = new FormData();
        uploadData.append('file', resumeFile);
        const uploadRes = await fetch('/api/admin/media', {
          method: 'POST',
          body: uploadData,
        });
        if (!uploadRes.ok) {
          throw new Error('Failed to upload resume file.');
        }
        const uploadJson = await uploadRes.json();
        uploadedResumeUrl = uploadJson.url || uploadJson.secure_url || '';
      }

      const countryInfo = ALL_COUNTRIES_LIST.find((c) => c.code === selectedCountry);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: validation.e164,
          countryCode: selectedDialCode,
          country: countryInfo?.name || '',
          formType: formType || (isCareerCta ? 'career-cta' : 'cta'),
          pageName: pageName || pathname || document.title,
          pdfUrl: uploadedResumeUrl || pdfUrl,
          message: uploadedResumeUrl ? `Resume URL: ${uploadedResumeUrl}` : undefined,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw Object.assign(new Error(data.error || ''), { status: res.status });
      }

      if (isCareerCta) {
        toast.success('Application submitted successfully!');
      }
      onClose();
      if (!isCareerCta) {
        await completeFormSuccess('cta', pdfUrl);
      }
    } catch (err: any) {
      toast.error(submitErrorMessage(err.status, err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isCareerCta ? 'Submit Your Resume' : 'Access Document'}</DialogTitle>
          <DialogDescription>
            {isCareerCta
              ? 'Fill out your details and upload your resume to apply directly.'
              : 'Please provide your details below to access the requested document.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4" noValidate>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Full Name *</label>
            <Input required name="name" value={formData.name} onChange={handleChange} placeholder="Enter Name" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Email Address *</label>
            <Input required type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter Email" />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Phone Number *</label>
            <PhoneField
              variant="split"
              required
              name="phone"
              value={formData.phone}
              onChange={(phone) => setFormData((prev) => ({ ...prev, phone }))}
              countryCode={selectedDialCode}
              onCountryChange={handleDialChange}
              placeholder="Enter Mobile No"
              contentClassName="max-h-48"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Country *</label>
            <Select value={selectedCountry} onValueChange={(v) => setSelectedCountry(v || '')} onOpenChange={(open) => !open && setSearchQuery('')}>
              <SelectTrigger className="w-full px-4 !h-[38px] rounded-md border border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-white shadow-none">
                <SelectValue placeholder="Select Country">
                  {selectedCountry ? (
                    <span className="flex items-center">
                      <span className={`fi fi-${selectedCountry} mr-2 rounded-sm`}></span>
                      {ALL_COUNTRIES_LIST.find((c) => c.code === selectedCountry)?.name}
                    </span>
                  ) : (
                    "Select Country"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60 p-0" alignItemWithTrigger={false} side="bottom">
                <div className="p-2 sticky top-0 bg-white z-10 border-b border-slate-100">
                  <input
                    type="text"
                    placeholder="Search country..."
                    className="w-full px-3 py-2 text-sm outline-none border border-slate-200 rounded-md focus:border-[#5C2B6A] focus:ring-1 focus:ring-[#5C2B6A] transition-all"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => {
                      e.stopPropagation();
                      if (e.key === ' ') {
                        e.preventDefault();
                        setSearchQuery(prev => prev + ' ');
                      }
                    }}
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                <div className="p-1">
                  {filteredCountries.length > 0 ? (
                    filteredCountries.map((country) => (
                      <SelectItem key={country.code} value={country.code} className="cursor-pointer">
                        <span className={`fi fi-${country.code} mr-2 rounded-sm`}></span>
                        {country.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="py-4 text-center text-sm text-slate-500">No countries found</div>
                  )}
                </div>
              </SelectContent>
            </Select>
          </div>

          {isCareerCta && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Upload Resume (PDF, DOC, DOCX) *</label>
              <input
                type="file"
                required
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-[#4B2A63]/10 file:text-[#4B2A63] hover:file:bg-[#4B2A63]/20 cursor-pointer border border-slate-200 rounded-md p-1"
              />
            </div>
          )}
          
          <div className="pt-2">
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                id="privacy"
                className="w-4 h-4 rounded border-slate-300 text-[#5C2B6A] focus:ring-[#5C2B6A] cursor-pointer"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              />
              <label htmlFor="privacy" className="text-sm text-slate-600 font-medium cursor-pointer">
                You agree to our privacy policy.
              </label>
            </div>
            <p className="text-xs text-slate-500 ml-7">
              Disclaimer: This information will not be shared with anybody, it will be used for internal purposes only.
            </p>
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" className="bg-[#4B2A63] text-white hover:bg-[#3A1F4D]" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isSubmitting ? 'Submitting...' : 'Submit & View'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
