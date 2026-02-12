# Next.js学習用ECガイド（最新設計思想 + SEO強化 + チャット拡張）

> 優先順位: **Next.js最新設計思想 > SEO対策 > リアルタイムチャット機能**

このドキュメントは、`/docs/nextjs` 配下の分割ガイドを束ねる入口です。

## 1. まず読むべき分割ドキュメント

- 設計優先順位: `docs/nextjs/00-priority-and-principles.md`
- フォルダ構成例: `docs/nextjs/01-folder-structure.md`
- ページ構成例: `docs/nextjs/02-page-structure.md`
- SEO実装チェック: `docs/nextjs/03-seo-implementation-checklist.md`
- チャット導入計画: `docs/nextjs/04-chat-roadmap.md`

## 2. このリポジトリでの適用方針

- `src/app` は App Router 中心で、ページは Server Components 基本。
- 商品一覧・商品詳細は metadata API と JSON-LD を優先。
- カート/決済は Server Actions で更新を統一。
- チャットは SEO 主導ページと責務分離し、段階導入。

## 3. 公式ドキュメント（最新情報）

- App Router: https://nextjs.org/docs/app
- Rendering: https://nextjs.org/docs/app/building-your-application/rendering
- Metadata: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- JSON-LD: https://nextjs.org/docs/app/guides/json-ld
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Caching/Revalidation: https://nextjs.org/docs/app/building-your-application/caching

## 4. 補足

AWS展開やローカルサーバーレス検証は次を参照してください。

- `docs/aws-infra-future-plan.md`
- `docs/localstack-aws-serverless-template.md`
