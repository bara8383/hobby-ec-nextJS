import { LegalPageTemplate } from '@/app/(store)/legal/LegalPageTemplate';
import { buildLegalPageMetadata } from '@/lib/seo/metadata';

export const metadata = buildLegalPageMetadata({
  title: 'プライバシーポリシー',
  description: 'Digital Creator Market の個人情報保護方針です。',
  canonicalPath: '/legal/privacy'
});

const sections = [
  {
    label: '取得する情報',
    value: '注文処理・お問い合わせ対応のために、氏名、メールアドレス、注文情報を取得します。'
  },
  {
    label: '利用目的',
    value: '商品提供、サポート対応、不正利用防止、サービス改善のために利用します。'
  },
  {
    label: '第三者提供',
    value: '法令に基づく場合を除き、本人同意なく第三者へ個人情報を提供しません。'
  },
  {
    label: '安全管理',
    value: 'アクセス制御・通信暗号化・運用監査等の安全管理措置を講じます。'
  },
  {
    label: 'お問い合わせ窓口',
    value: '個人情報に関するお問い合わせは contact@example.com までご連絡ください。'
  }
];

export default function PrivacyPage() {
  return (
    <LegalPageTemplate
      title="プライバシーポリシー"
      lead="個人情報の取り扱い方針を定めています。"
      sections={sections}
    />
  );
}
