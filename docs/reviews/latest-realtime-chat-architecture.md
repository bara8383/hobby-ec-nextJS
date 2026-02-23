# リアルタイムチャット実装レビュー（LINE / Slack を参考にした公式一次情報ベース）

最終更新: 2026-02-23  
再監査日: 2026-02-23（JST）  
調査方針: ベンダー公式ドキュメント・公式仕様（一次情報）のみ参照

---

## 1. 概要

### 概略

1. リアルタイムチャットの本質は、**「低遅延な配信」+「順序と整合性の維持」+「再配信可能性」**の両立。
2. LINE / Slack といった実運用サービスは、単一プロトコルではなく、**Push（即時通知）と Pull（履歴取得）を組み合わせる設計**を採用している。
3. Next.js で EC サイトへ統合する場合は、表示層（RSC/Client）と配信基盤（WebSocket / Webhook / Queue）を責務分離する。

### 詳細

- LINE Messaging API は webhook ベースでイベントを受け取り、返信・プッシュメッセージ API で配信する構造が中心。
- Slack は Events API / Socket Mode / Web API など複数経路を使い分ける構造で、運用要件に応じて接続方式を選択する。
- どちらも「受信イベント処理」と「メッセージ保存・配信」を分離しており、信頼性と拡張性を担保している。

---

## 2. 仕組み（実装アーキテクチャ）

### 概略

1. **クライアント接続層**: WebSocket/SSE で新着通知を受ける。
2. **受信層**: Webhook/Event 受信 API で外部イベントを受ける。
3. **処理層**: 署名検証、認可、重複排除、順序制御を実施。
4. **永続化層**: メッセージを保存し、会話履歴を取得可能にする。
5. **配信層**: 対象ユーザーへ fan-out（1対多配信）する。

### 詳細

#### 2-1. 受信（Ingress）

- LINE は webhook 受信時に署名検証（`x-line-signature`）が必須。
- Slack も署名検証（Signing Secret）が必須で、リプレイ耐性のため timestamp も検証する。
- 受信直後に重い処理を行わず、キューへ積んで非同期処理することで遅延と失敗率を抑える。

#### 2-2. 配信（Egress）

- 即時性が必要な通知は WebSocket/SSE、履歴取得は HTTP API で分離する。
- クライアント再接続時は「最後に受信したメッセージID」以降を再取得して欠損を埋める。
- 既読・未読やタイピング状態などは、耐久保存の要否を分けて扱う（全件永続化しない設計が一般的）。

#### 2-3. 整合性

- メッセージには単調増加IDまたは時系列キーを付与し、表示順序を安定化する。
- at-least-once 配信を前提に、idempotency key で重複挿入を防止する。
- 添付ファイルはメッセージ本体と分離し、オブジェクトストレージ参照を持たせる。

#### 2-4. Next.js との責務分離

- App Router では、初期表示は Server Components で履歴を SSR/Streaming。
- リアルタイム更新は Client Component に限定して購読（不要な `use client` 拡散を防止）。
- 更新系は Server Actions または Route Handler 経由で統一し、認可と監査ログを集中管理する。

---

## 3. 重要度の高い要素（P0/P1/P2）

### 概略

1. **P0（必須）**: セキュリティ・信頼性・最低限のUXを守る項目。
2. **P1（推奨）**: 運用効率と体験品質を上げる項目。
3. **P2（後回し）**: 基盤完成後に最適化する項目。

### 詳細

#### P0（必須）

- webhook/event 署名検証（LINE/Slack とも必須）
- メッセージ永続化 + 再取得 API（再接続時の欠損復旧）
- 重複排除（idempotency）
- 認可（会話参加者のみ閲覧・投稿可能）
- 監査ログ（送信者・時刻・操作種別）

#### P1（推奨）

- 配信遅延モニタリング（p95/p99）
- Backpressure 制御（急増時のキュー保護）
- 既読/未読同期、通知設定、ミュート制御
- モバイル回線向けの再接続戦略（指数バックオフ）

#### P2（後回し）

- タイピングインジケータの高頻度最適化
- リアクション集計の超低遅延化
- 高度な全文検索最適化（まずは検索要件確定を優先）

---

## 4. 専門性が高い要素の詳細

### 4-1. 配信保証モデル（at-most-once / at-least-once / exactly-once）

- 現実的な設計は at-least-once + 重複排除。
- exactly-once はコスト・複雑性が高いため、チャットではアプリ層の冪等性で実用的に解くことが多い。

### 4-2. 順序保証とシャーディング

- グローバル厳密順序は高コスト。
- 会話（room/channel）単位で順序保証し、シャードキーを会話IDに寄せるとスケールしやすい。

### 4-3. オンライン状態（presence）

- presence は揮発データとして TTL を短く持つ実装が一般的。
- 切断検知は heartbeat で行い、ネットワーク揺らぎを考慮して猶予時間を設定する。

### 4-4. LINE/Slack 連携時の設計注意

- LINE: webhook 受信から返信可能時間・送信 API 制約を意識し、同期処理を短く保つ。
- Slack: rate limits と再送シグナル（retry）を前提に、失敗時再試行と重複抑止を実装する。

### 4-5. SEO とチャットの共存

- チャット画面は通常 noindex 寄りで設計し、商品・カテゴリ・LP は index 対象に分離する。
- Next.js `metadata` / `robots` をルートごとに分け、SEO対象ページへのクロール予算を確保する。

---

## 5. LINE / Slack 風チャットを学習実装する際の最小構成

1. `POST /api/chat/events`（Webhook/Event受信 + 署名検証）
2. `POST /api/chat/messages`（投稿API、認可あり）
3. `GET /api/chat/messages?roomId=...&cursor=...`（履歴取得）
4. `GET /api/chat/stream?roomId=...`（SSEまたはWS購読）
5. DB テーブル:
   - rooms
   - room_members
   - messages（idempotency_key, created_at, sender_id）
   - delivery_status（任意）

---

## 6. 参照した公式情報（一次情報）

- LINE Developers: Messaging API（Overview / Webhooks / Verify signature）  
  https://developers.line.biz/en/docs/messaging-api/
- Slack API: Real Time Messaging（RTM 概要）, Events API, Socket Mode, Rate limits, Verifying requests from Slack  
  https://api.slack.com/
- IETF RFC 6455: The WebSocket Protocol  
  https://datatracker.ietf.org/doc/html/rfc6455
- WHATWG HTML Living Standard（Server-Sent Events）  
  https://html.spec.whatwg.org/multipage/server-sent-events.html
- Next.js Docs（App Router / Route Handlers / Server Actions / Metadata）  
  https://nextjs.org/docs/app
