import type { MegaMenuPayload, MegaMenuCategory } from '@/lib/cms/mega-menu-types';

/** Returns true when mega menu has renderable CMS content for the public site. */
export function hasRenderableMegaMenu(data: MegaMenuPayload | null | undefined): boolean {
  if (!data?.categories?.length) return false;
  return data.categories.some(
    (cat) => cat.subCategories.length > 0
  );
}

/** Strip empty branches — public site must never show placeholder structure. */
export function sanitizeMegaMenuPayload(data: MegaMenuPayload): MegaMenuPayload | null {
  const categories: MegaMenuCategory[] = data.categories
    .map((cat) => {
      const subCategories = cat.subCategories
        .map((sub) => ({
          ...sub,
          subSubCategories: sub.subSubCategories.filter((leaf) => leaf.name?.trim()),
        }))
        .filter((sub) => sub.name?.trim());

      return { ...cat, subCategories };
    })
    .filter((cat) => cat.name?.trim() && cat.subCategories.length > 0);

  if (categories.length === 0) return null;

  return { ...data, categories };
}
