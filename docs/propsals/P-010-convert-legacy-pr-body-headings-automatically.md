# P-010: Convert Legacy Pr Body Headings Automatically

- Category: proposal
- Priority: normal
- Status: denied
- Related: 

---

## 概要
PR本文が `Motivation / Description / Testing` 形式で入力された場合、`AGENTS PR Guard` が必須見出し不足で失敗する事象を確認。`Auto Fill PR Body` は空/プレースホルダーのみ補完対象のため、このケースを救済できなかった。【対応案】`Auto Fill PR Body` に旧形式見出し検知ロジックを追加し、AGENTS.md準拠テンプレートへの自動変換対象を拡張する。

## 背景（Why）
- 起票カテゴリ: Improvement / CI/CD
- 対象スコープ: CI
- 期待影響: PR本文フォーマットの不一致を自動是正し、手動修正の待ち時間とCI再実行コストを削減。

## 具体的に何をしたいか（What）
- 現状: PR本文が `Motivation / Description / Testing` 形式で入力された場合、`AGENTS PR Guard` が必須見出し不足で失敗する事象を確認。`Auto Fill PR Body` は空/プレースホルダーのみ補完対象のため、このケースを救済できなかった。【対応案】`Auto Fill PR Body` に旧形式見出し検知ロジックを追加し、AGENTS.md準拠テンプレートへの自動変換対象を拡張する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
`Auto Fill PR Body` に旧形式見出し検知ロジックを追加し、AGENTS.md準拠テンプレートへの自動変換対象を拡張する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: PR本文フォーマットの不一致を自動是正し、手動修正の待ち時間とCI再実行コストを削減。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 既存台帳で Rejected と判断済み。
