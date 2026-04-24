# P-031: Validate Sse Streaming On Api Gateway Lambda

- Category: concern
- Priority: high
- Status: pending
- Related: 

---

## 概要
`infra/cdk/lib/chat-sse-stack.ts` はAPI Gateway REST + Lambdaを最小構成で追加したが、Response Streamingの有効化手順はリージョン/機能差分の影響を受ける可能性があり、現時点では実環境検証が未完了。【対応案】`curl -N` と CloudWatch Logs で chunk送信継続・15分切断・Abort時停止を確認する検証タスクを次PRで実施する。

## 背景（Why）
- 起票カテゴリ: Concern / Infra
- 対象スコープ: Infra
- 期待影響: SSEがバッファリングされるとリアルタイム性が低下し、接続維持コストだけ増える恐れ。

## 具体的に何をしたいか（What）
- 現状: `infra/cdk/lib/chat-sse-stack.ts` はAPI Gateway REST + Lambdaを最小構成で追加したが、Response Streamingの有効化手順はリージョン/機能差分の影響を受ける可能性があり、現時点では実環境検証が未完了。【対応案】`curl -N` と CloudWatch Logs で chunk送信継続・15分切断・Abort時停止を確認する検証タスクを次PRで実施する。
- やりたいこと: 【対応案】以降に示された方針を実施し、課題を解消する。
- Doneの定義: Status が最終更新され、Decision / Decision Date に整合した結果が記録されている。

## 影響範囲（Impact）
- SEO: 要確認
- Next.js設計: 要確認
- Realtime Chat: 要確認
- AWSコスト: 要確認
- UX: 要確認

## 推奨アクション（1案）
`curl -N` と CloudWatch Logs で chunk送信継続・15分切断・Abort時停止を確認する検証タスクを次PRで実施する。
- 理由: 既存台帳の「対応案」をそのまま採用することで、意思決定履歴を保ったまま移植できるため。
- 期待効果: SSEがバッファリングされるとリアルタイム性が低下し、接続維持コストだけ増える恐れ。

## リスク
- 実装上の懸念: ステータス変換（Open/Done/Accepted/Rejected → pending/accepted/denied）の解釈差異が残る可能性。
- 将来的負債の可能性: 詳細要件が1行ログ由来のため、実装時に補足仕様が必要になる可能性。

## 非採用理由（deniedの場合）
- 理由: 
