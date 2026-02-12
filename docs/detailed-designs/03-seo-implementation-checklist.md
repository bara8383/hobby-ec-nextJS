# 03. SEO 実装チェックリスト（強化版）

このチェックリストは、学習用途でも実運用を意識した「SEO強度高め」版です。

## A. インデックス制御

- [ ] `src/app/robots.ts` でクロール許可/禁止を制御
- [ ] `src/app/sitemap.ts` で公開URLを網羅
- [ ] `/cart`, `/checkout`, `/purchase/success/*` は `noindex` 検討
- [ ] canonical URL を全 index 対象ページに付与

## B. metadata 品質

- [ ] 各ページで `title` が固有（重複回避）
- [ ] `description` が検索意図に合い、重複しない
- [ ] Open Graph（title/description/image/url）設定済み
- [ ] Twitter Card 設定済み
- [ ] `alternates.canonical` を明示

## C. 構造化データ

- [ ] 一覧ページ: `ItemList`
- [ ] 詳細ページ: `Product`
- [ ] Home（任意）: `WebSite` / `Organization`
- [ ] JSON-LD を Google Rich Results Test で検証

## D. パフォーマンス（SEO間接要因）

- [ ] 不要な Client Component を削減
- [ ] 画像最適化（`next/image`、適切なサイズ）
- [ ] Webフォント最適化（`next/font`）
- [ ] 過剰な外部スクリプトを抑制

## E. コンテンツ戦略

- [ ] 商品説明に具体情報（用途、サイズ、ライセンス）を記載
- [ ] カテゴリ別導線（壁紙 / 写真 / アイコン）を強化
- [ ] FAQ かヘルプ導線を用意（検索意図補完）

---

## 推奨運用フロー

1. ページ追加時に `metadata` を先に設計
2. 構造化データ（JSON-LD）を実装
3. `robots.ts` / `sitemap.ts` を更新
4. Lighthouse と Rich Results Test で検証
5. Search Console でカバレッジ監視

---

## 公式参照先

- Metadata API: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- `robots.ts` / `sitemap.ts`: https://nextjs.org/docs/app/api-reference/file-conventions/metadata
- JSON-LD Guide: https://nextjs.org/docs/app/guides/json-ld
