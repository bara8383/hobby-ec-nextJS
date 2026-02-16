import type { Metadata } from 'next';
import { getOrderItemForUser } from '@/lib/db/repositories/order-repository';
import { issueSignedDownloadUrl } from '@/lib/storage/signed-url';

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
  const item = getOrderItemForUser(orderItemId, 'user-demo');

  if (!item) {
    return (
      <main>
        <h1>ダウンロード発行</h1>
        <p>対象商品が見つからないか、アクセス権限がありません。</p>
      </main>
    );
  }

  const payload = issueSignedDownloadUrl({
    objectKey: `${item.productSlug}.zip`,
    ttlSeconds: 300
  });

  return (
    <main>
      <h1>ダウンロード発行</h1>
      <p>有効期限: {new Date(payload.expiresAt).toLocaleString('ja-JP')}</p>
      <a href={payload.url}>ダウンロード開始</a>
    </main>
  );
}
