export function matchesFilter(
  item: { category: string; type?: string },
  slug: string,
): boolean {
  if (slug === "all") return true;
  return item.category.toLowerCase().startsWith(slug.toLowerCase());
}
