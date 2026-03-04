# P-023: Add Product Domain Tables For Scale

- Category: proposal
- Priority: normal
- Status: pending
- Related: 

---

## 概要
`data/products.ts` の商品型はタグ・サンプルメディア・カテゴリ別スペック（解像度/BPM/尺）を保持できず、確定済みの商品要件を表現しきれないことを確認。【対応案】`products` 本体と `product_specs` / `product_media` / `tags` を分離したスキーマへ拡張し、商品詳細ページの構造化データ出力に流用する。

## 背景（Why）
- 起票カテゴリ: Improvement / DB
- 対象スコープ: Fullstack
- 期待影響: 商品詳細SEO（検索意図一致）と購入前判断情報が不足し、CV低下の懸念。

## 具体的に何をしたいか（What）
- 現状: `data/products.ts` の商品型はタグ・サンプルメディア・カテゴリ別スペック（解像度/BPM/尺）を保持できず、確定済みの商品要件を表現しきれないことを確認。【対応案】`products` 本体と `product_specs` / `product_media` / `tags` を分離したスキーマへ拡張し、商品詳細ページの構造化データ出力に流用する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 商品詳細SEO（検索意図一致）と購入前判断情報が不足し、CV低下の懸念。
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
`products` 本体と `product_specs` / `product_media` / `tags` を分離したスキーマへ拡張し、商品詳細ページの構造化データ出力に流用する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 商品詳細SEO（検索意図一致）と購入前判断情報が不足し、CV低下の懸念。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
