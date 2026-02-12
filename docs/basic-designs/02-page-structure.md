# 02. ページ構成例（SEO重視）

## 全体ページマップ

```txt
/                              # Home（カテゴリ導線 + 新着/人気）
/products                      # 商品一覧（カテゴリ/価格帯フィルタ）
/products/[id]                 # 商品詳細（購入 CTA + FAQ + 構造化データ）
/cart                          # カート
/checkout                      # 決済
/purchase/success/[orderId]    # 購入完了 + ダウンロード
/chat                          # チャット（別導線）
```

---

## ページ別の実装方針

### `/` Home
- 役割: サイトのテーマ説明、カテゴリ導線、内部リンクの起点。
- 実装: Server Component。
- SEO: `WebSite` JSON-LD + 主要カテゴリへの内部リンク強化。

### `/products` 商品一覧
- 役割: 商品発見性を高めるハブページ。
- 実装: Server Component + `ItemList` JSON-LD。
- SEO: index 対象、description にカテゴリ網羅ワードを含める。

### `/products/[id]` 商品詳細
- 役割: CV 直前ページ。
- 実装: `generateMetadata` + `Product` JSON-LD + FAQ（任意）。
- SEO: canonical 明示、OG 画像最適化、在庫や価格を構造化データに反映。

### `/cart` `/checkout`
- 役割: コンバージョン導線。
- 実装: Server Actions 中心。
- SEO: 通常は `noindex` 方針（重複/低付加価値回避）。

### `/purchase/success/[orderId]`
- 役割: 購入後導線（DL と再訪導線）。
- SEO: 原則 `noindex`。

### `/chat`
- 役割: 問い合わせ・購入支援。
- 実装: Client Component 主体（分離済みルート）。
- SEO: 直接的な評価より、離脱率改善・回遊改善を期待。

---

## metadata 実装テンプレート

```ts
import { createMetadata } from "@/lib/seo/metadata";

export const metadata = createMetadata({
  title: "商品一覧 | Digital Assets EC",
  description: "壁紙・写真・アイコン素材をカテゴリ別で比較・購入できます。",
  path: "/products",
  image: "/og/products.jpg",
});
```

## 商品詳細 `generateMetadata` テンプレート

```ts
export async function generateMetadata({ params }) {
  const product = await getProductById(params.id);
  if (!product) return { title: "Not Found" };

  return createMetadata({
    title: `${product.title} | Digital Assets EC`,
    description: product.description,
    path: `/products/${product.id}`,
    image: product.image,
  });
}
```

---

## 公式参照先

- Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- JSON-LD: https://nextjs.org/docs/app/guides/json-ld
- Dynamic Routes: https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes
