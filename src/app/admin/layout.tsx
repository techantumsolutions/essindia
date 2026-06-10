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
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

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
    ]
  },
  {
    label: 'Content Assets',
    items: [
      { icon: ImageIcon, label: 'Media Library', href: '/admin/media' },
      { icon: Briefcase, label: 'Careers', href: '/admin/careers' },
      { icon: Briefcase, label: 'Solutions', href: '/admin/solutions' },
      { icon: Globe, label: 'Industries', href: '/admin/industries' },
      { icon: FileText, label: 'Resources', href: '/admin/resources' },
    ]
  },
  {
    label: 'Marketing & SEO',
    items: [
      { icon: Shield, label: 'SEO Settings', href: '/admin/seo' },
      { icon: MessageSquare, label: 'Forms & Leads', href: '/admin/forms' },
      { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
    ]
  },
  {
    label: 'System',
    items: [
      { icon: User, label: 'Users & Roles', href: '/admin/users' },
      { icon: Settings, label: 'Settings', href: '/admin/settings' },
    ]
  }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  if (pathname === '/admin/login' || pathname.endsWith('/preview')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex overflow-hidden font-sans">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 80 }}
        className="fixed inset-y-0 left-0 bg-[#1A1A2E] text-white z-50 flex flex-col border-r border-white/5"
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#4B2A63] to-[#3B198F] flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/20">
            <Monitor className="w-6 h-6 text-white" />
          </div>
          <AnimatePresence>
            {isSidebarOpen && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="ml-4 font-bold text-xl tracking-tight overflow-hidden whitespace-nowrap"
              >
                ESS <span className="text-purple-400">Admin</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Groups */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden py-6 custom-scrollbar">
          {navGroups.map((group, groupIdx) => (
            <div key={groupIdx} className="mb-8 last:mb-0">
              <AnimatePresence>
                {isSidebarOpen && (
                  <motion.h4
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="px-8 text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4"
                  >
                    {group.label}
                  </motion.h4>
                )}
              </AnimatePresence>
              <nav className="px-3 space-y-1">
                {group.items.map((item) => {
                  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                  return (
                    <button
                      key={item.href}
                      onClick={() => router.push(item.href)}
                      className={cn(
                        "flex items-center w-full px-4 py-3 rounded-xl transition-all duration-300 group relative",
                        isActive 
                          ? "bg-white/10 text-white shadow-xl shadow-black/10" 
                          : "text-white/50 hover:text-white hover:bg-white/5"
                      )}
                    >
                      <item.icon className={cn("w-5 h-5 shrink-0 transition-transform group-hover:scale-110", isActive ? "text-purple-400" : "")} />
                      <AnimatePresence>
                        {isSidebarOpen && (
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="ml-4 font-semibold text-[14px] whitespace-nowrap"
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
          "flex-1 transition-all duration-300 min-h-screen flex flex-col",
          isSidebarOpen ? "ml-[280px]" : "ml-[80px]"
        )}
      >
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40 backdrop-blur-md bg-white/80">
          <div className="flex items-center gap-6 flex-1">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
            >
              {isSidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
            </button>
            <div className="max-w-md w-full relative hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Global search (⌘+K)" 
                className="w-full bg-slate-50 border border-slate-100 rounded-xl pl-12 pr-4 py-2.5 text-sm focus:bg-white focus:ring-4 focus:ring-purple-500/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors relative">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 pl-2">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-900 leading-none">Admin User</p>
                <p className="text-[11px] font-medium text-slate-400 mt-1">Super Administrator</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden border-2 border-slate-50">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="Avatar" />
              </div>
            </div>
            <button 
              onClick={() => {
                document.cookie = "mock-admin-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
                window.location.href = '/admin/login';
              }}
              className="w-10 h-10 flex items-center justify-center rounded-xl bg-rose-50 hover:bg-rose-100 transition-colors group"
            >
              <LogOut className="w-5 h-5 text-rose-500 transition-transform group-hover:scale-110" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8 flex-1">
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
