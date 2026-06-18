export type NavigationTreePageRef = {
  id: string;
  title: string;
  fullPath: string;
  status: string;
} | null;

export type NavigationTreeSubSub = {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  pageId?: string | null;
  page: NavigationTreePageRef;
};

export type NavigationTreeSub = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  orderIndex: number;
  pageId?: string | null;
  page: NavigationTreePageRef;
  subSubCategories: NavigationTreeSubSub[];
};

export type NavigationTreeCategory = {
  id: string;
  name: string;
  slug: string;
  orderIndex: number;
  pageId?: string | null;
  page?: NavigationTreePageRef;
  href?: string;
  subCategories: NavigationTreeSub[];
};

export type NavigationTreeChild = {
  id: string;
  label: string;
  url: string | null;
  orderIndex: number;
};

export type NavigationTreeItem = {
  id: string;
  label: string;
  slug: string;
  url: string | null;
  megaMenuEnabled: boolean;
  orderIndex: number;
  categories: NavigationTreeCategory[];
  children?: NavigationTreeChild[];
};

export type NavigationHierarchyForPageCreation = {
  items: NavigationTreeItem[];
};
