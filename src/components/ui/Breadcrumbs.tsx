'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href: string;
  isLast: boolean;
}

interface BreadcrumbsProps {
  path: string;
  className?: string;
}

export function Breadcrumbs({ path, className }: BreadcrumbsProps) {
  // Generate breadcrumb items from path
  const generateBreadcrumbs = (fullPath: string): BreadcrumbItem[] => {
    // Remove leading/trailing slashes and split
    const segments = fullPath.split('/').filter(Boolean);
    
    const items: BreadcrumbItem[] = segments.map((segment, index) => {
      const href = '/' + segments.slice(0, index + 1).join('/');
      // Format label: capitalize and replace dashes with spaces
      const label = segment
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
      
      return {
        label,
        href,
        isLast: index === segments.length - 1
      };
    });

    return items;
  };

  const breadcrumbs = generateBreadcrumbs(path);

  if (breadcrumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={cn("flex", className)}>
      <ol className="flex items-center space-x-2">
        <li>
          <Link 
            href="/" 
            className="text-slate-400 hover:text-[#4B2A63] transition-colors flex items-center"
          >
            <Home className="w-4 h-4" />
            <span className="sr-only">Home</span>
          </Link>
        </li>
        
        {breadcrumbs.map((item, index) => (
          <React.Fragment key={item.href}>
            <li className="flex items-center">
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 mx-1" />
            </li>
            <li>
              <Link
                href={item.href}
                className={cn(
                  "text-[13px] font-bold transition-colors",
                  item.isLast 
                    ? "text-slate-900 pointer-events-none" 
                    : "text-slate-400 hover:text-[#4B2A63]"
                )}
                aria-current={item.isLast ? 'page' : undefined}
              >
                {item.label}
              </Link>
            </li>
          </React.Fragment>
        ))}
      </ol>
    </nav>
  );
}
