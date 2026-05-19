'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MegaMenuPayload } from '@/lib/cms/mega-menu-types';

type Props = {
  data: MegaMenuPayload;
  onNavigate?: () => void;
};

export function MegaMenuMobile({ data, onNavigate }: Props) {
  const [openCategoryId, setOpenCategoryId] = React.useState<string | null>(null);
  const [openSubId, setOpenSubId] = React.useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className="pl-4 flex flex-col gap-2 border-l-2 border-slate-100 overflow-hidden"
    >
      {data.categories.map((cat) => (
        <motion.div key={cat.id} className="flex flex-col">
          <button
            type="button"
            onClick={() =>
              setOpenCategoryId((prev) => (prev === cat.id ? null : cat.id))
            }
            className="flex items-center justify-between text-left text-slate-600 hover:text-[#4B2A63] py-1 font-medium"
          >
            <span>{cat.name}</span>
            <ChevronDown
              className={cn(
                'w-4 h-4 transition-transform',
                openCategoryId === cat.id && 'rotate-180'
              )}
            />
          </button>
          <AnimatePresence>
            {openCategoryId === cat.id && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="pl-3 flex flex-col gap-1 mt-1"
              >
                {cat.subCategories.map((sub) => (
                  <div key={sub.id}>
                    <button
                      type="button"
                      onClick={() =>
                        setOpenSubId((prev) => (prev === sub.id ? null : sub.id))
                      }
                      className="flex items-center justify-between w-full text-left text-sm text-slate-500 py-1"
                    >
                      <span>{sub.name}</span>
                      {sub.subSubCategories.length > 0 && (
                        <ChevronDown
                          className={cn(
                            'w-3.5 h-3.5 transition-transform',
                            openSubId === sub.id && 'rotate-180'
                          )}
                        />
                      )}
                    </button>
                    <AnimatePresence>
                      {openSubId === sub.id && sub.subSubCategories.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          className="pl-3 flex flex-col gap-1 pb-2"
                        >
                          {sub.subSubCategories.map((leaf) => (
                            <Link
                              key={leaf.id}
                              href={leaf.href}
                              onClick={onNavigate}
                              className="text-sm text-slate-500 hover:text-[#4B2A63]"
                            >
                              {leaf.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                    {sub.subSubCategories.length === 0 && (
                      <Link
                        href={sub.href}
                        onClick={onNavigate}
                        className="pl-3 text-sm text-slate-500 hover:text-[#4B2A63] block py-0.5"
                      >
                        View
                      </Link>
                    )}
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </motion.div>
  );
}
