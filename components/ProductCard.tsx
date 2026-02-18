import { getCategoryLabel, type Product } from '@/data/products';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ButtonLink } from '@/components/ui/Button';

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  return (
    <Card className="product-card" itemScope itemType="https://schema.org/Product">
      <div className="product-image-placeholder" aria-hidden="true" />
      <Badge variant="accent">{getCategoryLabel(product.category)}</Badge>
      <h2 itemProp="name">{product.name}</h2>
      <p itemProp="description">{product.description}</p>
      <Badge variant="success">即時DL</Badge>
      <ul className="tag-list" aria-label="タグ">
        {product.tags.slice(0, 2).map((tag) => (
          <li key={tag}>#{tag}</li>
        ))}
      </ul>
      <p className="sample-availability">サンプル: {product.media.length > 0 ? 'あり' : 'なし'}</p>
      <p className="price" itemProp="offers" itemScope itemType="https://schema.org/Offer">
        <span itemProp="priceCurrency" content="JPY" />¥
        <span itemProp="price">{product.priceJpy.toLocaleString('ja-JP')}</span>
      </p>
      <p>
        <ButtonLink href={`/products/${product.slug}`} variant="secondary">
          詳細を見る
        </ButtonLink>
      </p>
    </Card>
  );
}
