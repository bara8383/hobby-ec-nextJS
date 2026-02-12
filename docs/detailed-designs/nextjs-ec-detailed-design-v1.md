# Next.js EC サイト 詳細設計書（提案版 v1）

> 本書は「実装開始前の合意形成」を目的とした提案ベースの詳細設計です。  
> 各章に **提案** と **判断依頼（オーナー判断）** を明記しています。

---

## 0. 前提と位置づけ

- 参照元: `docs/nextjs/05-requirements-definition-expanded.md`, `docs/nextjs/06-basic-design-expanded.md`
- 本書の役割:
  - 要件定義（What）と基本設計（Howの骨子）を、実装可能な粒度（Howの詳細）へ落とし込む
  - API I/F、画面責務、状態管理、エラー処理、テスト観点を具体化する

### 0.1 今回の改訂方針（提案）

- 提案A: 要件定義・基本設計の本文は大きく壊さず、差分は本書で吸収する
- 提案B: 後続で確定した事項のみ 05 / 06 に「改訂履歴」として反映する

### 0.2 判断依頼（オーナー判断）

1. ドキュメント運用を「本書に集約（A）」にするか、「05/06も逐次更新（B）」にするか
2. 本書の確定版を `v1` として凍結し、以降は `v1.1` 方式で差分追記するか

---

## 1. 変更サマリ（要件定義・基本設計に対する補足/修正提案）

## 1.1 要件定義（05）への補足提案

- FR-04〜FR-07（カート/購入）に対して、以下の具体要件を追加提案
  - カート保持方式: Cookie（短期）
  - 注文確定時の二重送信防止: idempotency key
  - 購入完了画面の直アクセス時制御: orderId 妥当性チェック
- FR-08〜FR-09（チャット）に対して、以下の制約を追加提案
  - SLA対象外（ベストエフォート）
  - タイムアウト時はフォールバック文言を即時返却
- SR-02（noindex）に対して、`/chat` は「運用意図次第で index 可能」の注記を追加提案

## 1.2 基本設計（06）への補足提案

- レイヤ分割に `features/*` を追加し、ユースケース単位の凝集度を高める
- API 設計を REST 風に統一
  - `POST /api/cart/items`
  - `PATCH /api/cart/items/:productId`
  - `DELETE /api/cart/items/:productId`
  - `POST /api/orders`
  - `POST /api/chat/messages`

## 1.3 判断依頼（オーナー判断）

1. `features/*` 層を導入するか（学習目的なら有効、最小実装なら不要）
2. カート API を Route Handler に寄せるか、Server Actions 中心にするか

---

## 2. 全体アーキテクチャ詳細

## 2.1 提案アーキテクチャ

```txt
src/
  app/
    (shop)/
      page.tsx
      products/page.tsx
      products/[id]/page.tsx
      cart/page.tsx
      checkout/page.tsx
      purchase/success/[orderId]/page.tsx
    (support)/chat/page.tsx
    api/
      cart/items/route.ts
      cart/items/[productId]/route.ts
      orders/route.ts
      chat/messages/route.ts
  features/
    cart/
      application/
      domain/
      infrastructure/
    order/
    chat/
  components/
  lib/
    seo/
    validation/
    observability/
```

## 2.2 設計意図（提案）

- 画面都合のロジックは `app`、業務ルールは `features` に分離
- `lib` は横断関心（SEO, validation, logging）に限定
- チャットを `(support)` セグメントとして購買導線から心理的・技術的に分離

## 2.3 判断依頼（オーナー判断）

- 上記の中で「今すぐ導入する最小単位」を選択してください
  - 案1: `features` 導入あり（将来拡張重視）
  - 案2: 既存構成維持 + 最小限の責務分離（学習負荷軽減）

---

## 3. 画面詳細設計

## 3.1 `/products` 商品一覧

### 表示項目（提案）

- サムネイル、商品名、価格、カテゴリタグ、詳細遷移CTA

### UI状態（提案）

- loading: skeleton 8件
- empty: 「該当商品はありません」
- error: 「再読み込みしてください」

### SEO（提案）

- metadata: title / description / canonical
- JSON-LD: `ItemList`

---

## 3.2 `/products/[id]` 商品詳細

### 表示項目（提案）

- タイトル、説明、価格、利用規約リンク、カート追加ボタン

### 業務ルール（提案）

- 未存在IDは `notFound()`
- 価格は表示時にフォーマッタ通過（小数規約統一）

### SEO（提案）

- `generateMetadata` で動的設定
- JSON-LD: `Product`（price, availability, brand を含む）

---

## 3.3 `/cart`

### 振る舞い（提案）

- 数量変更（+/-）
- 小計・合計表示
- チェックアウト遷移

### ガード（提案）

- 空カート時はチェックアウト不可

---

## 3.4 `/checkout`

### 入力項目（提案）

- メールアドレス（購入通知先）
- 支払い同意チェック

### 制御（提案）

- 送信中ボタン二重押下防止
- 送信成功で `/purchase/success/[orderId]` へ

---

## 3.5 `/purchase/success/[orderId]`

### 表示項目（提案）

- 注文ID、購入明細、ダウンロード導線

### ガード（提案）

- 存在しない `orderId` は 404
- 一定期間後のアクセスは簡易表示へ縮退（任意）

---

## 3.6 `/chat`

### 振る舞い（提案）

- 1問1答の単純UI（ストリームなし）
- timeout 3〜5秒でフォールバック応答

### 障害分離（提案）

- API失敗時はチャット画面内で完結し、他画面へ影響を波及させない

---

## 4. API 詳細設計（提案）

## 4.1 `POST /api/cart/items`

- 目的: カートへ商品追加
- request:

```json
{
  "productId": "p_001",
  "quantity": 1
}
```

- response 200:

```json
{
  "ok": true,
  "cart": {
    "items": [{ "productId": "p_001", "quantity": 1, "unitPrice": 1200 }],
    "subtotal": 1200
  }
}
```

- 主なエラー:
  - 400: quantity 不正
  - 404: product 未存在

## 4.2 `PATCH /api/cart/items/:productId`

- 目的: 数量更新
- request:

```json
{
  "quantity": 2
}
```

- エラー:
  - 400: quantity < 1
  - 404: カート内未存在

## 4.3 `DELETE /api/cart/items/:productId`

- 目的: カートから削除
- response: 204

## 4.4 `POST /api/orders`

- 目的: 注文確定
- request:

```json
{
  "email": "user@example.com",
  "agree": true,
  "idempotencyKey": "uuid"
}
```

- response 201:

```json
{
  "ok": true,
  "orderId": "ord_20260212_xxxx"
}
```

- エラー:
  - 409: 重複注文（同一 idempotencyKey）
  - 422: 同意チェック未実施

## 4.5 `POST /api/chat/messages`

- request:

```json
{
  "message": "おすすめは？",
  "context": { "page": "product_detail", "productId": "p_001" }
}
```

- response 200:

```json
{
  "ok": true,
  "reply": "用途が風景ならこちらがおすすめです。"
}
```

- タイムアウト時:

```json
{
  "ok": false,
  "reply": "ただいま混み合っています。時間をおいて再度お試しください。"
}
```

---

## 5. データモデル詳細（提案）

## 5.1 Product

- `id: string`
- `slug: string`
- `title: string`
- `description: string`
- `price: number`（税抜/税込は運用方針で固定）
- `imageUrl: string`
- `category: string`
- `isActive: boolean`

## 5.2 Cart

- `items: CartItem[]`
- `subtotal: number`
- `updatedAt: string`

## 5.3 Order

- `id: string`
- `email: string`
- `items: CartItem[]`
- `amountTotal: number`
- `status: "created" | "paid" | "failed"`
- `idempotencyKey: string`

## 5.4 判断依頼（オーナー判断）

- 価格の定義を「税込固定」or「税抜 + 税計算」にどちらで進めるか

---

## 6. バリデーション/セキュリティ設計

## 6.1 入力バリデーション（提案）

- `zod` による request schema 検証
- 文字列入力（チャット）は最小/最大長を制限

## 6.2 セキュリティ（提案）

- 注文系 API は CSRF 対策（sameSite cookie + token のいずれか）
- ログに個人情報を平文で残さない（email マスク）
- 外部APIキーは Server Runtime のみ参照

## 6.3 判断依頼（オーナー判断）

- CSRF 対策を厳格運用（token必須）にするか、学習優先の簡易運用にするか

---

## 7. 監視/ログ設計（提案）

- リクエスト単位に `requestId` を採番
- エラーログ標準項目: `timestamp`, `level`, `requestId`, `route`, `message`
- chat API は timeout / upstream_error を分類して記録

---

## 8. テスト詳細設計（提案）

## 8.1 単体テスト

- `features/cart/domain` の合計計算
- `lib/seo` の metadata 生成
- validation schema の境界値

## 8.2 結合テスト

- 購買導線: `/products` → `/products/[id]` → `/cart` → `/checkout` → `/purchase/success/[orderId]`
- 例外導線: 存在しない商品ID / 注文二重送信

## 8.3 E2E（任意）

- カート追加・数量変更・購入完了
- チャット失敗時に購買導線へ影響なし

## 8.4 判断依頼（オーナー判断）

- 初期フェーズで E2E を必須にするか（開発速度とのトレードオフ）

---

## 9. 実装フェーズ提案（段階導入）

- Phase 1: 商品一覧/詳細 + SEO整備
- Phase 2: カート/チェックアウト/注文
- Phase 3: チャット導線 + 障害分離
- Phase 4: 改善（監視・テスト拡充・性能チューニング）

### 判断依頼（オーナー判断）

- 各Phaseを1PRずつ分割するか、2Phaseまとめるか

---

## 10. 未決事項（要合意）

1. カート永続化方式（Cookie / localStorage / Server Session）
2. 決済連携の実装粒度（モック先行 or Stripe本接続）
3. チャットの回答ソース（固定FAQ / LLM API）
4. noindex対象の最終確定（`/chat` を含めるか）

---

## 11. 合意後アクション（提案）

- Action-1: 本書の判断依頼項目に採否を付与
- Action-2: 採用案のみ `docs/nextjs/05` と `06` に反映
- Action-3: Phase 1 の実装タスクを issue 化

