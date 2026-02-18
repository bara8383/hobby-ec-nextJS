# SSE + SQS チャット設計（B案・DBポーリングなし）

## A) 実装前の設計概要（追加/変更ファイル）

- `app/api/chat/send/route.ts`
  - 認証/参加者チェック後にメッセージを永続化し、受信者キューへ軽量イベントのみ enqueue。
  - `Idempotency-Key` ヘッダーを優先して冪等化。
- `app/api/chat/history/route.ts`
  - 会話参加者のみ、カーソル付きで履歴取得。
- `app/api/chat/stream/route.ts`
  - SSE (`text/event-stream`) + SQSロングポーリング（20秒）で受信。
  - keep-alive送信、15分でセッション終了通知、AbortSignalで即停止。
  - コスト優先で Option A（イベントのみ通知、本文は history 再取得）を採用。
- `lib/chat/repository.ts`
  - DynamoDB（Conversations/Messages）操作をRepository化。
- `lib/chat/queue.ts`
  - `userId -> queueUrl` を DynamoDB（UserQueue）に保存。
  - 初回キュー作成（create-on-first-use）と SQS enqueue/receive/delete を実装。
- `components/ChatWidget.tsx` / `app/chat/page.tsx` / `app/page.tsx`
  - チャットUIを `/chat` に分離し、SEOページへの重い接続ロジック注入を回避。
- `infra/cdk/lib/chat-sse-stack.ts`
  - DynamoDB/SQS前提の最小IAM付きスタックを更新。

## イベント配信戦略

- 現在: **ユーザー単位キュー方式（Standard Queue）**
  - 送信時に受信者キューへ `{ conversationId, messageId, createdAt }` を投入。
  - SSEはログインユーザーのキューのみロングポーリング。
- 代替案（推奨バックアップ）
  1. シャード単位キュー（例: `chat-shard-{0..63}`）+ `userId` 属性振り分け
  2. 単一キュー + `conversationId` / `recipientId` 属性で購読者分離
  3. SNS→SQS fanout（会話単位の購読制御）

## 手動テスト手順（2ユーザー）

1. ユーザーA/Bで別ブラウザ or シークレットウィンドウを開く。
2. Aで `/chat` にアクセスし、`conversationId` を固定してSSE接続開始。
3. Bから `POST /api/chat/send` で同じ `conversationId` に送信。
4. AのSSEで `message.created` を受信し、`history` 再取得で本文反映されることを確認。
5. SSE接続を15分以上維持し、`session.expiring` 後にクライアント再接続することを確認。

## RISK と検証

- RISK: API Gateway REST API + Lambda Response Streaming は設定差異の影響を受けやすい。
  - 検証: `curl -N` で keep-alive コメントが継続受信できるか、CloudWatchで15分以内終了を確認。
- RISK: SSE長時間接続で同時実行枠を消費し、Lambdaコストが増加。
  - 対策: 15分で切断、Abort時即停止、Option AでDB readを最小化。
- RISK: ユーザー単位キューはキュー数クォータ/作成遅延に抵触する可能性。
  - 対策: シャード単位キューへの移行計画を併記し、上限監視を運用導入。
- RISK: Standard Queueの少数重複/順序逆転。
  - 対策: クライアント側で `messageId` de-dup。厳密順序が必要なら FIFO を別途評価。
