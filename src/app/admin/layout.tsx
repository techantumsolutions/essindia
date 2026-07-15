'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Navigation,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Search,
  Bell,
  User,
  Shield,
  Layers,
  Image as ImageIcon,
  MessageSquare,
  BarChart3,
  Globe,
  Briefcase,
  Monitor,
  ClipboardList,
  ArrowRightLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AdminProfileMenu } from '@/components/admin/AdminProfileMenu';
import { AdminNotificationMenu } from '@/components/admin/AdminNotificationMenu';
import './admin.css';

const navGroups = [
  {
    label: 'Architecture',
    items: [
      { icon: LayoutDashboard, label: 'Dashboard', href: '/admin/dashboard' },
      { icon: FileText, label: 'Pages', href: '/admin/pages' },
      { icon: Layers, label: 'Sections Library', href: '/admin/sections' },
      { icon: Briefcase, label: 'Categories', href: '/admin/categories' },
      { icon: Navigation, label: 'Navigation', href: '/admin/navigation' },
      { icon: Layers, label: 'Templates', href: '/admin/templates' },
      { icon: ClipboardList, label: 'Forms', href: '/admin/forms/definitions' },
    ]
  },
  {
    label: 'Content Assets',
    items: [
      { icon: ImageIcon, label: 'Media Library', href: '/admin/media' },
      { icon: Briefcase, label: 'Careers', href: '/admin/careers' },
      { icon: Settings, label: 'Footer Settings', href: '/admin/footer' },
      // { icon: Briefcase, label: 'Solutions', href: '/admin/solutions' },
      // { icon: Globe, label: 'Industries', href: '/admin/industries' },
      // { icon: FileText, label: 'Resources', href: '/admin/resources' },
    ]
  },
  {
    label: 'Marketing & SEO',
    items: [
      { icon: Shield, label: 'SEO Settings', href: '/admin/seo' },
      { icon: ArrowRightLeft, label: 'Redirects', href: '/admin/redirects' },
      { icon: MessageSquare, label: 'Forms', href: '/admin/forms' },
      // { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    ]
  },
  // {
  //   label: 'System',
  //   items: [
  //     { icon: User, label: 'Users & Roles', href: '/admin/users' },
  //     { icon: Settings, label: 'Settings', href: '/admin/settings' },
  //   ]
  // }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [logoUrl, setLogoUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/navigation?location=header-main', { signal: controller.signal })
      .then((response) => response.ok ? response.json() : null)
      .then((data) => setLogoUrl(data?.menu?.logoUrl || null))
      .catch((error) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error('Unable to load admin brand logo', error);
        }
      });
    return () => controller.abort();
  }, []);

  if (pathname === '/admin/login' || pathname.endsWith('/preview')) {
    return <>{children}</>;
  }

  return (
    <div className="admin-shell min-h-screen bg-[#F6F7F9] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 248 : 68 }}
        className="fixed inset-y-0 left-0 bg-[#172033] text-white z-50 flex flex-col border-r border-white/5"
      >
        {/* Brand Header */}
        <div
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="h-16 flex items-center px-4 border-b border-white/10 shrink-0 cursor-pointer hover:bg-white/5 transition-colors"
        >
          <div className={cn(
            "rounded-lg bg-white flex items-center justify-center shrink-0 overflow-hidden border border-white/10 transition-all duration-300",
            isSidebarOpen ? "w-full h-12 p-1" : "w-9 h-9 p-0.5"
          )}>
            {logoUrl ? (
              <img src={logoUrl} alt="Website logo" className="h-full w-full object-contain" />
            ) : (
              <Monitor className="w-4 h-4 text-[#4B2A63]" />
            )}
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-3 overflow-hidden whitespace-nowrap"
              >

              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-5 last:mb-0">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-5 text-[9px] font-bold text-white/35 uppercase tracking-[0.14em] mb-2"
                  >
                    {group.label}
                  </motion.h4>
                )}
              </AnimatePresence>
              <nav className="px-2.5 space-y-0.5">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      title={!isSidebarOpen ? item.label : undefined}
                      className={cn(
                        "flex items-center w-full px-3 py-2 rounded-lg transition-all duration-200 group relative cursor-pointer",
                        isActive
                          ? "bg-white/10 text-white shadow-xl shadow-black/10"
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-4 h-4 shrink-0", isActive ? "text-[#C9A7DE]" : "")} />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-3 font-medium text-[12px] whitespace-nowrap"
                          >
                            {item.label}
                          </motion.span>
                        )}
                      </AnimatePresence>
                      {isActive && isSidebarOpen && (
                        <motion.div layoutId="active-nav" className="absolute right-2 w-1.5 h-1.5 rounded-full bg-purple-400" />
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>


      </motion.aside>

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 transition-all duration-300 min-h-screen flex flex-col min-w-0",
          isSidebarOpen ? "ml-[248px]" : "ml-[68px]"
        )}
      >
        {/* Top Header */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-5 sticky top-0 z-40 backdrop-blur-md bg-white/90">
          <div className="flex items-center gap-6 flex-1">
          </div>

          <div className="flex items-center gap-4">
            <AdminNotificationMenu />
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <AdminProfileMenu />
            <button
              onClick={() => {
                document.cookie = "mock-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = '/admin/login';
              }}
              className="px-3 h-8 flex items-center justify-center rounded-md bg-rose-50 hover:bg-rose-100 transition-colors text-xs font-semibold text-rose-600 cursor-pointer"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="admin-content p-5 flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
