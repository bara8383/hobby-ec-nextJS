import Link from 'next/link';
import { buildBreadcrumbJsonLd, type BreadcrumbItem } from '@/lib/seo/breadcrumb';

type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  const jsonLd = buildBreadcrumbJsonLd(items);

  return (
    <>
      <nav className="breadcrumb" aria-label="パンくず">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <span key={`${item.path}-${index}`}>
              {index > 0 ? ' / ' : null}
              {isLast ? <span aria-current="page">{item.name}</span> : <Link href={item.path}>{item.name}</Link>}
            </span>
          );
        })}
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
