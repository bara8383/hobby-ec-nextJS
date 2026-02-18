import { LegalPageTemplate } from '@/app/(store)/legal/LegalPageTemplate';
import { buildLegalPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildLegalPageMetadata({
  title: '特定商取引法に基づく表記',
  description: 'Digital Creator Market の特定商取引法に基づく表記です。',
  canonicalPath: '/legal/tokushoho'
});

const legalItems = [
  { label: '販売事業者', value: 'Digital Creator Market 運営事務局' },
  { label: '運営責任者', value: '山田 太郎' },
  { label: '所在地', value: '東京都渋谷区◯◯ 1-2-3（請求があった場合は遅滞なく開示）' },
  { label: 'お問い合わせ先', value: 'support@example.com（平日 10:00〜18:00）' },
  { label: '販売価格', value: '各商品ページに税込価格で表示' },
  { label: '商品代金以外の必要料金', value: 'インターネット接続に必要な通信費等はお客様負担' },
  { label: '代金の支払時期', value: '注文確定時に即時決済' },
  { label: '代金の支払方法', value: 'クレジットカード決済' },
  { label: '商品の引渡時期', value: '決済完了後、即時にダウンロード可能' },
  {
    label: '返品・キャンセル',
    value: 'デジタル商品の性質上、購入確定後の返品・キャンセルは原則としてお受けできません。'
  }
];

export default function TokushohoPage() {
  return (
    <LegalPageTemplate
      title="特定商取引法に基づく表記"
      lead="デジタルコンテンツ販売に関する法定情報を以下に掲載しています。"
      sections={legalItems}
    />
  );
}
