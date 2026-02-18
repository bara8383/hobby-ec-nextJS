import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { getCategoryLabel, getProductsByCategory, PRODUCT_CATEGORIES } from '@/data/products';
import { buildCategoryHubMetadata } from '@/lib/seo/metadata';

export const metadata = buildCategoryHubMetadata();

const CATEGORY_DESCRIPTION_FALLBACK =
  'カテゴリ内の商品をまとめて比較し、用途に合う素材を見つけられます。';

const categoryDescriptions: Record<string, string> = {
  wallpaper: 'PC・タブレット向けの高解像度壁紙素材をまとめています。',
  illustration: 'Web制作やLPで使いやすいイラスト素材を中心に掲載しています。',
  photo: '商用利用を想定した写真素材を用途別に比較できます。',
  music: '動画制作や配信で使えるBGM・効果音素材を扱っています。'
};

export default function CategoriesHubPage() {
  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: 'カテゴリ一覧', path: '/categories' }
        ]}
      />
      <h1>カテゴリ一覧</h1>
      <p className="section-description">
        制作ジャンルごとのカテゴリページから、目的に合う商品を素早く絞り込めます。
      </p>
      <section className="hub-grid" aria-label="カテゴリハブ一覧">
        {PRODUCT_CATEGORIES.map((category) => {
          const itemCount = getProductsByCategory(category).length;
          return (
            <article key={category} className="hub-card">
              <h2>
                <Link href={`/categories/${category}`}>{getCategoryLabel(category)}</Link>
              </h2>
              <p>{categoryDescriptions[category] ?? CATEGORY_DESCRIPTION_FALLBACK}</p>
              <p className="hub-meta">掲載商品数: {itemCount}件</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}
