# デジタルコンテンツ販売EC：情報設計・フォルダ構成・主要データモデル案

## 0. 前提（確定事項）

- 販売カテゴリは `壁紙 / イラスト / 写真 / デジタル音源` の 4 つ。
- 商品はデジタルダウンロード販売のみ（物理配送なし）。
- 購入後に署名付きURL等でダウンロード提供。
- 商品詳細ページの SEO を主軸に設計。

---

## 1. 情報設計（ページ構成案）

> Next.js App Router と Metadata API を前提に、SEO流入の主戦場を商品詳細に置く。

### 1-1. 公開ページ（集客）

1. `/`（ホーム）
   - 新着商品、人気カテゴリ、用途別導線（例：YouTube向けBGM、4K壁紙）。
   - 構造化データ：`Organization`, `WebSite`（検索サイトリンクボックス狙い）。

2. `/products`（商品一覧）
   - クエリ：`?category=&tag=&sort=&price_min=&price_max=`
   - フィルタ可能項目：カテゴリ、タグ、価格帯、ファイル形式。
   - canonical を正規化して重複URLを抑制。

3. `/products/[slug]`（商品詳細：最重要）
   - 表示項目：タイトル、説明、カテゴリ、タグ、価格、サンプル画像/試聴、形式、解像度（または尺・BPM）、ライセンス。
   - 構造化データ：`Product`, `Offer`, `BreadcrumbList`。
   - OGP/Twitter Card、JSON-LD を商品単位で出力。

4. `/categories/[category]`（カテゴリLP）
   - 壁紙/イラスト/写真/デジタル音源ごとのSEOランディング。
   - カテゴリ特化FAQを配置し、ロングテール対策。

5. `/tags/[tag]`（タグ別一覧）
   - 「和風BGM」「ミニマル壁紙」などニーズ軸の入口。
   - `noindex` 運用も可能（薄いページが増える場合）。

6. `/search`（検索結果）
   - サイト内検索UI。
   - 原則 `noindex, follow` を推奨（重複・低品質ページ抑制）。

7. 補助SEOページ
   - `/about`, `/terms`, `/privacy`, `/license`, `/faq`, `/contact`
   - E-E-A-T補完とコンバージョン不安の低減。

### 1-2. 購入・会員ページ（CV導線）

8. `/cart`（カート）
9. `/checkout`（決済）
10. `/checkout/success`（購入完了）
11. `/mypage/library`（購入済みライブラリ）
12. `/mypage/library/[orderItemId]`（ダウンロードページ）

- ダウンロード導線はこの 11-12 を中核にし、都度署名URLを発行（有効期限付き）。

### 1-3. 管理ページ（運用）

13. `/admin/products`
14. `/admin/products/new`
15. `/admin/products/[id]/edit`
16. `/admin/orders`
17. `/admin/users`

- MVP段階は商品・注文管理を最小範囲で実装。

---

## 2. 推奨フォルダ構成案（Next.js App Router）

```txt
app/
  (store)/
    page.tsx                         # ホーム
    products/
      page.tsx                       # 商品一覧
      [slug]/
        page.tsx                     # 商品詳細
        loading.tsx
      components/
        ProductFilters.tsx
        ProductGrid.tsx
    categories/
      [category]/
        page.tsx                     # カテゴリLP
    tags/
      [tag]/
        page.tsx                     # タグ一覧
    search/
      page.tsx
    cart/
      page.tsx
    checkout/
      page.tsx
      success/
        page.tsx
    mypage/
      library/
        page.tsx
        [orderItemId]/
          page.tsx                   # 署名URL発行導線
  (marketing)/
    about/page.tsx
    faq/page.tsx
    license/page.tsx
  (admin)/
    admin/
      products/page.tsx
      products/new/page.tsx
      products/[id]/edit/page.tsx
      orders/page.tsx

app/api/
  products/route.ts
  checkout/route.ts
  downloads/[orderItemId]/route.ts   # 認可後に署名URL発行
  chat/route.ts                      # 既存リアルタイムチャット

components/
  product/
  checkout/
  seo/
  chat/

lib/
  db/
    schema/
      product.ts
      order.ts
      user.ts
    repositories/
  seo/
    metadata.ts
    jsonld.ts
  storage/
    signed-url.ts

data/
  seeds/

docs/
  digital-ec-information-architecture.md
  proposals.md
```

### 補足
- Route Group（`(store)`, `(marketing)`, `(admin)`）で責務分離。
- SEO出力は `lib/seo` に集約し再利用。
- ダウンロードURL生成は `lib/storage/signed-url.ts` へ集約し、将来 S3/CloudFront どちらでも差し替え可能にする。

---

## 3. 主要データモデル案（DB設計たたき台）

> PostgreSQL想定。将来拡張を見据え、商品本体と配布ファイル、メディア、メタ情報を分離。

### 3-1. `products`

- `id` (uuid, pk)
- `slug` (varchar, unique, not null)
- `title` (varchar, not null)
- `description` (text, not null)
- `category` (enum: wallpaper / illustration / photo / music)
- `price_jpy` (int, not null)
- `status` (enum: draft / published / archived)
- `cover_image_url` (text)
- `sample_audio_url` (text, nullable, 音源のみ主利用)
- `license_type` (varchar)
- `published_at` (timestamptz)
- `created_at`, `updated_at`

### 3-2. `product_assets`（購入後配布ファイル）

- `id` (uuid, pk)
- `product_id` (uuid, fk -> products.id)
- `storage_key` (text, not null) 例: `products/{product_id}/master/file.zip`
- `file_name` (varchar)
- `file_format` (varchar) 例: png, svg, wav, raw
- `file_size_bytes` (bigint)
- `checksum_sha256` (varchar)
- `is_primary` (boolean)
- `created_at`

### 3-3. `product_specs`（カテゴリ依存スペック）

- `id` (uuid, pk)
- `product_id` (uuid, fk)
- `key` (varchar) 例: resolution, bpm, duration_sec, sample_rate
- `value` (varchar)
- `unit` (varchar, nullable)

> 柔軟性重視で key-value。将来、検索要件が強まれば列分割（例: `bpm int`）を検討。

### 3-4. `tags` / `product_tags`

- `tags`
  - `id` (uuid, pk)
  - `name` (varchar, unique)
  - `slug` (varchar, unique)
- `product_tags`
  - `product_id` (uuid, fk)
  - `tag_id` (uuid, fk)
  - `unique(product_id, tag_id)`

### 3-5. `product_media`（サンプル画像/試聴メディア）

- `id` (uuid, pk)
- `product_id` (uuid, fk)
- `media_type` (enum: image / audio)
- `url` (text)
- `sort_order` (int)
- `alt_text` (varchar)

### 3-6. 購入関連（最小）

- `users`
  - `id` (uuid, pk)
  - `email` (varchar, unique)
  - `created_at`
- `orders`
  - `id` (uuid, pk)
  - `user_id` (uuid, fk)
  - `total_jpy` (int)
  - `payment_status` (enum: pending / paid / failed / refunded)
  - `created_at`
- `order_items`
  - `id` (uuid, pk)
  - `order_id` (uuid, fk)
  - `product_id` (uuid, fk)
  - `unit_price_jpy` (int)
  - `license_snapshot` (jsonb)

### 3-7. ダウンロード監査

- `download_tokens`
  - `id` (uuid, pk)
  - `order_item_id` (uuid, fk)
  - `token_hash` (varchar, unique)
  - `expires_at` (timestamptz)
  - `max_downloads` (int)
  - `used_count` (int)
- `download_logs`
  - `id` (uuid, pk)
  - `order_item_id` (uuid, fk)
  - `user_id` (uuid, fk)
  - `ip` (inet)
  - `user_agent` (text)
  - `downloaded_at` (timestamptz)

---

## 4. 既存実装との差分（着手優先度）

1. **高優先**：商品モデル拡張
   - 現状 `data/products.ts` は `name / description / price / category / fileFormat` 中心で、タグ・サンプル・詳細スペックが不足。
2. **高優先**：商品詳細SEO強化
   - `generateMetadata` + JSON-LD（Product/Offer/Breadcrumb）を商品ページに実装。
3. **中優先**：購入後ダウンロード導線
   - `order_items` に紐づく署名URL発行 API を追加。
4. **中優先**：カテゴリLPとタグページ
   - 検索流入の母数拡大。

---

## 5. 設計判断メモ（方針1〜4との対応）

- 方針1（Next.js最新設計）：App Router / Route Group / Server Components 優先。
- 方針2（SEO最適化）：商品詳細ページ中心、Metadata API + JSON-LD を標準化。
- 方針3（リアルタイムチャット）：既存 `app/api/chat/route.ts` を維持し、商品詳細に問い合わせ導線を接続しやすい分割にする。
- 方針4（AWS最小コスト）：ダウンロードは S3 署名URLベースで配布し、アプリ層は軽量なトークン発行に限定。

