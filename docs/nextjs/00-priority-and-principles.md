# 00. 優先順位と設計原則

## 優先順位

本プロジェクトの意思決定は、必ず次の順で行います。

1. **Next.js 最新設計思想に合うか**
2. **SEO を最大化できるか**
3. **リアルタイムチャット要件を満たせるか**

---

## 1) Next.js 最新設計思想（最優先）

### 採用方針

- ルーティングは `app/`（App Router）を採用。
- ページは基本 Server Components（デフォルト）で実装。
- `"use client"` は、入力・クリック・購買UI・チャットUIなど必要箇所のみに限定。
- データ更新は Server Actions を優先し、API が必要なケースのみ Route Handlers を併用。
- `metadata` / `generateMetadata` を標準化し、`head.tsx` の乱立を避ける。

### 実装判断のルール

- 「SEOに効く HTML を最初から返せるか」を常に確認。
- 認証やユーザー依存データが必要な UI だけ Client 化する。
- キャッシュは `fetch` オプションと再検証（revalidation）を明示する。

---

## 2) SEO 高度化（次点）

### 重要項目

- ページごとに `title` / `description` / canonical を定義。
- Product 一覧・詳細に JSON-LD を実装。
- `robots.ts` / `sitemap.ts` を整備し、クロール効率を最適化。
- Open Graph / Twitter Card を metadata API で統一。

### 技術方針

- `src/lib/seo.ts` にメタデータ生成ロジックを集約。
- 商品詳細は `generateMetadata` による動的 SEO を採用。
- 画像・URL は本番ドメイン基準で正規化する。

---

## 3) リアルタイムチャット（第3優先）

### 導入戦略

- Phase 1: Route Handler + polling（学習しやすさ優先）
- Phase 2: SSE（実装コストと体験のバランス）
- Phase 3: WebSocket（本格リアルタイム）

### 注意点

- チャットのクライアント機能は SEO 貢献度が低いため、UI の Client 化範囲を分離。
- チャットが失敗しても商品閲覧・購入導線が壊れない設計を優先。

---

## 公式参照先

- App Router: https://nextjs.org/docs/app
- Rendering: https://nextjs.org/docs/app/building-your-application/rendering
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
