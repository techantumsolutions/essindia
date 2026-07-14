'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { PageCreateWizard, type PageCreateFormData } from '../PageCreateWizard';

export default function NewPageModule() {
  const router = useRouter();
  const [templates, setTemplates] = React.useState<
    Array<{ id: string; name: string; templateSections?: unknown[] }>
  >([]);
  const [loadingTemplates, setLoadingTemplates] = React.useState(true);

  React.useEffect(() => {
    fetch('/api/admin/templates', { credentials: 'same-origin' })
      .then(async (res) => {
        if (res.ok) {
          setTemplates(await res.json());
        }
      })
      .catch((e) => {
        console.error('Failed to load templates', e);
      })
      .finally(() => setLoadingTemplates(false));
  }, []);

  const handleCreate = async (form: PageCreateFormData) => {
    try {
      const res = await fetch('/api/admin/pages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          slug: form.slug || undefined,
          status: 'draft',
          templateId: form.templateId || null,
          navigationItemId: form.navigationItemId || null,
          categoryId: form.categoryId || null,
          megaMenuCategoryId: form.megaMenuCategoryId || null,
          megaMenuSubCategoryId: form.megaMenuSubCategoryId || null,
          megaMenuSubSubCategoryId: form.megaMenuSubSubCategoryId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create page');
      toast.success('Page created as draft');
      router.push(`/admin/pages/${data.id}`);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Failed to create page');
    }
  };

  if (loadingTemplates) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4B2A63]"></div>
      </div>
    );
  }

  return (
    <PageCreateWizard
      templates={templates}
      onSubmit={handleCreate}
      fullPage
    />
  );
}
