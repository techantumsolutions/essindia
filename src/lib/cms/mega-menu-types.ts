export type MegaMenuLeaf = {
  id: string;
  name: string;
  slug: string;
  href: string;
};

export type MegaMenuSubCategory = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  href: string;
  subSubCategories: MegaMenuLeaf[];
};

export type MegaMenuCategory = {
  id: string;
  name: string;
  slug: string;
  pageId?: string | null;
  href?: string;
  subCategories: MegaMenuSubCategory[];
};

export type MegaMenuPayload = {
  navigationItemId: string;
  navSlug: string;
  label: string;
  categories: MegaMenuCategory[];
};

export type MegaMenusByNavId = Record<string, MegaMenuPayload>;
