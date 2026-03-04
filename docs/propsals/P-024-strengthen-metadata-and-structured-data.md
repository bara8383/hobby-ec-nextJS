# P-024: Strengthen Metadata And Structured Data

- Category: proposal
- Priority: normal
- Status: pending
- Related: 

---

## 概要
IA案では `slug` ベースの商品詳細導線とカテゴリ/タグLPを前提としているが、現状実装は `id` ルーティング中心で一覧導線も `/` のみだった。【対応案】App Routerで `/products/[slug]`・`/categories/[category]`・`/tags/[tag]` を追加し、SEO関連ロジックを `lib/seo` に集約する。

## 背景（Why）
- 起票カテゴリ: Improvement / SEO
- 対象スコープ: FE
- 期待影響: 商品詳細SEOの拡張余地が小さく、カテゴリ・タグ経由の検索流入を取り込みにくい。

## 具体的に何をしたいか（What）
- 現状: IA案では `slug` ベースの商品詳細導線とカテゴリ/タグLPを前提としているが、現状実装は `id` ルーティング中心で一覧導線も `/` のみだった。【対応案】App Routerで `/products/[slug]`・`/categories/[category]`・`/tags/[tag]` を追加し、SEO関連ロジックを `lib/seo` に集約する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 商品詳細SEOの拡張余地が小さく、カテゴリ・タグ経由の検索流入を取り込みにくい。
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
App Routerで `/products/[slug]`・`/categories/[category]`・`/tags/[tag]` を追加し、SEO関連ロジックを `lib/seo` に集約する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 商品詳細SEOの拡張余地が小さく、カテゴリ・タグ経由の検索流入を取り込みにくい。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
