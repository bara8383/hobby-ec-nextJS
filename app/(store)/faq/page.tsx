import Link from 'next/link';
import { buildFaqMetadata } from '@/lib/seo/metadata';
import { buildFaqJsonLd } from '@/lib/seo/jsonld';

export const metadata = buildFaqMetadata();

const faqs = {
  beforePurchase: [
    {
      question: '商用利用は可能ですか？',
      answer: '商品ごとのライセンス条件に従って商用利用できます。詳細は商品ページをご確認ください。'
    },
    {
      question: '支払い方法は何がありますか？',
      answer: '現在はクレジットカード決済に対応しています。'
    }
  ],
  afterPurchase: [
    {
      question: '購入後はすぐにダウンロードできますか？',
      answer: '決済完了後にマイページの購入済みライブラリから即時ダウンロードできます。'
    },
    {
      question: '返品・キャンセルはできますか？',
      answer: 'デジタル商品の性質上、購入確定後の返品・キャンセルは原則お受けしていません。'
    }
  ]
};

export default function FaqPage() {
  const faqJsonLd = buildFaqJsonLd([...faqs.beforePurchase, ...faqs.afterPurchase]);

  return (
    <main>
      <h1>よくある質問</h1>
      <p className="section-description">購入前後によくある質問を、テーマごとに短く整理しています。</p>

      <section className="faq-list" aria-label="購入前の質問">
        <h2>購入前の確認</h2>
        {faqs.beforePurchase.map((faq) => (
          <article key={faq.question} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="faq-list" aria-label="購入後の質問">
        <h2>購入後の確認</h2>
        {faqs.afterPurchase.map((faq) => (
          <article key={faq.question} className="faq-item">
            <h3>{faq.question}</h3>
            <p>{faq.answer}</p>
          </article>
        ))}
      </section>

      <section className="chat-cta-band" aria-label="FAQからチャットへの導線">
        <h2>解決しない場合はチャットへ</h2>
        <p>注文前後の疑問をオペレーターに直接相談できます。</p>
        <Link className="button-link" href="/chat">
          チャットで相談する
        </Link>
      </section>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
    </main>
  );
}
