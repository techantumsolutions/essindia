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
import { usePathname } from 'next/navigation';
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
import { Menu, X, Search, ChevronDown } from 'lucide-react';

export type NavItem = {
  id: string;
  label: string;
  url?: string | null;
  megaMenuEnabled?: boolean;
  megaMenuConfig?: any;
  children?: NavItem[];
  megaMenu?: MegaMenuPayload;
};

export function Header({
  navData = [],
  logoUrl = '/footer-logo.png',
  getStartedText = 'Get started',
  getStartedLink = '/contact-us',
}: {
  navData?: NavItem[];
  logoUrl?: string;
  getStartedText?: string;
  getStartedLink?: string;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [expandedMobileItems, setExpandedMobileItems] = React.useState<Record<string, boolean>>({});
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();

  const toggleMobileItem = (itemId: string) => {
    setExpandedMobileItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  React.useEffect(() => {
    setIsMobileMenuOpen(false);
    setExpandedMobileItems({});
  }, [pathname]);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed inset-x-0 z-50 transition-all duration-500 ease-[0.22, 1, 0.36, 1] top-0"
    )}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "w-full transition-all duration-500 ease-[0.22, 1, 0.36, 1]",
          "bg-white py-3 shadow-[0_4px_25px_-5px_rgba(0,0,0,0.1)] border-b border-slate-200"
        )}
      >
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 md:px-8">

          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <img src={logoUrl} alt="Eastern Software Solutions Pvt.Ltd" className="h-10 w-[160px]" />
              {/* <span className="font-bold text-lg text-[#4B2A63] transition-transform duration-500 group-hover:scale-105 inline-block">EASTERN</span> */}
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex flex-1 justify-center">
            <DesktopNav items={navData} />
          </div>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* <button className="text-slate-600 hover:text-slate-900 transition-colors p-2 hover:bg-slate-50 rounded-full cursor-pointer">
              <Search className="w-5 h-5" />
            </button> */}
            <Link href={getStartedLink}>
              <Button className="bg-[#111] hover:bg-black text-white rounded-none px-6 py-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 active:scale-95 cursor-pointer">
                {getStartedText}
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden text-slate-700 p-2 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-[80px] left-4 right-4 bg-white/95 backdrop-blur-2xl rounded-none shadow-2xl border border-slate-100 p-6 flex flex-col gap-6 lg:hidden z-50"
          >
            <nav className="flex flex-col gap-4">
              {navData.map((item) => {
                const simpleLinks = item.megaMenuConfig?.links || [];
                const hasSubmenu = hasRenderableMegaMenu(item.megaMenu) || simpleLinks.length > 0 || (item.children && item.children.length > 0);
                const isExpanded = !!expandedMobileItems[item.id];

                return (
                  <motion.div key={item.id} className="w-full">
                    {hasSubmenu ? (
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => toggleMobileItem(item.id)}
                          className="flex items-center justify-between text-left text-lg font-medium text-slate-800 hover:text-[#4B2A63] w-full cursor-pointer"
                        >
                          <span>{item.label}</span>
                          <ChevronDown
                            className={cn(
                              'w-5 h-5 transition-transform duration-300 text-slate-500',
                              isExpanded && 'rotate-180'
                            )}
                          />
                        </button>
                        <AnimatePresence initial={false}>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                              className="overflow-hidden"
                            >
                              {hasRenderableMegaMenu(item.megaMenu) ? (
                                <MegaMenuMobile
                                  data={item.megaMenu!}
                                  onNavigate={() => setIsMobileMenuOpen(false)}
                                />
                              ) : simpleLinks.length > 0 ? (
                                <div className="pl-4 flex flex-col gap-2 border-l-2 border-slate-100 mt-1">
                                  {simpleLinks.map((link: any, idx: number) => (
                                    <Link
                                      key={idx}
                                      href={link.url || '#'}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="text-slate-600 hover:text-[#4B2A63] transition-colors py-1 block text-base"
                                    >
                                      {link.label}
                                    </Link>
                                  ))}
                                </div>
                              ) : (
                                <div className="pl-4 flex flex-col gap-2 border-l-2 border-slate-100 mt-1">
                                  {item.children!.map((child) => (
                                    <Link
                                      key={child.id}
                                      href={child.url || '#'}
                                      onClick={() => setIsMobileMenuOpen(false)}
                                      className="text-slate-600 hover:text-[#4B2A63] transition-colors py-1 block text-base"
                                    >
                                      {child.label}
                                    </Link>
                                  ))}
                                </div>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <Link
                        href={item.url || '#'}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium text-slate-800 hover:text-[#4B2A63] transition-colors block py-0.5"
                      >
                        {item.label}
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-100">
              <Link href={getStartedLink} onClick={() => setIsMobileMenuOpen(false)} className="w-full block">
                <Button className="w-full bg-[#111] hover:bg-black text-white rounded-none py-2 px-6 transition-all duration-300 hover:shadow-xl font-medium">
                  {getStartedText}
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function DesktopNav({ items = [] }: { items: NavItem[] }) {
  const [value, setValue] = React.useState<string>("");
  const pathname = usePathname();

  React.useEffect(() => {
    setValue("");
  }, [pathname]);

  return (
    <NavigationMenu align="center" value={value} onValueChange={setValue}>
      <NavigationMenuList className="gap-2">
        {items.map((item) => {
          const isDropdown = item.megaMenuConfig?.displayType === 'dropdown';
          const simpleLinks = item.megaMenuConfig?.links || [];

          return (
            <NavigationMenuItem key={item.id} value={item.id}>
              {hasRenderableMegaMenu(item.megaMenu) ? (
                isDropdown ? (
                  <>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium cursor-pointer">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                        className="w-[280px] bg-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col p-3 overflow-hidden border border-slate-100"
                      >
                        <ul className="flex flex-col gap-1">
                          {item.megaMenu!.categories.map((cat) => (
                            <li key={cat.id}>
                              <NavigationMenuLink
                                render={<Link href={cat.href || '#'} />}
                                className="block select-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#4B2A63] hover:bg-[#F3EFFF] transition-colors cursor-pointer"
                              >
                                {cat.name}
                              </NavigationMenuLink>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    </NavigationMenuContent>
                  </>
                ) : (
                  <>
                    <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium cursor-pointer">
                      {item.label}
                    </NavigationMenuTrigger>
                    <MegaMenuContent data={item.megaMenu!} />
                  </>
                )
              ) : simpleLinks.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium cursor-pointer">
                    {item.label}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                      className="w-[280px] bg-white rounded-[20px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col p-3 overflow-hidden border border-slate-100"
                    >
                      <ul className="flex flex-col gap-1">
                        {simpleLinks.map((link: any, idx: number) => (
                          <li key={idx}>
                            <NavigationMenuLink
                              render={<Link href={link.url || '#'} />}
                              className="block select-none rounded-xl px-4 py-3 text-sm font-medium text-slate-700 hover:text-[#4B2A63] hover:bg-[#F3EFFF] transition-colors cursor-pointer"
                            >
                              {link.label}
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  </NavigationMenuContent>
                </>
              ) : item.children && item.children.length > 0 ? (
                <>
                  <NavigationMenuTrigger className="bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium cursor-pointer">
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
                <NavigationMenuLink render={<Link href={item.url || '#'} />} className={cn(navigationMenuTriggerStyle(), "bg-transparent hover:bg-slate-50 text-[13px] text-slate-700 font-medium cursor-pointer")}>
                  {item.label}
                </NavigationMenuLink>
              )}
            </NavigationMenuItem>
          );
        })}
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

