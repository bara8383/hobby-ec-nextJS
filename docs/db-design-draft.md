# DB設計草案（デジタルEC / Next.js App Router想定）

## 1. 目的

- 商品カタログ、注文、購入後ライブラリ、管理画面、チャット文脈を 1 つの整合したDBで扱う。
- SEO強化に必要な `slug` / カテゴリ / タグ / 構造化データ向け属性を正規化し、運用時の更新コストを下げる。
- AWS最小コストを前提に、ローカル（SQLite）→本番（PostgreSQL/Aurora）へ移行しやすいスキーマを採用する。

---

## 2. 技術選定（草案）

- **アプリ層**: Next.js App Router + Route Handlers（現行方針を維持）
- **ORM**: Drizzle ORM（型安全・マイグレーション管理がしやすい）
- **DBエンジン**:
  - 開発: SQLite（コンテナ起動が軽く、ローカルコスト最小）
  - 本番: PostgreSQL（RDS/Aurora Serverless v2 を段階選択）
- **リアルタイム補助**: チャット永続化はDB、リアルタイム配信は将来 Redis/SQS 併用を想定

---

## 3. ER（論理）

```text
users 1 --- n orders 1 --- n order_items n --- 1 products
products 1 --- n product_media
products n --- n tags (via product_tags)
products n --- 1 categories
orders 1 --- n download_grants
users 1 --- n chat_sessions 1 --- n chat_messages
```

---

## 4. テーブル設計（主要）

## 4.1 users

- `id` (PK, text/uuid)
- `email` (unique, indexed)
- `role` (`customer` / `admin`)
- `created_at`, `updated_at`

> 用途: 認証連携の主キー。現状の `user-demo` 固定実装を将来置換する受け皿。

## 4.2 categories

- `id` (PK)
- `slug` (unique, indexed)
- `name`
- `description`
- `sort_order`

> 用途: SEO向けカテゴリLP (`/categories/[category]`) の一次情報。

## 4.3 products

- `id` (PK)
- `slug` (unique, indexed)
- `name`
- `description`
- `price_jpy` (integer)
- `category_id` (FK -> categories.id, indexed)
- `is_published` (boolean, indexed)
- `published_at` (timestamp, indexed)
- `created_at`, `updated_at`

> 用途: 商品詳細と一覧の主テーブル。`slug` はSEO URLと API 双方で利用。

## 4.4 product_specs

- `id` (PK)
- `product_id` (FK, unique)
- `file_format` (例: wav / zip)
- `duration_sec` (nullable)
- `bpm` (nullable)
- `sample_rate_hz` (nullable)
- `resolution` (nullable)

> 用途: カテゴリ別の差分スペックを構造化し、JSON-LD生成に再利用。

## 4.5 product_media

- `id` (PK)
- `product_id` (FK, indexed)
- `media_type` (`image` / `audio` / `video`)
- `url`
- `is_primary`
- `sort_order`

> 用途: 一覧カードと詳細ページのプレビュー最適化。

## 4.6 tags / product_tags

- `tags.id`, `tags.slug` (unique), `tags.name`
- `product_tags.product_id` (FK)
- `product_tags.tag_id` (FK)
- `product_tags` に複合 unique (`product_id`, `tag_id`)

> 用途: タグLP (`/tags/[tag]`) と内部リンク最適化。

## 4.7 orders

- `id` (PK)
- `user_id` (FK, indexed)
- `status` (`pending` / `paid` / `failed` / `refunded`, indexed)
- `subtotal_jpy`, `tax_jpy`, `total_jpy`
- `payment_provider`
- `payment_intent_id` (nullable, unique)
- `ordered_at` (indexed)
- `created_at`, `updated_at`

## 4.8 order_items

- `id` (PK)
- `order_id` (FK, indexed)
- `product_id` (FK)
- `product_slug_snapshot`
- `product_name_snapshot`
- `unit_price_jpy`
- `quantity`

> 用途: 将来の商品名/価格変更に影響されない履歴保持。

## 4.9 download_grants

- `id` (PK)
- `order_item_id` (FK, indexed)
- `user_id` (FK, indexed)
- `download_token_hash`
- `expires_at` (indexed)
- `max_download_count`
- `downloaded_count`
- `last_downloaded_at`

> 用途: 期限付きダウンロード権限（署名URL発行の前段）を管理。

## 4.10 chat_sessions / chat_messages

- `chat_sessions`: `id`, `user_id`, `title`, `created_at`, `updated_at`
- `chat_messages`: `id`, `session_id`, `role`, `content`, `token_count`, `created_at`

> 用途: チャット履歴保存・問い合わせ分析。将来のレコメンド連携の基盤。

---

## 5. インデックス方針（初期）

- `products(slug)` unique
- `products(category_id, is_published, published_at desc)`
- `orders(user_id, ordered_at desc)`
- `order_items(order_id)`
- `download_grants(user_id, expires_at)`
- `product_tags(tag_id, product_id)`
- `chat_messages(session_id, created_at)`

> まずは読み取り頻度の高い画面（商品一覧/詳細、ライブラリ、管理注文一覧）に絞って最小構成で開始する。

---

## 6. Next.js / SEO / チャット / AWSコスト観点の整合

1. **Next.js最新設計**
   - App Router の `generateMetadata` と `Route Handlers` で再利用しやすい単純なリレーション設計。
2. **SEO最適化**
   - `slug`・カテゴリ・タグ・構造化データ属性をDBで一貫管理し、静的生成/ISRに供給。
3. **リアルタイムチャット**
   - `chat_sessions/messages` でまず履歴を堅実に保存し、配信レイヤは後付け可能な疎結合構成。
4. **AWS最小コスト**
   - 開発/検証はSQLite、本番移行時のみPostgreSQL系へ。初期は単一DBで運用し、負荷増加後に分離。

---

## 7. マイグレーション段階案

- **Phase 1**: 既存 `user/product/order` 型定義を Drizzle schema に置換
- **Phase 2**: `categories/tags/product_media/product_specs` を追加
- **Phase 3**: `download_grants` と決済連携カラム追加
- **Phase 4**: `chat_sessions/messages` を追加し、分析用ビューを検討

---

## 8. 未決事項

- 認証基盤（NextAuth / Cognito）の正式採用時に `users` の主キー戦略を再確認。
- 税計算（内税/外税）と通貨対応（JPY固定継続か）の方針決定。
- チャットメッセージの保持期間（PII方針）とアーカイブ戦略の明文化。
