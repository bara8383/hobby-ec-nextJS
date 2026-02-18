import { ContactForm } from '@/components/contact/ContactForm';
import { buildContactMetadata } from '@/lib/seo/metadata';

export const metadata = buildContactMetadata();

export default function ContactPage() {
  return (
    <main>
      <h1>お問い合わせ</h1>
      <p className="section-description">
        注文、商品仕様、アカウント設定などのお問い合わせを受け付けています。必要に応じてチャットもご利用ください。
      </p>
      <section className="settings-card" aria-label="お問い合わせフォーム">
        <ContactForm />
      </section>
    </main>
  );
}
