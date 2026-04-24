# P-026: Enhance Product Card Information Density

- Category: proposal
- Priority: normal
- Status: pending
- Related: 

---

## 概要
ホーム画面は現状「ヒーロー + 新着 + タグ」の最小構成で、購入判断に必要な比較情報（用途別導線・価格帯導線・安心訴求）が不足していることを確認。画面作り込み要望に対し、段階導入可能なUI強化案を新規ドキュメント化。【対応案】`docs/ui-enhancement-proposal.md` をベースに Phase 1（Home + Card改善）から着手し、PRを小分けで進行する。

## 背景（Why）
- 起票カテゴリ: Improvement / UX
- 対象スコープ: FE
- 期待影響: 情報探索性とCV導線の改善、SEO内部リンク強化、チャット利用文脈の明確化。

## 具体的に何をしたいか（What）
- 現状: ホーム画面は現状「ヒーロー + 新着 + タグ」の最小構成で、購入判断に必要な比較情報（用途別導線・価格帯導線・安心訴求）が不足していることを確認。画面作り込み要望に対し、段階導入可能なUI強化案を新規ドキュメント化。【対応案】`docs/ui-enhancement-proposal.md` をベースに Phase 1（Home + Card改善）から着手し、PRを小分けで進行する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 情報探索性とCV導線の改善、SEO内部リンク強化、チャット利用文脈の明確化。
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 情報探索性とCV導線の改善、SEO内部リンク強化、チャット利用文脈の明確化。

## 推奨アクション（1案）
`docs/ui-enhancement-proposal.md` をベースに Phase 1（Home + Card改善）から着手し、PRを小分けで進行する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 情報探索性とCV導線の改善、SEO内部リンク強化、チャット利用文脈の明確化。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
