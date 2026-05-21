import Link from 'next/link';


const footerLinks = {
  company: [
    'About', 'Leadership', 'Career', 'Partners', 'Blog', 'Case Studies', 'Testimonials', 'FAQs', 'Contact us'
  ],
  products: [
    'Modules', 'ERP Software', 'ERP for Small Business', 'Cloud ERP Solutions', 'Finance Management Softw', 'HR Management System', 'Supply Chain Management', 'CRM Software', 'Manufacturing ERP'
  ],
  industries: [
    'ERP for Manufacturing Industry', 'ERP for Healthcare', 'ERP for Retail Business', 'ERP for Logistics', 'ERP for Construction', 'Custom ERP Solutions'
  ],
  services: [
    'ERP Implementation Service', 'ERP Consulting', 'ERP Support & Maintenance', 'Cloud Migration Services', 'Managed IT Services'
  ]
};

export function Footer() {
  return (
    <footer className="bg-[#ececec] border-t border-slate-100 pt-8 pb-0 px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Top Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">

          {/* Column 1: Brand & Info */}
          <div className="lg:col-span-1 flex flex-col">
            <img src="/footer-logo.png" alt="Eastern Software Solutions Pvt.Ltd" className="w-[200px] mb-4" />

            <p className="text-[12px] text-slate-400 leading-relaxed mb-6">
              is a member of Electronics & Computer Software Export Promotion Council - registering authority for Electronics and Software exporters as per the Foreign Trade Policy (FTP) of India.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-6">
              <a href="#" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* X (formerly Twitter) Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* LinkedIn Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* Placeholder for Facebook */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.876v-6.987H7.898v-2.89h2.538V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" /></svg>
              </a>
              <a href="#" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* Placeholder for Youtube */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M10 15l5.196-3L10 9v6z" /><path d="M21.8 8.001c-.2-1.5-.8-2.8-1.8-3.8-1-1-2.3-1.5-3.8-1.7C14.9 2 12 2 12 2s-2.9 0-4.2.5c-1.5.2-2.8.8-3.8 1.8-1 1-1.5 2.3-1.7 3.8C2 9.3 2 12 2 12s0 2.9.5 4.2c.2 1.5.8 2.8 1.8 3.8 1 1 2.3 1.5 3.8 1.7 1.3.5 4.2.5 4.2.5s2.9 0 4.2-.5c1.5-.2 2.8-.8 3.8-1.8 1-1 1.5-2.3 1.7-3.8.5-1.3.5-4.2.5-4.2s0-2.9-.5-4.2z" /></svg>
              </a>
            </div>

            {/* Regions */}
            <div className="flex items-center gap-2 text-[12px] font-bold text-slate-800">
              <span>India</span>
              <span className="text-slate-300">|</span>
              <span>Middle East</span>
              <span className="text-slate-300">|</span>
              <span>Africa</span>
              <span className="text-slate-300">|</span>
              <span>USA</span>
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-1">
              {footerLinks.company.map(link => (
                <li key={link}>
                  <Link href="#" className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Products</h4>
            <ul className="space-y-1">
              {footerLinks.products.map(link => (
                <li key={link}>
                  <Link href={link === 'Modules' ? '/modules' : '#'} className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Industries */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Industries</h4>
            <ul className="space-y-1">
              {footerLinks.industries.map(link => (
                <li key={link}>
                  <Link href="#" className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Services */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-1">
              {footerLinks.services.map(link => (
                <li key={link}>
                  <Link href="#" className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

      {/* Bottom Section - Full width border */}
      <div className="border-t border-slate-300 w-full mt-2">
        <div className="container mx-auto max-w-7xl px-6 py-2 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap items-center gap-3 text-[12px] text-slate-500">
            <Link href="#" className="hover:text-slate-800">Trust & security</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-800">Terms of Use</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-800">Privacy Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-800">Cookies Policy</Link>
            <span className="text-slate-300">|</span>
            <Link href="#" className="hover:text-slate-800">Settings</Link>
          </div>

          <div className="text-[12px] text-slate-500 flex items-center gap-1">
            Copyright © 2026. <span className="font-semibold text-slate-700">Eastern Software Solutions Pvt. Ltd</span> All Rights Reserved
          </div>
        </div>
      </div>
    </footer>
  );
}
