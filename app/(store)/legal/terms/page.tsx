import { LegalPageTemplate } from '@/app/(store)/legal/LegalPageTemplate';
import { buildLegalPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildLegalPageMetadata({
  title: '利用規約',
  description: 'Digital Creator Market の利用規約です。',
  canonicalPath: '/legal/terms'
});

const sections = [
  { label: '適用', value: '本規約は、当サービスの利用に関する一切の関係に適用されます。' },
  {
    label: 'アカウント管理',
    value: '利用者は自己の責任でログイン情報を管理し、第三者への共有を行わないものとします。'
  },
  {
    label: '禁止事項',
    value: '不正アクセス、再配布、著作権侵害、システム負荷を高める行為を禁止します。'
  },
  {
    label: '免責事項',
    value: '当社はサービス停止・不具合による損害について、当社に故意または重過失がある場合を除き責任を負いません。'
  },
  {
    label: '規約の変更',
    value: '必要に応じて規約を改定できるものとし、改定後は本ページで通知します。'
  }
];

export default function TermsPage() {
  return <LegalPageTemplate title="利用規約" lead="サービス利用前にご確認ください。" sections={sections} />;
}
