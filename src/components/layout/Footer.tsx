import Link from 'next/link';
import { footerRepository } from '@/repositories/footer.repository';

export async function Footer() {
  const footerData = await footerRepository.getFooterSettings();

  return (
    <footer className="bg-[#ececec] border-t border-slate-100 pt-8 pb-0 px-6">
      <div className="container mx-auto max-w-7xl">

        {/* Top Section Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 mb-16">

          {/* Column 1: Brand & Info */}
          <div className="lg:col-span-1 flex flex-col">
            <img src={footerData.logoUrl} alt="Eastern Software Solutions Pvt.Ltd" className="w-[200px] mb-4" />

            <p className="text-[12px] text-slate-400 leading-relaxed mb-6">
              {footerData.description}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3 mb-6">
              <a href={footerData.twitterUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* X (formerly Twitter) Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.045 4.126H5.078z" /></svg>
              </a>
              <a href={footerData.linkedinUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* LinkedIn Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" /></svg>
              </a>
              <a href={footerData.facebookUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* Placeholder for Facebook */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 5 3.657 9.128 8.438 9.876v-6.987H7.898v-2.89h2.538V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.242 0-1.63.771-1.63 1.562v1.875h2.773l-.443 2.89h-2.33v6.987C18.343 21.128 22 17 22 12z" /></svg>
              </a>
              <a href={footerData.youtubeUrl || '#'} target="_blank" rel="noopener noreferrer" className="w-8 h-8 rounded-full bg-[#5932A8] text-white flex items-center justify-center hover:bg-[#432385] transition-colors">
                {/* Youtube Icon */}
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" fillRule="evenodd" clipRule="evenodd" xmlns="http://www.w3.org/2000/svg"><path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.517 3.545 12 3.545 12 3.545s-7.517 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.033 0 12 0 12s0 3.967.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.871.508 9.388.508 9.388.508s7.517 0 9.388-.508a3.003 3.003 0 0 0 2.11-2.11C24 15.967 24 12 24 12s0-3.967-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
              </a>
            </div>

            {/* Regions */}
            <div className="flex flex-col gap-2">
              {(() => {
                const countries = footerData.countries.filter(Boolean);
                const chunked = [];
                for (let i = 0; i < countries.length; i += 4) {
                  chunked.push(countries.slice(i, i + 4));
                }
                return chunked.map((row, rowIdx) => (
                  <div key={rowIdx} className="flex items-center gap-2 text-[12px] font-bold text-slate-800 flex-wrap">
                    {row.map((country, idx) => (
                      <span key={country} className="flex items-center gap-2">
                        <span>{country}</span>
                        {idx < row.length - 1 && <span className="text-slate-300">|</span>}
                      </span>
                    ))}
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Column 2: Company */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Company</h4>
            <ul className="space-y-1">
              {footerData.links.company.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url || '#'} className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Products */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Products</h4>
            <ul className="space-y-1">
              {footerData.links.products.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url || '#'} className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Industries */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Industries</h4>
            <ul className="space-y-1">
              {footerData.links.industries.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url || '#'} className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 5: Services */}
          <div>
            <h4 className="text-[16px] font-bold text-slate-900 mb-6">Services</h4>
            <ul className="space-y-1">
              {footerData.links.services.map((link, idx) => (
                <li key={idx}>
                  <Link href={link.url || '#'} className="text-[13px] text-black hover:text-purple-700 transition-colors">
                    {link.label}
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
