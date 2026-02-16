import type { Metadata } from 'next';
import { getProductBySlug } from '@/data/products';
import { getOrderItemForUser } from '@/lib/db/repositories/order-repository';
import {
  getDownloadGrantByOrderItem,
  getRemainingDownloadCount,
  issueDownloadGrant
} from '@/lib/db/repositories/download-grant-repository';
import { DownloadLinkPanel } from '@/components/library/DownloadLinkPanel';

type Props = {
  params: Promise<{ orderItemId: string }>;
};

export const metadata: Metadata = {
  title: 'ダウンロード発行',
  description: '購入済み商品のダウンロードURLを発行するページです。',
  robots: {
    index: false,
    follow: false
  }
};

export default async function LibraryDownloadPage({ params }: Props) {
  const { orderItemId } = await params;
  const userId = 'user-demo';

  const item = getOrderItemForUser(orderItemId, userId);

  if (!item) {
    return (
      <main>
        <h1>ダウンロード発行</h1>
        <p>対象商品が見つからないか、アクセス権限がありません。</p>
      </main>
    );
  }

  const product = getProductBySlug(item.productSlug);
  const grant = getDownloadGrantByOrderItem(orderItemId, userId) ??
    issueDownloadGrant({ orderItemId, userId }).grant;

  const remainingCount = getRemainingDownloadCount(orderItemId, userId);

  return (
    <main>
      <h1>ダウンロード発行</h1>
      <p>商品: {product?.name ?? item.productSlug}</p>
      <p>再ダウンロード期限: {new Date(grant.expiresAt).toLocaleString('ja-JP')}</p>
      <p>
        残ダウンロード回数: {remainingCount}/{grant.maxDownloadCount}
      </p>
      <DownloadLinkPanel orderItemId={orderItemId} />
    </main>
  );
}
