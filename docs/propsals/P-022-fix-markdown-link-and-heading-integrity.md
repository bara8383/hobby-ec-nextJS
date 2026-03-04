# P-022: Fix Markdown Link And Heading Integrity

- Category: problem
- Priority: normal
- Status: pending
- Related: 

---

## 概要
`docs/proposals.md` への起票運用で、ユーザー提案文の転記混入と `proposal.md` / `proposals.md` の表記ゆれが再発要因になり得ることを確認。現状はPR前の機械的チェックがなく運用依存。【対応案】記録先を `docs/proposals.md` に一本化し、PR前チェック（repo内根拠の明記）とCI警告（転記疑い語/記録先誤り）を追加する。

## 背景（Why）
- 起票カテゴリ: Problem / Docs
- 対象スコープ: CI
- 期待影響: 提案台帳の信頼性低下、記録先誤りによる追跡漏れ、レビュー手戻り増加。

## 具体的に何をしたいか（What）
- 現状: `docs/proposals.md` への起票運用で、ユーザー提案文の転記混入と `proposal.md` / `proposals.md` の表記ゆれが再発要因になり得ることを確認。現状はPR前の機械的チェックがなく運用依存。【対応案】記録先を `docs/proposals.md` に一本化し、PR前チェック（repo内根拠の明記）とCI警告（転記疑い語/記録先誤り）を追加する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
記録先を `docs/proposals.md` に一本化し、PR前チェック（repo内根拠の明記）とCI警告（転記疑い語/記録先誤り）を追加する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 提案台帳の信頼性低下、記録先誤りによる追跡漏れ、レビュー手戻り増加。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
