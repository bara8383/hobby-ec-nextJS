# Next.js最新設計思想で作る学習用EC（デジタル素材）

> 優先順位: **1) App Router + Server Components設計** > **2) SEO** > **3) リアルタイムチャット**

このドキュメントは、壁紙・写真・アイコンを扱う**学習用ポートフォリオEC**を、Next.js公式推奨に沿って組み立てるための実装ガイドです。

---

## 1. 公式推奨に合わせた設計方針（重要）

- App Router の `app/` を中心にルーティングを組む。
- ページは基本 **Server Components**（デフォルト）で作る。
- ユーザー操作（入力、ボタン、チャットUIなど）だけ `"use client"` を使う。
- SEO は `head.tsx` より **`metadata` / `generateMetadata`** を優先（現行推奨）。
- 商品一覧/詳細は JSON-LD（`ItemList`, `Product`）を埋め込む。

---

## 2. 推奨フォルダ構成（App Router）

```txt
src/
  app/
    layout.tsx
    page.tsx
    products/
      layout.tsx
      page.tsx
      [id]/
        page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
    purchase/
      success/
        [orderId]/
          page.tsx
    chat/
      page.tsx
    api/
      chat/
        route.ts
      stripe/
        route.ts
  actions/
    cartActions.ts
    orderActions.ts
  components/
    layout/
      Header.tsx
    ui/
      Button.tsx
    AddToCartButton.tsx
    ChatWidget.tsx
    JsonLd.tsx
    ProductCard.tsx
  lib/
    products.ts
    cart.ts
    orders.ts
    seo.ts
    chatStore.ts
  types/
    index.ts
```

> 補足: 以前の `head.tsx` 方式は学習参考として理解してOKですが、現行実装では metadata API を中心にするのが安全です。

---

## 3. セットアップコマンド

```bash
npx create-next-app@latest digital-assets-ec \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd digital-assets-ec
npm run dev
```

---

## 4. ページ設計（要点）

### Home: `src/app/page.tsx`
- サイト説明、人気素材、カテゴリ導線を配置。
- Server ComponentでレンダリングしてSEOの初期HTMLを確保。

### Product List: `src/app/products/page.tsx`
- Server Component内で商品一覧取得。
- `metadata` で一覧向けタイトル/description/OGを設定。
- `ItemList` JSON-LD を出力。

### Product Detail: `src/app/products/[id]/page.tsx`
- `generateMetadata` で商品ごとにSEO情報を動的生成。
- `Product` JSON-LD を出力。
- カート追加ボタンは Server Action を使う。

### Cart / Checkout
- カートは Cookie + Server Action で更新。
- checkoutで購入確定後、完了ページへ遷移。
- デジタル商品なので、完了ページでダウンロードリンクを表示。

### Chat（優先度低）
- 最小実装: `app/api/chat/route.ts` + Client polling。
- 将来的にSSE/WebSocketへ拡張可能。

---

## 5. 実装コード（ページ/コンポーネント単位）

### `src/lib/products.ts`

```ts
export type Product = {
  id: string;
  title: string;
  description: string;
  category: "wallpaper" | "photo" | "icon";
  price: number;
  image: string;
  downloadFile: string;
};

const PRODUCTS: Product[] = [
  {
    id: "aurora-wallpaper-4k",
    title: "Aurora Wallpaper 4K",
    description: "高解像度のオーロラ壁紙セット（4枚）。",
    category: "wallpaper",
    price: 1200,
    image: "/images/aurora.jpg",
    downloadFile: "/downloads/aurora-pack.zip",
  },
  {
    id: "city-night-photo-pack",
    title: "City Night Photo Pack",
    description: "夜景写真10枚の商用利用可能パック。",
    category: "photo",
    price: 1800,
    image: "/images/city-night.jpg",
    downloadFile: "/downloads/city-night-pack.zip",
  },
];

export async function getProducts() {
  return PRODUCTS;
}

export async function getProductById(id: string) {
  return PRODUCTS.find((p) => p.id === id) ?? null;
}
```

### `src/lib/seo.ts`

```ts
import type { Metadata } from "next";

const SITE = "Digital Assets EC";
const BASE = "https://example.com";

export function createMetadata(input: {
  title: string;
  description: string;
  path: string;
  image: string;
}): Metadata {
  const url = `${BASE}${input.path}`;
  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: url },
    openGraph: {
      title: input.title,
      description: input.description,
      url,
      siteName: SITE,
      images: [{ url: input.image }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: input.title,
      description: input.description,
      images: [input.image],
    },
  };
}
```

### `src/components/JsonLd.tsx`

```tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

### `src/app/products/page.tsx`

```tsx
import { getProducts } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import JsonLd from "@/components/JsonLd";
import ProductCard from "@/components/ProductCard";

export const metadata = createMetadata({
  title: "商品一覧",
  description: "壁紙・写真・アイコンのデジタル素材一覧",
  path: "/products",
  image: "https://example.com/og/products.jpg",
});

export default async function ProductsPage() {
  const products = await getProducts();
  return (
    <section className="space-y-6">
      <h1 className="text-3xl font-bold">商品一覧</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `https://example.com/products/${p.id}`,
            name: p.title,
          })),
        }}
      />
    </section>
  );
}
```

### `src/app/products/[id]/page.tsx`

```tsx
import { notFound } from "next/navigation";
import { getProductById } from "@/lib/products";
import { createMetadata } from "@/lib/seo";
import AddToCartButton from "@/components/AddToCartButton";
import JsonLd from "@/components/JsonLd";

export async function generateMetadata({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) {
    return createMetadata({
      title: "商品が見つかりません",
      description: "指定された商品は存在しません。",
      path: `/products/${params.id}`,
      image: "https://example.com/og/not-found.jpg",
    });
  }
  return createMetadata({
    title: product.title,
    description: product.description,
    path: `/products/${product.id}`,
    image: `https://example.com${product.image}`,
  });
}

export default async function ProductDetailPage({ params }: { params: { id: string } }) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  return (
    <article className="space-y-4">
      <h1 className="text-3xl font-bold">{product.title}</h1>
      <p>{product.description}</p>
      <p className="text-2xl font-semibold">¥{product.price.toLocaleString()}</p>
      <AddToCartButton product={product} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.title,
          description: product.description,
          sku: product.id,
          image: `https://example.com${product.image}`,
          offers: {
            "@type": "Offer",
            priceCurrency: "JPY",
            price: product.price,
            availability: "https://schema.org/InStock",
            url: `https://example.com/products/${product.id}`,
          },
        }}
      />
    </article>
  );
}
```

### `src/app/purchase/success/[orderId]/page.tsx`（ダウンロードリンク）

```tsx
import { notFound } from "next/navigation";
import { getOrderById } from "@/lib/orders";

export default async function PurchaseSuccessPage({ params }: { params: { orderId: string } }) {
  const order = await getOrderById(params.orderId);
  if (!order) notFound();

  return (
    <section className="space-y-4">
      <h1 className="text-3xl font-bold">購入完了</h1>
      <ul className="list-disc pl-5">
        {order.items.map((item) => (
          <li key={`${item.title}-${item.downloadFile}`}>
            {item.title}: <a href={item.downloadFile} className="underline">ダウンロード</a>
          </li>
        ))}
      </ul>
    </section>
  );
}
```

### `src/app/api/chat/route.ts`（簡易チャットAPI）

```ts
import { NextResponse } from "next/server";
import { addMessage, listMessages } from "@/lib/chatStore";

export async function GET() {
  return NextResponse.json({ messages: listMessages() });
}

export async function POST(req: Request) {
  const body = await req.json();
  const text = String(body.text || "").trim();
  if (!text) return NextResponse.json({ error: "text is required" }, { status: 400 });
  addMessage("guest", text);
  return NextResponse.json({ ok: true });
}
```

---

## 6. 実装時の注意点

- フォルダ名がURLに直結するため、命名はSEOを意識する。
- Client Component化は最小限に留める（カートUI、チャット入力などのみ）。
- APIは `app/api/**/route.ts` で定義する。
- 商品詳細は特に `generateMetadata` と構造化データを丁寧に作る。

---

## 7. Codex向け補足プロンプト（そのまま追記可能）

```txt
・フォルダ構成は App Router のルーティングと一致させること（/src/app/...）。
・各ページは可能な限り Server Components とし、SEO を最適化した metadata を含むこと。
・商品一覧・詳細はそれぞれ route group/layout を活用し、商品詳細は generateMetadata を使うこと。
・Cart と Checkout はクライアントインタラクションが多いので、必要部分に "use client" を明示すること。
・チャット機能は簡易実装（Route Handler + polling）でも可。Client Components を主に使用すること。
```

---

## 8. 動作確認

```bash
npm install
npm run dev
# /products, /products/[id], /cart, /checkout, /purchase/success/[orderId], /chat を確認
```
