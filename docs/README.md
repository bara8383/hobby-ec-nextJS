# docs 拡張ガイド（Next.js学習用EC）

この `docs` は、以下の優先順位で設計しています。

1. **Next.js 最新の設計思想（App Router / Server Components / Route Handlers / Server Actions）**
2. **SEO 対策（metadata API・構造化データ・クロール最適化）**
3. **リアルタイムチャット機能（段階的導入）**

## 読む順番（推奨）

- `docs/basic-designs/00-priority-and-principles.md`
- `docs/basic-designs/01-folder-structure.md`
- `docs/basic-designs/02-page-structure.md`
- `docs/detailed-designs/03-seo-implementation-checklist.md`
- `docs/proposals/04-chat-roadmap.md`
- `docs/requirements-definitions/nextjs-ec-requirements-definition-v1.md`
- `docs/basic-designs/nextjs-ec-basic-design-v1.md`
- `docs/detailed-designs/nextjs-ec-detailed-design-v1.md`

## 既存ドキュメントとの関係

- Next.js + SEO の統合ガイド: `docs/nextjs-ec-seo-guide.md`
- AWS 将来構成: `docs/aws-infra-future-plan.md`
- LocalStack 検証テンプレート: `docs/localstack-aws-serverless-template.md`

## 公式一次情報（必読）

- App Router: https://nextjs.org/docs/app
- Rendering（Server / Client Components）: https://nextjs.org/docs/app/building-your-application/rendering
- Data Fetching: https://nextjs.org/docs/app/building-your-application/data-fetching
- Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Server Actions: https://nextjs.org/docs/app/building-your-application/data-fetching/server-actions-and-mutations
- Metadata / OG / robots / sitemap: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- JSON-LD: https://nextjs.org/docs/app/guides/json-ld
- Caching and Revalidation: https://nextjs.org/docs/app/building-your-application/caching

> このリポジトリの docs は、上記公式ドキュメントの設計方針に寄せた学習導線として構成しています。

## 概要

- 要件定義: `docs/requirements-definitions/`
- 基本設計: `docs/basic-designs/`
- 詳細設計: `docs/detailed-designs/`
- プロジェクト提案: `docs/proposals/`


