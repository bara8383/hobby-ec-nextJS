# P-019: Align Command Notation Pass Fail And Blocks

- Category: proposal
- Priority: low
- Status: pending
- Related: 

---

## 概要
ローカル運用を Docker のみに寄せたことで、`NODE_ENV` の公式的な使い分け（development で実装、production で本番検証）が読み取りにくくなっていた。【対応案】手順書を development/production 二段運用へ修正し、Node.js/Next.js 標準的な `NODE_ENV` 切替方針を明記する。

## 背景（Why）
- 起票カテゴリ: Improvement / DX
- 対象スコープ: Docs
- 期待影響: 開発効率と本番再現性のバランス改善、運用ルールの誤解防止。

## 具体的に何をしたいか（What）
- 現状: ローカル運用を Docker のみに寄せたことで、`NODE_ENV` の公式的な使い分け（development で実装、production で本番検証）が読み取りにくくなっていた。【対応案】手順書を development/production 二段運用へ修正し、Node.js/Next.js 標準的な `NODE_ENV` 切替方針を明記する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
手順書を development/production 二段運用へ修正し、Node.js/Next.js 標準的な `NODE_ENV` 切替方針を明記する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 開発効率と本番再現性のバランス改善、運用ルールの誤解防止。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
