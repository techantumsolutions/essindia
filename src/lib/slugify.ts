/**
 * Converts a string into a URL-friendly slug.
 * Example: "Microsoft .NET Backend Developer" → "microsoft-net-backend-developer"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // remove special chars except spaces and hyphens
    .trim()
    .replace(/\s+/g, '-')         // replace spaces with hyphens
    .replace(/-+/g, '-');         // collapse multiple hyphens
}

/**
 * Generates a unique slug by appending a suffix if the base slug is taken.
 * Provide a checker function that returns true if the slug already exists.
 */
export async function uniqueSlug(
  base: string,
  exists: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = slugify(base);
  if (!(await exists(baseSlug))) return baseSlug;
  let counter = 2;
  while (await exists(`${baseSlug}-${counter}`)) {
    counter++;
  }
  return `${baseSlug}-${counter}`;
}
