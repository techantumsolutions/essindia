'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NavigationMenuContent, NavigationMenuLink } from '@/components/ui/navigation-menu';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';
import { hasRenderableMegaMenu } from '@/lib/cms/mega-menu-sanitize';

type Props = {
  data: MegaMenuPayload;
};

export function MegaMenuContent({ data }: Props) {
  if (!hasRenderableMegaMenu(data)) {
    return null;
  }

  const { categories, navigationItemId } = data;
  const [activeTabId, setActiveTabId] = React.useState(() => {
    const firstWithSubs = categories.find((c) => c.subCategories && c.subCategories.length > 0);
    return firstWithSubs?.id ?? categories[0]?.id ?? '';
  });
  const activeCategory = categories.find((c) => c.id === activeTabId);
  const [activeSubId, setActiveSubId] = React.useState(
    activeCategory?.subCategories[0]?.id ?? ''
  );

  React.useEffect(() => {
    const cat = categories.find((c) => c.id === activeTabId);
    const firstSub = cat?.subCategories[0];
    if (firstSub) setActiveSubId(firstSub.id);
  }, [activeTabId, categories]);

  const activeSub = activeCategory?.subCategories.find((s) => s.id === activeSubId);
  const leaves = activeSub?.subSubCategories ?? [];
  const showRightPanel = leaves.length > 0;
  const tabLayoutId = `mega-tab-${navigationItemId}`;

  return (
    <NavigationMenuContent>
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-[1000px] bg-white rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] flex flex-col overflow-hidden border border-slate-100"
      >
        {categories.length > 1 && (
          <motion.div className="flex items-center gap-10 border-b border-slate-50 px-12 pt-6 overflow-x-auto">
            {categories.map((tab) => {
              const hasSubs = tab.subCategories && tab.subCategories.length > 0;
              const hasPage = !!tab.pageId;

              if (hasPage) {
                return (
                  <Link
                    key={tab.id}
                    href={tab.href || '#'}
                    onMouseEnter={() => setActiveTabId(tab.id)}
                    className={cn(
                      'pb-4 text-[11px] font-bold transition-colors relative tracking-[0.05em] uppercase cursor-pointer whitespace-nowrap',
                      activeTabId === tab.id ? 'text-[#4B2A63]' : 'text-slate-600 hover:text-[#4B2A63]'
                    )}
                  >
                    {tab.name}
                    {activeTabId === tab.id && (
                      <motion.div
                        layoutId={tabLayoutId}
                        className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4B2A63] rounded-t-full"
                      />
                    )}
                  </Link>
                );
              }

              if (!hasSubs) {
                return (
                  <span
                    key={tab.id}
                    className="pb-4 text-[11px] font-bold tracking-[0.05em] uppercase whitespace-nowrap text-slate-400"
                  >
                    {tab.name}
                  </span>
                );
              }

              return (
                <button
                  key={tab.id}
                  type="button"
                  onMouseEnter={() => setActiveTabId(tab.id)}
                  className={cn(
                    'pb-4 text-[11px] font-bold transition-colors relative tracking-[0.05em] uppercase cursor-pointer whitespace-nowrap',
                    activeTabId === tab.id ? 'text-[#4B2A63]' : 'text-slate-600 hover:text-[#4B2A63]'
                  )}
                >
                  {tab.name}
                  {activeTabId === tab.id && (
                    <motion.div
                      layoutId={tabLayoutId}
                      className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#4B2A63] rounded-t-full"
                    />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}

        <div className="flex min-h-[350px]">
          <motion.div
            className={cn(
              'border-r border-slate-50 p-6',
              showRightPanel ? 'w-[30%]' : 'w-full'
            )}
          >
            <div className="flex flex-col gap-1">
              {(activeCategory?.subCategories ?? []).map((sub) => {
                const hasPage = !!sub.pageId;

                if (hasPage) {
                  return (
                    <Link
                      key={sub.id}
                      href={sub.href}
                      onMouseEnter={() => setActiveSubId(sub.id)}
                      className={cn(
                        'text-left p-4 rounded-xl transition-all cursor-pointer block',
                        activeSubId === sub.id
                          ? 'bg-[#F3EFFF] translate-x-1'
                          : 'hover:bg-slate-50 hover:translate-x-1'
                      )}
                    >
                      <h4
                        className={cn(
                          'text-[12px] font-bold tracking-tight',
                          activeSubId === sub.id ? 'text-[#4B2A63]' : 'text-slate-800'
                        )}
                      >
                        {sub.name}
                      </h4>
                      {sub.description && (
                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-normal">
                          {sub.description}
                        </p>
                      )}
                    </Link>
                  );
                }

                return (
                  <div
                    key={sub.id}
                    onMouseEnter={() => setActiveSubId(sub.id)}
                    className={cn(
                      'text-left p-4 rounded-xl transition-all cursor-pointer block',
                      activeSubId === sub.id
                        ? 'bg-[#F3EFFF] translate-x-1'
                        : 'hover:bg-slate-50 hover:translate-x-1'
                    )}
                  >
                    <h4
                      className={cn(
                        'text-[12px] font-bold tracking-tight',
                        activeSubId === sub.id ? 'text-[#4B2A63]' : 'text-slate-800'
                      )}
                    >
                      {sub.name}
                    </h4>
                    {sub.description && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-normal">
                        {sub.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.div>

          {showRightPanel && (
            <motion.div className="w-[60%] p-4">
              <motion.div
                key={`${activeTabId}-${activeSubId}`}
                initial={{ opacity: 0, x: 8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="grid grid-cols-4 gap-y-2 gap-x-2"
              >
                {leaves
                  .filter((leaf) => !!leaf.pageId)
                  .map((leaf) => (
                    <NavigationMenuLink
                      key={leaf.id}
                      render={<Link href={leaf.href} />}
                      className="block"
                    >
                      <span className="text-[13px] text-slate-500 hover:text-[#4B2A63] transition-colors cursor-pointer font-normal block p-2 rounded-lg hover:bg-slate-50">
                        {leaf.name}
                      </span>
                    </NavigationMenuLink>
                  ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </NavigationMenuContent>
  );
}
