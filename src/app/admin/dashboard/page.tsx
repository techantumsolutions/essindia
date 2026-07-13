'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Eye,
  FilePlus2,
  FileText,
  LayoutTemplate,
  Layers3,
  Loader2,
  Pencil,
  Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AnalyticsData {
  pages: { total: number; published: number; draft: number };
  templates: { total: number };
  sections: { total: number };
  leads: { total: number };
  topTemplates: Array<{
    id: string;
    name: string;
    description?: string | null;
    usageCount?: number;
    status?: string;
  }>;
  recentPages: Array<{
    id: string;
    title?: string | null;
    status?: string;
    createdAt: string;
    updatedAt: string;
  }>;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const controller = new AbortController();
    fetch('/api/admin/analytics', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load dashboard');
        return response.json();
      })
      .then(setData)
      .catch((error) => {
        if (error instanceof Error && error.name !== 'AbortError') {
          console.error(error);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  const stats = data ? [
    {
      label: 'Total pages',
      value: data.pages.total,
      detail: `${data.pages.published} published · ${data.pages.draft} drafts`,
      icon: FileText,
    },
    {
      label: 'Templates',
      value: data.templates.total,
      detail: 'Reusable page blueprints',
      icon: LayoutTemplate,
    },
    {
      label: 'Sections',
      value: data.sections.total,
      detail: 'Available content blocks',
      icon: Layers3,
    },
    {
      label: 'Leads',
      value: data.leads.total,
      detail: 'Form submissions',
      icon: Users,
    },
  ] : [];

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-semibold text-slate-900">CMS Dashboard</h1>
          <p className="text-slate-500">Content, publishing and website activity overview.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => window.open('/', '_blank')}>
            <Eye /> View site
          </Button>
          {/* <Button size="sm" onClick={() => router.push('/admin/pages?createPage=true')}>
            <FilePlus2 /> New page
          </Button> */}
        </div>
      </div>

      {isLoading ? (
        <div className="admin-compact-card flex items-center justify-center py-16">
          <Loader2 className="size-5 animate-spin text-[#4B2A63]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="admin-compact-card p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold tracking-tight text-slate-900">{stat.value}</p>
                </div>
                <div className="flex size-8 items-center justify-center rounded-lg bg-[#4B2A63]/8 text-[#4B2A63]">
                  <stat.icon className="size-4" />
                </div>
              </div>
              <p className="mt-2 text-[11px] text-slate-500">{stat.detail}</p>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <section className="admin-compact-card overflow-hidden xl:col-span-3">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-semibold text-slate-900">CMS Quick Access</h2>
              <p className="text-[11px] text-slate-500">Frequently used templates and actions</p>
            </div>
            <Button variant="outline" size="xs" onClick={() => router.push('/admin/templates')}>
              All templates <ArrowUpRight />
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {data?.topTemplates?.length ? data.topTemplates.slice(0, 7).map((template) => (
              <div key={template.id} className="flex items-center gap-3 px-4 py-2.5 hover:bg-slate-50/80">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[#4B2A63]">
                  <LayoutTemplate className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-slate-900">{template.name}</p>
                  <p className="truncate text-[11px] text-slate-500">
                    {template.description || 'Reusable page template'}
                  </p>
                </div>
                <span className="hidden rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-semibold uppercase text-emerald-700 sm:inline">
                  {template.status || 'active'}
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="outline"
                    size="xs"
                    onClick={() => window.open(`/admin/templates/${template.id}/preview`, '_blank')}
                  >
                    <Eye /> Preview
                  </Button>
                  {/* <Button size="xs" onClick={() => router.push(`/admin/templates/${template.id}`)}>
                    <Pencil /> Manage
                  </Button> */}
                </div>
              </div>
            )) : (
              <div className="px-4 py-10 text-center text-xs text-slate-500">No templates available.</div>
            )}
          </div>
        </section>

        <section className="admin-compact-card overflow-hidden xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
            <div>
              <h2 className="font-semibold text-slate-900">Recent updates</h2>
              <p className="text-[11px] text-slate-500">Latest content activity</p>
            </div>
            <Button variant="outline" size="xs" onClick={() => router.push('/admin/pages')}>
              View all
            </Button>
          </div>
          <div className="divide-y divide-slate-100">
            {data?.recentPages?.length ? data.recentPages.slice(0, 7).map((page) => {
              const updated = new Date(page.updatedAt).getTime() - new Date(page.createdAt).getTime() > 5000;
              return (
                <button
                  key={page.id}
                  onClick={() => router.push(`/admin/pages/${page.id}`)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-slate-50/80"
                >
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-slate-100">
                    {updated ? <Clock3 className="size-3.5 text-slate-500" /> : <CheckCircle2 className="size-3.5 text-emerald-600" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-slate-900">{page.title || 'Untitled page'}</p>
                    <p className="text-[10px] text-slate-500">
                      {updated ? 'Updated' : 'Created'} · {new Date(updated ? page.updatedAt : page.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <ArrowUpRight className="size-3.5 text-slate-400" />
                </button>
              );
            }) : (
              <div className="px-4 py-10 text-center text-xs text-slate-500">No recent activity.</div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
