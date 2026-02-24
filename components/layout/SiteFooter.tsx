import Link from 'next/link';
import { Container } from '@/components/ui/Container';
import { getCategoryLabel } from '@/data/products';
import { getLatestProducts, listCategories, listTags } from '@/lib/db/repositories/product-repository';

const LATEST_PRODUCT_LIMIT = 8;

const staticSitemapLinks = [
  { href: '/', label: 'ホーム' },
  { href: '/products', label: '商品一覧' },
  { href: '/categories', label: 'カテゴリ一覧' },
  { href: '/tags', label: 'タグ一覧' },
  { href: '/faq', label: 'よくある質問' },
  { href: '/help', label: 'ガイド' },
  { href: '/legal/tokushoho', label: '特定商取引法に基づく表記' },
  { href: '/legal/terms', label: '利用規約' },
  { href: '/legal/privacy', label: 'プライバシーポリシー' },
  { href: '/contact', label: 'お問い合わせ' }
] as const;

export function SiteFooter() {
  const categories = listCategories();
  const tags = listTags();
  const latestProducts = getLatestProducts(LATEST_PRODUCT_LIMIT);

  return (
    <footer className="site-footer" aria-label="サイトフッター">
      <Container className="site-footer-inner">
        <section className="site-footer-section" aria-labelledby="footer-sitemap-title">
          <h2 id="footer-sitemap-title" className="site-footer-title">
            サイトマップ
          </h2>
          <nav aria-label="サイトマップリンク">
            {staticSitemapLinks.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </section>

        {categories.length > 0 ? (
          <section className="site-footer-section" aria-labelledby="footer-categories-title">
            <h3 id="footer-categories-title" className="site-footer-title">
              カテゴリ
            </h3>
            <nav aria-label="カテゴリリンク" className="site-footer-nav-list">
              {categories.map((category) => (
                <Link key={category} href={`/categories/${category}`}>
                  {getCategoryLabel(category)}
                </Link>
              ))}
            </nav>
          </section>
        ) : null}

        {tags.length > 0 ? (
          <section className="site-footer-section" aria-labelledby="footer-tags-title">
            <h3 id="footer-tags-title" className="site-footer-title">
              タグ
            </h3>
            <nav aria-label="タグリンク" className="site-footer-nav-list">
              {tags.map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>
                  #{tag}
                </Link>
              ))}
            </nav>
          </section>
        ) : null}

        {latestProducts.length > 0 ? (
          <section className="site-footer-section" aria-labelledby="footer-latest-products-title">
            <h3 id="footer-latest-products-title" className="site-footer-title">
              新着商品
            </h3>
            <nav aria-label="新着商品リンク" className="site-footer-nav-list latest-products-list">
              {latestProducts.map((product) => (
                <Link key={product.id} href={`/products/${product.slug}`}>
                  {product.name}
                </Link>
              ))}
            </nav>
          </section>
        ) : null}
      </Container>
      <Container>
        <p className="site-footer-copy">© {new Date().getFullYear()} Digital Creator Market</p>
      </Container>
    </footer>
  );
}
