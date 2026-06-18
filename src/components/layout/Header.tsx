'use client';

import * as React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MegaMenuContent } from './MegaMenuContent';
import { MegaMenuMobile } from './MegaMenuMobile';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';
import { hasRenderableMegaMenu } from '@/lib/cms/mega-menu-sanitize';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Menu, X, Search } from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  url?: string | null;
  megaMenuEnabled?: boolean;
  children?: NavItem[];
  megaMenu?: MegaMenuPayload;
};

export function Header({ navData = [] }: { navData?: NavItem[] }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed inset-x-0 z-50 flex justify-center px-4 transition-all duration-500 ease-[0.22, 1, 0.36, 1]",
      scrolled ? "top-4" : "top-8"
    )}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "flex w-full max-w-7xl items-center justify-between rounded-full px-4 md:px-8 transition-all duration-500 ease-[0.22, 1, 0.36, 1]",
          scrolled
            ? "bg-white/80 backdrop-blur-xl py-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/20"
            : "bg-white py-3 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] border border-slate-200"
        )}
      >

        {/* Logo */}
        <Link href="/" className="flex items-center group">
          <div className="relative">
            <img src="/footer-logo.png" alt="Eastern Software Solutions Pvt.Ltd" className="h-10 w-[160px]" />
            {/* <span className="font-bold text-lg text-[#4B2A63] transition-transform duration-500 group-hover:scale-105 inline-block">EASTERN</span> */}
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center">
          <DesktopNav items={navData} />
        </div>

        {/* Right Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full cursor-pointer">
            <Search className="w-5 h-5" />
          </button>
          <Button className="bg-[#111] hover:bg-black text-white rounded-full px-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer">
            Get started
          </Button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="lg:hidden text-slate-700 p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[80px] left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-100 p-6 flex flex-col gap-6 lg:hidden z-50"
          >
            <nav className="flex flex-col gap-4">
              {navData.map((item) => (
                <motion.div key={item.id}>
                  {hasRenderableMegaMenu(item.megaMenu) ? (
                    <motion.div className="flex flex-col gap-2">
                      <span className="text-lg font-medium text-[#4B2A63]">{item.label}</span>
                      <MegaMenuMobile
                        data={item.megaMenu!}
                        onNavigate={() => setIsMobileMenuOpen(false)}
                      />
                    </motion.div>
                  ) : item.children && item.children.length > 0 ? (
                    <motion.div className="flex flex-col gap-2">
                      <span className="text-lg font-medium text-[#4B2A63]">{item.label}</span>
                      <motion.div className="pl-4 flex flex-col gap-2 border-l-2 border-slate-100">
                        {item.children.map((child) => (
                          <Link
                            key={child.id}
                            href={child.url || '#'}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="text-slate-600 hover:text-[#4B2A63] transition-colors"
                          >
                            {child.label}
                          </Link>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <Link
                      href={item.url || '#'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-lg font-medium text-slate-800 hover:text-[#4B2A63] transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </motion.div>
              ))}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <Button className="w-full bg-[#111] hover:bg-black text-white rounded-full h-12 text-lg transition-all duration-300 hover:shadow-xl">
                Get started
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopNav({ items = [] }: { items: NavItem[] }) {
  return (
    <NavigationMenu align="center">
      <NavigationMenuList className="gap-2">
        {items.map((item) => (
          <NavigationMenuItem key={item.id}>
            {hasRenderableMegaMenu(item.megaMenu) ? (
              <>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium">
                  {item.label}
                </NavigationMenuTrigger>
                <MegaMenuContent data={item.megaMenu!} />
              </>
            ) : item.children && item.children.length > 0 ? (
              <>
                <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium">
                  {item.label}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <motion.div className="p-4 w-[400px]">
                    <ul className="grid gap-3">
                      {item.children.map((child) => (
                        <ListItem key={child.id} title={child.label} href={child.url ?? '#'}>
                          {(child as NavItem & { description?: string }).description || ''}
                        </ListItem>
                      ))}
                    </ul>
                  </motion.div>
                </NavigationMenuContent>
              </>
            ) : (
              <NavigationMenuLink render={<Link href={item.url || '#'} />} className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium")}>
                {item.label}
              </NavigationMenuLink>
            )}
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink
        render={<Link href={props.href || "#"} />}
        ref={ref as any}
        className={cn(
          'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-50 focus:bg-slate-50',
          className
        )}
        {...props}
      >
        <div className="text-sm font-medium leading-none text-slate-900">{title}</div>
        <p className="line-clamp-2 text-sm leading-snug text-slate-500 mt-2">
          {children}
        </p>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';

