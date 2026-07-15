import { createElement, type HTMLAttributes, type ReactNode } from 'react';

export type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const ALLOWED: HeadingLevel[] = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export function resolveHeadingTag(
  tag: string | undefined | null,
  fallback: HeadingLevel
): HeadingLevel {
  const normalized = (tag || '').toLowerCase().trim() as HeadingLevel;
  return ALLOWED.includes(normalized) ? normalized : fallback;
}

interface CmsHeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  tag?: string | null;
  fallback?: HeadingLevel;
  children: ReactNode;
}

/** Renders H1–H6 from CMS while preserving existing defaults when unset. */
export function CmsHeading({
  tag,
  fallback = 'h2',
  children,
  ...rest
}: CmsHeadingProps) {
  const Tag = resolveHeadingTag(tag, fallback);
  return createElement(Tag, rest, children);
}
