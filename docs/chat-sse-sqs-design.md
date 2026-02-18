# SSE + SQS セミリアルタイムチャット設計

## A) 実装前の設計概要

- 送信は `POST /api/chat/send`、受信は `GET /api/chat/stream`（SSE）で分離。
- SSE 側は DB ポーリングせず、ユーザー専用 SQS キューを 20 秒ロングポーリング。
- メッセージ本体は DynamoDB に保存し、SSE は **messageId のみ通知（Option A）**。
  - 理由: SSE 接続ごとの DynamoDB 取得を削減し、受信時だけ `history` 再取得する方が総コストを抑えやすい。
- キューは初回利用時に `userId -> queueUrl` を `ChatUserQueue` テーブルへ保存。
- 認証は Route Handler で必須化（現状は `x-user-id` または cookie を利用する簡易実装）。

## B) 変更ファイル一覧

- `app/api/chat/send/route.ts`: メッセージ登録 + 参加者チェック + 受信者SQS enqueue。
- `app/api/chat/history/route.ts`: 会話履歴ページング取得。
- `app/api/chat/stream/route.ts`: SSE + SQSロングポーリング連携。
- `lib/chat/repository.ts`: DynamoDB 永続化/会話参加判定/冪等制御。
- `lib/chat/queue.ts`: ユーザーキュー解決・作成、enqueue/receive/ack。
- `components/ChatWidget.tsx`: EventSource + 指数バックオフ + history再取得。
- `infra/cdk/*`: 最小IaC（DynamoDB + IAM）。

## C) 追加コードの要点

1. **冪等性**
   - `idempotencyKey` 単位で `IDEMPOTENCY#...` レコードを `ChatMessages` へ保存。
   - 再送時は既存 `messageId` を返し、二重登録を防止。

2. **会話参加者チェック**
   - `Conversations.participants` に `userId` が含まれるか検証。
   - 初回会話は `ensureSupportConversationForUser` で簡易作成。

3. **SSEの挙動**
   - `ReadableStream` で接続し、20秒ロングポーリングでイベント待機。
   - 受信イベントを送信後に `DeleteMessage` で ack。
   - 切断は `AbortSignal` と `cancel` でログを残す。

4. **ログ要件**
   - `requestId`, `userId`, `conversationId` を `console.info` で出力。

## D) 手動テスト手順

```bash
npm install
npm run lint
npm run dev
```

1. ブラウザで `/` を開く。
2. チャット入力欄からメッセージ送信。
3. `/api/chat/history?conversationId=support-demo` の戻り値に message が追加されることを確認。
4. 複数タブを開き、片方で送信 → もう片方でSSE経由更新されることを確認。

## E) 想定リスクと代替案

- RISK: **ユーザー単位キュー方式はSQSキュー数クォータに抵触する可能性**（ユーザー急増時）。
  - 代替案: テナント単位/シャード単位キュー + メッセージ属性で userId ルーティング。
- RISK: `sqs:CreateQueue` を実行ロールに許可するため、IAMスコープを厳密に絞らないと過剰権限化する。
  - 代替案: 事前プロビジョニング + `GetQueueUrl` のみ許可。
- RISK: Standard Queue のため重複配信・順序入れ替えが発生しうる。
  - 代替案: クライアント側で `messageId` de-dup、必要なら FIFO + MessageGroupId を検討。
- RISK: Vercel Serverless 実行環境では SSE 長時間接続の制限があり、期待どおりの接続時間を確保できない場合がある。
  - 代替案: AWS Lambda + Function URL / ALB 経由へ配置し、タイムアウト設計を合わせる。
