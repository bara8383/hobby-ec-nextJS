# P-006: Prevent Placeholder Pr Body On Make Pr Error

- Category: concern
- Priority: normal
- Status: pending
- Related: 

---

## 概要
make_pr 実行時にエラーが発生すると、`Codex generated this pull request...` のプレースホルダー本文でPRが作成されるケースを確認。【対応案】PR作成時はテンプレート準拠本文を必ず明示指定し、作成直後に内容検証する運用を追加する。

## 背景（Why）
- 起票カテゴリ: Concern / CI/CD
- 対象スコープ: CI
- 期待影響: レビューアに実装背景が伝わらず、確認工数が増加。

## 具体的に何をしたいか（What）
- 現状: make_pr 実行時にエラーが発生すると、`Codex generated this pull request...` のプレースホルダー本文でPRが作成されるケースを確認。【対応案】PR作成時はテンプレート準拠本文を必ず明示指定し、作成直後に内容検証する運用を追加する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
PR作成時はテンプレート準拠本文を必ず明示指定し、作成直後に内容検証する運用を追加する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: レビューアに実装背景が伝わらず、確認工数が増加。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
