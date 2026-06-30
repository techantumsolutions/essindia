"use client";

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ALL_COUNTRIES_LIST } from '@/lib/countries';
import countryCodesList from 'country-codes-list';
import { toast } from 'sonner';

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

export interface ContactFaq {
  question?: string;
  qutation?: string;
  quotation?: string;
  answer: string;
}

export interface ContactFormFaqContent {
  formTitle?: string;
  formDescription?: string;
  faqTitle?: string;
  faqs?: ContactFaq[];
}

export function ContactFormFaq({ content }: { content?: ContactFormFaqContent }) {
  const formTitle = content?.formTitle || "Send us a Message";
  const formDescription = content?.formDescription || "Fill out the form below and our team will get back to you within 24 hours. For urgent security matters, please use our emergency support line.";
  const faqTitle = content?.faqTitle || "Common Questions";
  
  const displayFaqs = content?.faqs || [
    {
      question: "How fast do you respond?",
      answer: "We aim to respond to all inquiries within 24 hours during business days. Priority support is available for Enterprise customers."
    },
    {
      question: "Do you offer 24/7 support?",
      answer: "Yes, our technical support team is available 24/7 for critical system issues for our Platinum and Enterprise plan members."
    },
    {
      question: "How can I get started with ESS solutions?",
      answer: "Simply submit your inquiry through our Contact Us page, and our team will connect with you to understand your requirements."
    },
    {
      question: "Can I request a product demo?",
      answer: "Yes, you can contact our team to schedule a free product demo and consultation."
    },
    {
      question: "Do you provide post-implementation support?",
      answer: "Yes, ESS offers ongoing technical support, maintenance, upgrades, and managed services after deployment."
    }
  ];
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDialCode, setSelectedDialCode] = useState<string>('in');
  const [searchDialQuery, setSearchDialQuery] = useState<string>('');
  const [acceptedPrivacy, setAcceptedPrivacy] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedPrivacy) {
      toast.error('Please accept the privacy policy to continue.');
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
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          phone: fullPhone,
          company: formData.company,
          country: countryInfo ? countryInfo.name : selectedCountry,
          message: formData.message,
        })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Submission failed');
      }

      toast.success('Submitted successfully!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', company: '', message: '' });
      setSelectedCountry('');
      setAcceptedPrivacy(false);
    } catch (err: any) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredCountries = ALL_COUNTRIES_LIST.filter((country) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredDialCodes = DIAL_CODES.filter((c) =>
    c.name.toLowerCase().includes(searchDialQuery.toLowerCase()) ||
    c.dialCode.includes(searchDialQuery)
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-14">
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-8">

        {/* Left Side - Form */}
        <div className="w-full lg:w-1/2">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md">
            <h2 className="text-3xl font-bold text-[#27256B] mb-2">{formTitle}</h2>
            <p className="text-gray-500 text-sm mb-4 leading-relaxed">
              {formDescription}
            </p>

            <form className="space-y-2" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name</label>
                  <input required name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="Enter your first name" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name</label>
                  <input required name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Enter your last name" className="w-full px-4  py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Email</label>
                  <input required name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Enter your e-mail" className="w-full px-4  py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone number</label>
                  <div className="flex">
                    <Select value={selectedDialCode} onValueChange={(v) => setSelectedDialCode(v || '')} onOpenChange={(open) => !open && setSearchDialQuery('')}>
                      <SelectTrigger className="w-[100px] px-3 !h-[38px] rounded-l-lg rounded-r-none border border-r-0 border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-gray-50 shadow-none z-10 relative">
                        <SelectValue>
                          {selectedDialCode && (
                            <span className="flex items-center gap-1.5">
                              {DIAL_CODES.find((c) => c.code === selectedDialCode)?.dialCode}
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent className="w-[260px] max-h-60 p-0" alignItemWithTrigger={false} side="bottom">
                        <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                          <input
                            type="text"
                            placeholder="Search..."
                            className="w-full px-3 py-2 text-sm outline-none border border-gray-200 rounded-md focus:border-[#5C2B6A] focus:ring-1 focus:ring-[#5C2B6A] transition-all"
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
                                <span className="text-gray-500 w-10">{c.dialCode}</span>
                                <span className="truncate">{c.name}</span>
                              </SelectItem>
                            ))
                          ) : (
                            <div className="py-4 text-center text-sm text-gray-500">Not found</div>
                          )}
                        </div>
                      </SelectContent>
                    </Select>
                    <input name="phone" value={formData.phone} onChange={handleInputChange} type="tel" placeholder="Enter phone number" className="w-full px-4 !h-[38px] rounded-r-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm relative z-0" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Company Name</label>
                <input name="company" value={formData.company} onChange={handleInputChange} type="text" placeholder="Enter company name" className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Select country</label>
                <Select value={selectedCountry} onValueChange={(v) => setSelectedCountry(v || '')} onOpenChange={(open) => !open && setSearchQuery('')}>
                  <SelectTrigger className="w-full px-4 !h-[38px] rounded-lg border border-gray-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#5C2B6A] focus-visible:border-transparent transition-all text-sm bg-white shadow-none">
                    <SelectValue placeholder="Select Country">
                      {selectedCountry ? (
                        <span className="flex items-center">
                          <span className={`fi fi-${selectedCountry} mr-2 rounded-sm`}></span>
                          {ALL_COUNTRIES_LIST.find((c) => c.code === selectedCountry)?.name}
                        </span>
                      ) : (
                        "Select"
                      )}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-60 p-0" alignItemWithTrigger={false} side="bottom">
                    <div className="p-2 sticky top-0 bg-white z-10 border-b border-gray-100">
                      <input
                        type="text"
                        placeholder="Search country..."
                        className="w-full px-3 py-2 text-sm outline-none border border-gray-200 rounded-md focus:border-[#5C2B6A] focus:ring-1 focus:ring-[#5C2B6A] transition-all"
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
                        <div className="py-4 text-center text-sm text-gray-500">No countries found</div>
                      )}
                    </div>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Message</label>
                <textarea required name="message" value={formData.message} onChange={handleInputChange} rows={4} placeholder="Leave us a message..." className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#5C2B6A] focus:border-transparent transition-all text-sm resize-none"></textarea>
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <input
                  type="checkbox"
                  id="privacy"
                  className="w-4 h-4 rounded border-gray-300 text-[#5C2B6A] focus:ring-[#5C2B6A] cursor-pointer"
                  checked={acceptedPrivacy}
                  onChange={(e) => setAcceptedPrivacy(e.target.checked)}
                />
                <label htmlFor="privacy" className="text-sm text-gray-600 font-medium cursor-pointer">
                  You agree to our friendly privacy policy.
                </label>
              </div>

              <button disabled={isSubmitting} type="submit" className="w-full bg-[#2A2B6E] hover:bg-[#1a1b4e] text-white font-medium py-4 rounded-xl transition-colors duration-300 mt-4 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed">
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Side - FAQ */}
        <div className="w-full lg:w-1/2 lg:pl-12 pt-8 lg:pt-0">
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-md h-full">
            <h2 className="text-3xl font-bold text-[#27256B] mb-4">{faqTitle}</h2>

            <div className="space-y-3">
              {displayFaqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-6 last:pb-0">
                  <div className="w-full flex justify-between items-center text-left">
                    <h3 className="text-lg font-bold text-gray-900 pr-8">{faq.quotation || faq.qutation || faq.question}</h3>
                  </div>
                  <div className="mt-1 text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
