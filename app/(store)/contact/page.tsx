import Link from 'next/link';
import { ContactForm } from '@/components/contact/ContactForm';
import { buildContactMetadata } from '@/lib/seo/metadata';

export const metadata = buildContactMetadata();

export default function ContactPage() {
  return (
    <main>
      <h1>お問い合わせ</h1>
      <p className="section-description">
        注文、商品仕様、ライセンス、アカウント設定に関する問い合わせを受け付けています。送信前にFAQとヘルプを確認すると、回答を早く確認できます。
      </p>

      <section className="hub-grid" aria-label="事前確認の案内">
        <article className="hub-card">
          <h2>購入前の質問</h2>
          <p>ライセンス、支払い方法、利用シーンは FAQ で確認できます。</p>
          <Link href="/faq">FAQを見る</Link>
        </article>
        <article className="hub-card">
          <h2>規約と法定表記</h2>
          <p>返品条件や法定情報は Legal ページで確認できます。</p>
          <Link href="/legal/terms">利用規約を見る</Link>
        </article>
      </section>

      <section className="settings-card" aria-label="お問い合わせフォーム">
        <h2>お問い合わせフォーム</h2>
        <ContactForm />
      </section>
    </main>
  );
}
