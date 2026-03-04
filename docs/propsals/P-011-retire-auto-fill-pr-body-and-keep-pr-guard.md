# P-011: Retire Auto Fill Pr Body And Keep Pr Guard

- Category: proposal
- Priority: normal
- Status: accepted
- Related: 

---

## 概要
GitHub Actions による PR本文の自動再生成（Auto Fill PR Body）は、CI失敗時の再実行運用がCodex依存となり現実的でないという懸念を確認。【対応案】`auto-fill-pr-body.yml` を廃止し、`AGENTS PR Guard` で必須フォーマット検証のみを実施する。

## 背景（Why）
- 起票カテゴリ: Decision / CI/CD
- 対象スコープ: CI
- 期待影響: CIがPR本文を上書きしないため、本文責務をPR作成者に一元化でき、運用の説明責任が明確になる。

## 具体的に何をしたいか（What）
- 現状: GitHub Actions による PR本文の自動再生成（Auto Fill PR Body）は、CI失敗時の再実行運用がCodex依存となり現実的でないという懸念を確認。【対応案】`auto-fill-pr-body.yml` を廃止し、`AGENTS PR Guard` で必須フォーマット検証のみを実施する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
`auto-fill-pr-body.yml` を廃止し、`AGENTS PR Guard` で必須フォーマット検証のみを実施する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: CIがPR本文を上書きしないため、本文責務をPR作成者に一元化でき、運用の説明責任が明確になる。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
