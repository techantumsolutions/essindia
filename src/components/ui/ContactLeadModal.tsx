'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { usePathname } from 'next/navigation';
import { validatePhoneNumber } from '@/lib/phone-validation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_COUNTRIES_LIST } from '@/lib/countries';
import countryCodesList from 'country-codes-list';

const DIAL_CODES = (countryCodesList.customArray({
  name: '{countryNameEn}',
  code: '{countryCode}',
  dialCode: '+{countryCallingCode}'
}) as any as Array<{ name: string; code: string; dialCode: string }>).map(c => ({
  ...c,
  code: c.code.toLowerCase()
})).filter((c, index, self) =>
  index === self.findIndex((t) => t.dialCode === c.dialCode)
);

interface ContactLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  pageName?: string;
}

export function ContactLeadModal({ isOpen, onClose, pageName }: ContactLeadModalProps) {
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: '',
  });

  const [selectedCountry, setSelectedCountry] = React.useState<string>('');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [selectedDialCode, setSelectedDialCode] = React.useState<string>('in');
  const [searchDialQuery, setSearchDialQuery] = React.useState<string>('');
  const [acceptedPrivacy, setAcceptedPrivacy] = React.useState<boolean>(false);

  const filteredCountries = ALL_COUNTRIES_LIST.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const filteredDialCodes = DIAL_CODES.filter(c => c.name.toLowerCase().includes(searchDialQuery.toLowerCase()) || c.dialCode.includes(searchDialQuery));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPrivacy) {
      toast.error('Please accept the privacy policy to continue.');
      return;
    }
    
    if (!selectedCountry) {
      toast.error('Please select a country.');
      return;
    }

    const validation = validatePhoneNumber(formData.phone, selectedDialCode);
    if (!validation.isValid) {
      toast.error(validation.message);
      return;
    }

    setIsSubmitting(true);

    try {
      const dialInfo = DIAL_CODES.find((c) => c.code === selectedDialCode);
      const fullPhone = dialInfo && formData.phone ? `${dialInfo.dialCode} ${formData.phone}` : formData.phone;
      const countryInfo = ALL_COUNTRIES_LIST.find((c) => c.code === selectedCountry);

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          phone: fullPhone,
          country: countryInfo?.name || '',
          formType: 'contact',
          pageName: pageName || pathname || document.title,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to submit');
      }

      toast.success('Inquiry submitted successfully!');
      
      // reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        message: '',
      });
      setSelectedCountry('');
      setAcceptedPrivacy(false);
      
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Please fill out the form below and our team will get in touch with you shortly.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
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
            <div className="flex">
              <Select value={selectedDialCode} onValueChange={(v) => setSelectedDialCode(v || '')} onOpenChange={(open) => !open && setSearchDialQuery('')}>
                <SelectTrigger className="w-[100px] px-3 !h-[38px] rounded-l-md rounded-r-none border border-r-0 border-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-slate-50 shadow-none z-10 relative">
                  <SelectValue>
                    {selectedDialCode && (
                      <span className="flex items-center gap-1.5">
                        {DIAL_CODES.find((c) => c.code === selectedDialCode)?.dialCode}
                      </span>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="w-[260px] max-h-60 p-0" alignItemWithTrigger={false} side="bottom">
                  <div className="p-2 sticky top-0 bg-white z-10 border-b border-slate-100">
                    <input
                      type="text"
                      placeholder="Search..."
                      className="w-full px-3 py-2 text-sm outline-none border border-slate-200 rounded-md focus:border-[#5C2B6A] focus:ring-1 focus:ring-[#5C2B6A] transition-all"
                      value={searchDialQuery}
                      onChange={(e) => setSearchDialQuery(e.target.value)}
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === ' ') {
                          e.preventDefault();
                          setSearchDialQuery(prev => prev + ' ');
                        }
                      }}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <div className="p-1">
                    {filteredDialCodes.length > 0 ? (
                      filteredDialCodes.map((c) => (
                        <SelectItem key={c.code} value={c.code} className="cursor-pointer flex items-center gap-2">
                          <span className="text-slate-500 w-10">{c.dialCode}</span>
                          <span className="truncate">{c.name}</span>
                        </SelectItem>
                      ))
                    ) : (
                      <div className="py-4 text-center text-sm text-slate-500">Not found</div>
                    )}
                  </div>
                </SelectContent>
              </Select>
              <Input required name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter Mobile No" className="rounded-l-none" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Company Name</label>
            <Input name="company" value={formData.company} onChange={handleChange} placeholder="Enter Company Name" />
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
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Message</label>
            <textarea 
              name="message" 
              value={formData.message} 
              onChange={handleChange} 
              placeholder="Enter your message" 
              className="flex min-h-[80px] w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all disabled:cursor-not-allowed disabled:opacity-50" 
            />
          </div>
          
          <div className="pt-2">
            <div className="flex items-center space-x-3 mb-2">
              <input
                type="checkbox"
                id="contact-privacy"
                className="w-4 h-4 rounded border-slate-300 text-[#5C2B6A] focus:ring-[#5C2B6A] cursor-pointer"
                checked={acceptedPrivacy}
                onChange={(e) => setAcceptedPrivacy(e.target.checked)}
              />
              <label htmlFor="contact-privacy" className="text-sm text-slate-600 font-medium cursor-pointer">
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
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
