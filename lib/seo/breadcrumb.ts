const SITE_ORIGIN = 'https://example.com';

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export function buildAbsoluteUrl(path: string) {
  return new URL(path, SITE_ORIGIN).toString();
}

export function buildBreadcrumbJsonLd(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildAbsoluteUrl(item.path)
    }))
  };
}
