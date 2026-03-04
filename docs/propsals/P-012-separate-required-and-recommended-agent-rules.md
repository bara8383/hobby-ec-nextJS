# P-012: Separate Required And Recommended Agent Rules

- Category: proposal
- Priority: low
- Status: denied
- Related: 

---

## 概要
AGENTS.md の PR 記載ルールを必須見出し・記載順・判定基準（PASS/FAIL、影響範囲、ロールバック）まで具体化し、AI が迷わないテンプレートへ拡張。【対応案】新テンプレートを標準運用とし、以後のPRは必須見出し欠落を差し戻す。

## 背景（Why）
- 起票カテゴリ: Improvement / Docs
- 対象スコープ: Docs
- 期待影響: PR本文の抜け漏れ削減、レビューの高速化、運用判断の明確化。

## 具体的に何をしたいか（What）
- 現状: AGENTS.md の PR 記載ルールを必須見出し・記載順・判定基準（PASS/FAIL、影響範囲、ロールバック）まで具体化し、AI が迷わないテンプレートへ拡張。【対応案】新テンプレートを標準運用とし、以後のPRは必須見出し欠落を差し戻す。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
新テンプレートを標準運用とし、以後のPRは必須見出し欠落を差し戻す。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: PR本文の抜け漏れ削減、レビューの高速化、運用判断の明確化。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 既存台帳で Rejected と判断済み。
