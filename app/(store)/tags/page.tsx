import Link from 'next/link';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { allTags, getProductsByTag } from '@/data/products';
import { buildTagHubMetadata } from '@/lib/seo/metadata';

export const metadata = buildTagHubMetadata();

export default function TagsHubPage() {
  return (
    <main>
      <Breadcrumbs
        items={[
          { name: 'ホーム', path: '/' },
          { name: 'タグ一覧', path: '/tags' }
        ]}
      />
      <h1>タグ一覧</h1>
      <p className="section-description">
        人気キーワードから関連商品を横断的に比較できます。ニーズに近いタグから詳細ページへ進んでください。
      </p>
      <section className="hub-grid" aria-label="タグハブ一覧">
        {allTags.map((tag) => (
          <article key={tag} className="hub-card">
            <h2>
              <Link href={`/tags/${encodeURIComponent(tag)}`}>#{tag}</Link>
            </h2>
            <p>関連商品数: {getProductsByTag(tag).length}件</p>
          </article>
        ))}
      </section>
    </main>
  );
}
