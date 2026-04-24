# P-002: Remove Utf8 Bom From Markdown

- Category: proposal
- Priority: low
- Status: accepted
- Related: 

---

## 概要
`AGENTS.md` と `docs/proposals.md` の先頭に UTF-8 BOM が含まれており、差分や表示でノイズになる可能性を確認。【対応案】Markdown ファイルは UTF-8（BOM なし）で統一する。

## 背景（Why）
- 起票カテゴリ: Improvement / Docs
- 対象スコープ: Docs
- 期待影響: 不要な差分混入の抑制、エディタ間の表示差異低減。

## 具体的に何をしたいか（What）
- 現状: `AGENTS.md` と `docs/proposals.md` の先頭に UTF-8 BOM が含まれており、差分や表示でノイズになる可能性を確認。【対応案】Markdown ファイルは UTF-8（BOM なし）で統一する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: なし
- AWSコスト: なし
- UX: 要確認

## 推奨アクション（1案）
Markdown ファイルは UTF-8（BOM なし）で統一する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: 不要な差分混入の抑制、エディタ間の表示差異低減。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
