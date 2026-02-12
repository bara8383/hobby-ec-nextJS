# 01. フォルダ構成例（優先順位反映）

この構成は、**Next.js 最新設計思想 > SEO > チャット** の順に最適化したものです。

## 推奨構成（現行リポジトリ互換）

```txt
src/
  app/
    layout.tsx
    page.tsx
    robots.ts
    sitemap.ts

    (store)/
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

    (engagement)/
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
    seo/
      JsonLd.tsx
      BreadcrumbJsonLd.tsx
    product/
      ProductCard.tsx
      AddToCartButton.tsx
    chat/
      ChatWidget.tsx
    layout/
      Header.tsx
    ui/
      Button.tsx

  lib/
    seo/
      metadata.ts
      structuredData.ts
      canonical.ts
    products.ts
    cart.ts
    orders.ts
    chatStore.ts

  types/
    index.ts
```

## なぜこの構成か

- `app/(store)` と `app/(engagement)` を分け、SEO 主導の購買導線とチャット導線の責務を明確化。
- `components/seo` と `lib/seo` を分離し、**表示層** と **生成ロジック層** を整理。
- `api/chat` を独立させ、将来 SSE/WebSocket へ拡張しやすくする。

---

## 代替構成（feature-first）

規模が大きくなる場合は、ドメイン単位で `features/` を導入します。

```txt
src/
  features/
    catalog/
      components/
      server/
      seo/
    checkout/
      components/
      server/
    chat/
      components/
      server/
```

> 学習初期は、まず `app/` + `lib/` + `components/` の基本構成を保ち、肥大化時に feature-first へ移行する方が理解しやすいです。

---

## 設計チェックリスト

- [ ] `page.tsx` が不要に `"use client"` になっていないか
- [ ] SEO 関連ロジックが `lib/seo` へ集約されているか
- [ ] API Route が UI 目的で増えすぎていないか（Server Actions で代替できるか）
- [ ] チャット機能が購買導線の描画を遅くしていないか
