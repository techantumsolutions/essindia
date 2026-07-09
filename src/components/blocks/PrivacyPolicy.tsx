import React from 'react';

interface PrivacyPolicyContent {
  title?: string;
  contentHtml?: string;
}

export function PrivacyPolicy({ content }: { content?: PrivacyPolicyContent }) {
  const title = content?.title || 'Privacy Policy';
  const contentHtml = content?.contentHtml || `
    <p>We value your privacy. This policy outlines how we collect, use, and safeguard your personal information when you visit our website.</p>
    <h3>1. Information Collection</h3>
    <p>We collect information that you voluntarily provide to us when registering, filling out contact forms, or subscribing to our newsletters.</p>
    <h3>2. Information Usage</h3>
    <p>Your information is used to personalize your experience, improve customer service, and process transaction requests.</p>
  `;

  return (
    <section className="pt-40 pb-14 bg-slate-50 min-h-[60vh] flex items-center font-sans text-slate-800">
      <div className="container mx-auto max-w-7xl px-6 bg-white rounded-3xl p-10 md:p-14 shadow-sm border border-slate-100/80">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-8 pb-4 border-b border-slate-100">
          {title}
        </h1>
        <div
          className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-p:leading-relaxed prose-p:text-slate-600 prose-li:text-slate-600"
          dangerouslySetInnerHTML={{ __html: contentHtml }}
        />
      </div>
    </section>
  );
}
