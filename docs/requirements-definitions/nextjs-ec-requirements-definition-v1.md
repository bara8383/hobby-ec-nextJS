# 要件定義（拡充版）

## 1. 目的と背景

本システムは、デジタルアセット（壁紙・アイコン・写真素材など）の販売を行う学習用ECサイトである。
本要件定義は、以下を同時に満たすために定義する。

1. Next.js App Router を中心とした現代的なWeb実装の学習
2. SEOを意識した情報設計・実装
3. 将来的なチャット接客機能の段階的導入
4. AWS本番運用を見据えたサーバーレス構成への拡張
5. LocalStack を用いたローカル検証基盤の標準化

---

## 2. スコープ

### 2.1 対象範囲（In Scope）

- 商品一覧・商品詳細・カート・チェックアウト・購入完了ページ
- SEO基盤（metadata / robots / sitemap / JSON-LD）
- 最小限の決済連携（Route Handler経由）
- チャット機能（現時点は学習用の基本導線）
- 運用を見据えた拡張可能なフォルダ・責務分離
- 将来AWS移行を想定した API / 認証 / データ層の責務定義
- LocalStack と AWS 実環境を併用した S3 / API Gateway / Lambda / DynamoDB / Cognito 検証

### 2.2 対象外（Out of Scope）

- 会員登録・ログインなどの本格認証の本番実装
- 在庫連動を伴う外部基幹システム連携
- 本番監視（APM、分散トレーシング）の実装完了
- 多言語展開（i18n）
- AWS本番アカウントへの直接デプロイ運用

---

## 3. ステークホルダー

- **学習者/開発者**: Next.jsのベストプラクティスを学びたい
- **サイト運営者（想定）**: SEO流入とCV導線を改善したい
- **インフラ担当（将来）**: Terraform を用いて環境差分を制御したい
- **エンドユーザー**: 商品を比較し、迷わず購入・DLしたい

---

## 4. 機能要件

### 4.1 カタログ閲覧

- FR-01: ユーザーは商品一覧ページで商品を閲覧できる
- FR-02: ユーザーは商品詳細ページでタイトル・説明・価格・画像を確認できる
- FR-03: 存在しない商品IDアクセス時はNot Foundを返却する

### 4.2 カート/購入

- FR-04: ユーザーは商品をカートへ追加できる
- FR-05: ユーザーはカート内商品を確認できる
- FR-06: チェックアウトで購入処理を開始できる
- FR-07: 購入成功後、注文ID付きの完了ページへ遷移する

### 4.3 チャット

- FR-08: ユーザーはチャット画面から問い合わせを送信できる
- FR-09: チャットが一時的に利用不可でも、購買導線（一覧/詳細/カート/決済）は継続利用できる
- FR-31: 全APIのエラーレスポンスは共通スキーマ（HTTP status / アプリケーション固有エラーコード / メッセージ）で返却する
- FR-32: フロントエンドはエラーコードに基づいて表示制御（入力不備/一時障害/一般障害）を切り替える

### 4.4 SEO

- FR-10: 主要ページにtitle/description/canonicalを設定する
- FR-11: 商品一覧・詳細に構造化データを設定する
- FR-12: robots/sitemapを提供し、クロール対象を制御する
- FR-35: `robots.txt` は環境ごとに自動生成し、手動編集を禁止する
- FR-36: `sitemap.xml` は公開商品データから自動生成し、公開状態変更を自動反映する
- FR-34: JSON-LDは共通ビルダー経由で生成し、型ごとの必須フィールド欠落を防止する

### 4.5 AWS将来拡張（要件定義）

- FR-13: フロント配信は CloudFront + S3(Private/OAC) 前提で設計する
- FR-14: API は `/api/*` で集約し、CloudFront 配下で同一ドメイン提供可能とする
- FR-15: 認証は Cognito User Pool JWT を API Gateway で検証可能な責務分離にする
- FR-16: データ層は DynamoDB を初期標準とし、Aurora Serverless v2 へ切替可能な抽象化を持つ
- FR-17: IaC は Terraform 前提で、`envs/dev` と `envs/prod` を分離する

### 4.6 LocalStack ローカル検証（要件定義）

- FR-18: ローカル環境で S3 / Lambda / API Gateway / DynamoDB の結合確認ができる
- FR-19: `docker compose up` 後に最短で商品 API を疎通確認できる
- FR-20: Next.js 静的出力を S3 へ同期して配信導線を検証できる
- FR-21: 認証基盤は全環境（dev/prod）で Amazon Cognito User Pool を利用し、Keycloak/Moto は利用しない
- FR-33: 認証は環境ごとに User Pool/App Client を完全分離（dev-user-pool/dev-app-client、prod-user-pool/prod-app-client）する
- FR-37: LocalStack 検証の完了条件は単純疎通のみとせず、業務正常系シナリオを最低1件定義・実施する
- FR-38: LocalStack 検証で業務異常系シナリオ（例: 在庫不足）を最低1件定義・実施する
- FR-39: 在庫増減を伴う処理で在庫整合性（負数在庫防止・重複減算防止）を確認する
- FR-40: 同時実行時（並行注文/並行更新）でも整合性を確認する

---

### 4.7 Webアプリケーション実行基盤要件（Rendering戦略）

- FR-22: 各ページ/ルートは `dynamic` / `revalidate` / `fetch` キャッシュ戦略を明示し、未定義を要件違反として扱う
- FR-23: SEO対象かつ更新頻度が低いページは SSG/ISR を優先し、ユーザー固有データを扱うページは Dynamic Rendering を採用する
- FR-24: 自動 Dynamic 化が起こり得る実装では `dynamic = "force-static"` または `revalidate` を明示して挙動を固定する
- FR-25: Rendering 戦略の最終決定は SEO・パフォーマンス・実装可観点の評価結果をもってアーキテクト承認とする

#### 4.7.1 ルート別既定戦略（現行）

| ルート | dynamic | revalidate | fetch キャッシュ方針 | 理由 |
|---|---|---:|---|---|
| `/` | `force-static` | `3600` | `force-cache` 相当（静的データ参照） | SEO対象・更新頻度低 |
| `/products` | `force-static` | `1800` | `force-cache` 相当（静的データ参照） | カタログ一覧は ISR 優先 |
| `/products/[id]` | `force-static` | `1800` | `force-cache` 相当（静的データ参照） | 詳細ページは SEO重視 |
| `/cart` | `force-dynamic` | `0` | `no-store` 相当（ユーザー状態依存） | セッション依存情報 |
| `/checkout` | `force-dynamic` | `0` | `no-store` 相当 | 注文処理の即時性優先 |
| `/chat` | `force-dynamic` | `0` | `no-store`（API通信） | 逐次更新を優先 |
| `/purchase/success/[orderId]` | `force-dynamic` | `0` | `no-store` 相当（注文ID依存） | 個別注文情報 |
| `/api/chat` | `force-dynamic` | `0` | `no-store` | 最新メッセージ整合性 |
| `/api/stripe` | `force-dynamic` | `0` | `no-store` | 決済系APIは動的処理 |

#### 4.7.2 優先順位への適用方針（`docs/README.md` 準拠）

- PR-01: **Next.js 最新設計思想を最優先**とし、App Router / Server Components / Route Handlers / Server Actions の責務分離を崩す実装は採用しない
- PR-02: **SEOを第2優先**とし、インデックス対象ページ（`/`, `/products`, `/products/[id]`）は静的生成または ISR を優先する
- PR-03: **チャットは第3優先の段階導入**とし、チャット関連ルートは動的戦略を許容する一方で、障害時も購買導線に影響を波及させない
- PR-04: Rendering 戦略の変更提案は、上記優先順位に対する適合性（1→2→3 の順）をレビュー記録に残す

---

### 4.8 配信方式要件（P-003 正式回答）

- FR-26: 本番配信方式は **CloudFront + ALB + ECS(Fargate) 上の Next.js SSR/Hybrid 実行**を正式採用し、`next export` を本番方式として採用しない
- FR-27: App Router の Server Actions を利用するルートは、静的エクスポート対象から除外し、Node.js ランタイム上で実行する
- FR-28: Route Handlers は Node.js ランタイムが必要な API 境界として扱い、静的配信のみで完結させない
- FR-29: Rendering モードは以下を定義として運用する
  - **ISR**: 事前生成 + `revalidate` による背景再生成（SEO対象で更新頻度が中低）
  - **SSR(Dynamic)**: リクエストごとにサーバー実行（ユーザー固有データ/即時性が必要）
  - **Hybrid**: ルート単位で ISR と SSR を併用し、全体最適を図る
- FR-30: `next export` はローカル学習・検証用途に限定し、対象は静的互換ルートのみとする

#### 4.8.1 技術制約（App Router と static export）

- Server Actions はサーバー実行を前提とするため、静的エクスポートのみでは成立しない
- Route Handlers は Node.js ランタイムのリクエスト処理を前提とするため、静的ホスティング単体では代替できない
- Dynamic Rendering を含むルートは、`next export` 前提の配信方式と競合する

---

## 5. 非機能要件

### 5.1 パフォーマンス

- NFR-01: 初期表示はServer Componentを基本として不要なクライアントJSを抑制
- NFR-02: ページ単位でキャッシュ戦略（静的生成/再検証/動的）を明示
- NFR-03: CloudFront 経由配信を前提に静的資産の圧縮・キャッシュ最適化を行う

### 5.2 可用性/障害分離

- NFR-04: チャット障害が発生しても商品閲覧・購入フローは停止しない
- NFR-05: 外部API障害時はユーザー向けに最低限の失敗メッセージを返す
- NFR-06: API・認証・データ層の障害影響を機能単位で局所化できる構成を保つ
- NFR-24: APIエラーコードはルート間で再利用可能な命名規則（例: VALIDATION_ERROR, EXTERNAL_SERVICE_UNAVAILABLE）を適用する

### 5.3 保守性

- NFR-07: SEOロジックは `src/lib/seo.ts` を中心に集約し重複を防ぐ
- NFR-08: 画面責務（app）・部品（components）・業務ロジック（lib/actions）を分離する
- NFR-09: 将来的なモノレポ化（apps/services/packages/infra）に移行しやすい依存関係を保つ
- NFR-10: Terraform module を frontend/auth/api/data 単位で分割可能な設計とする

### 5.4 セキュリティ

- NFR-11: 決済・注文処理はServer Action/Route Handler側で実行し、クライアントから機密情報を露出しない
- NFR-12: 外部入力（チャットメッセージ等）は検証・サニタイズ可能な構造で扱う
- NFR-13: S3 は public access block を有効にし、CloudFront OAC 経由のみアクセス可能とする
- NFR-14: API は Authorization ヘッダを透過し、JWT 検証可能な境界を維持する
- NFR-25: JWT 検証パラメータ（`JWT_ISSUER` / `JWT_AUDIENCE` / `JWT_JWKS_URL`）は環境変数で管理し、固定値ハードコードを禁止する
- NFR-26: 環境切替時にコード変更を不要とし、設定値のみで認証検証先を切替可能とする
- NFR-27: Claim 構造の差異はマッピング層で吸収し、アプリ内部では共通Userモデルを使用する

### 5.5 運用・検証容易性

- NFR-15: LocalStack のバージョン差分を考慮し、docker image タグ固定を推奨する
- NFR-16: 初期化スクリプト再実行手順（データ再作成）をドキュメント化する
- NFR-17: 本番不可のローカル構成であることを明示し、誤用を防止する
- NFR-28: LocalStack 検証は疎通確認と業務シナリオ検証を分離し、双方の完了をもって検証完了とする
- NFR-29: 同時実行整合性の検証手順（実行条件/期待結果/再現手順）を文書化し、再現可能とする
- NFR-22: JSON-LD の妥当性検証を CI で自動実行し、失敗時はマージ不可とする
- NFR-23: PRレビュー時に主要ページ（Home / products / products/[id]）の Rich Results Test 手動確認をチェックリスト化する

---

### 5.6 バージョン管理ポリシー

- NFR-18: Next.js は検証済みの固定バージョンを使用し、`package.json` では exact version（`^` / `~` 禁止）で管理する
- NFR-19: Node.js は LTS の固定バージョンを採用し、ローカル・CI・Docker で同一バージョンを使用する
- NFR-20: バージョン変更管理は major は別スプリント、minor は検証後反映、patch は CI 通過後に反映可能とする
- NFR-21: バージョン自動更新、暗黙的な Edge Runtime 移行、不明確な Server/Client 境界の実装を禁止する

---

## 6. ユースケース（主要）

### UC-01 商品を閲覧して購入する

1. ユーザーが `/products` を閲覧
2. 商品詳細 `/products/[id]` へ遷移
3. カートへ追加
4. `/checkout` で購入手続き
5. `/purchase/success/[orderId]` で完了確認

### UC-02 商品比較中にチャットで相談する

1. ユーザーが商品詳細を閲覧
2. `/chat` へ移動して問い合わせ送信
3. 必要に応じて商品詳細へ戻って購入継続

### UC-03 ローカルでサーバーレス統合を検証する

1. `docs/localstack-template` を起動
2. API Gateway のエンドポイントを取得
3. `/products` `/orders` API を叩く
4. DynamoDB/S3 のデータ反映を確認

---

## 7. SEO要件詳細

- SR-01: Home/一覧/詳細をインデックス対象とする
- SR-02: cart/checkout/success/chat は原則 noindex 方針で運用し、方針変更はレビュー対象とする
- SR-03: JSON-LD はページ種別に応じて `WebSite` / `ItemList` / `Product` を出し分ける
- SR-04: canonical URL は環境依存値でなく正規ドメイン基準で生成する
- SR-05: metadata API を利用して title / description / og を一元管理する
- SR-06: SEO 方針は「Next.js 最新設計思想を優先しつつ実装可能な最適化を継続」する
- SR-07: JSON-LD は JSON Schema ベースでCI検証し、構文エラーおよび必須項目欠落をデプロイ前に検出する
- SR-08: PR時に Google Rich Results Test の手動確認を実施し、Google解釈レベルで最終確認する
- SR-09: robots/sitemap はコード生成を正本とし、手動編集を禁止する

---

## 8. インフラ将来構成要件（AWS）

### 8.1 参照アーキテクチャ

- Route53 -> CloudFront(ACM/TLS) -> ALB -> ECS(Fargate) の Next.js 実行基盤を本番標準とする
- Next.js App Router（Server Components / Server Actions / Route Handlers）は ECS 上の Node.js ランタイムで実行する
- API は `/api/*` を Next.js Route Handlers または BFF 経由で提供し、必要に応じて内部サービス（Lambda/API Gateway）へ接続する
- 永続データは DynamoDB（初期）を標準とし、RDB 要件増加時に Aurora Serverless v2 へ拡張可能とする

### 8.2 IaC 要件

- Terraform バージョン・provider バージョンを固定管理する
- CloudFront 用 ACM は `us-east-1` provider alias を利用する
- 環境差分は module 入力変数と tfvars で管理する

### 8.3 CI/CD 要件

- フロントのビルド成果物を S3 配信できるパイプラインを提供する
- JSON-LD 妥当性検証（`npm run validate:jsonld`）を PR 時に自動実行し、エラー時はマージ不可とする
- 破壊的変更（DB, 認証）は plan/apply 承認フローを設ける

---

## 9. ローカルサーバーレステンプレート要件

### 9.1 必須機能

- Docker Compose で LocalStack / DB(Adminer 任意)を起動できる（認証は Amazon Cognito dev User Pool を使用）
- `awslocal` による S3 バケット、DynamoDB テーブル、Lambda、API Gateway の初期化が可能
- 疎通確認コマンド（curl / aws cli）を手順化し再現可能にする

### 9.2 Next.js 接続要件

- 静的出力（`next export`）はローカル検証限定とし、S3 同期手順は学習用途として提供する（本番適用不可）
- CloudFront 代替として Nginx リバースプロキシ構成を選択可能にする

### 9.3 制約事項

- LocalStack は本番完全互換ではないため、認証・配信挙動差分を許容する
- このテンプレートは学習/検証用であり、本番利用しない
- 認証は Cognito に統一し、Keycloak/Moto は導入しない

---

## 10. 受け入れ基準（Acceptance Criteria）

- AC-01: 主要ページに metadata が設定され、重複titleがない
- AC-02: 商品詳細で JSON-LD `Product` が出力される
- AC-03: robots/sitemap が有効なレスポンスを返す
- AC-04: カート追加〜購入完了まで画面遷移が成立する
- AC-05: チャットAPIに失敗が発生しても商品購入フローは操作可能
- AC-06: LocalStack 起動後に `/products` API の正常レスポンスが確認できる
- AC-07: 将来AWS移行時に CloudFront + S3 + API Gateway + Lambda の責務が矛盾しない
- AC-08: `package.json` の Next.js/関連依存は exact version（`^` / `~` なし）で定義されている
- AC-09: Node.js の固定 LTS バージョンが Docker 設定と矛盾しない
- AC-10: 主要ルートに `dynamic` / `revalidate` が明示されている
- AC-11: 主要ルートの Rendering 戦略が 4.7.1 の表と矛盾しない
- AC-12: Rendering 戦略のレビュー記録に、優先順位（Next.js設計思想 > SEO > チャット）への適合性が明記されている
- AC-13: 本番配信方式が CloudFront + ALB + ECS(Fargate) の SSR/Hybrid 運用として定義され、`next export` 本番適用禁止が明記されている
- AC-14: Server Actions / Route Handlers を含むルートが静的エクスポート対象外として運用定義されている
- AC-15: `npm run validate:jsonld` が CI（PR/Push）で自動実行され、失敗時はマージ不可となる
- AC-16: PRテンプレートに「Rich Results Test 確認済み」チェック項目が存在し、主要ページで確認記録を残せる
- AC-17: `/api/chat` と `/api/stripe` のエラー応答が `status` / `code` / `message` を含む
- AC-18: チャット画面で API エラーコードに応じた表示制御が行われる
- AC-19: 認証基盤が dev/prod ともに Cognito User Pool で定義され、Keycloak/Moto 不使用が明記されている
- AC-20: JWT 検証パラメータ（`JWT_ISSUER` / `JWT_AUDIENCE` / `JWT_JWKS_URL`）が設定値として管理され、固定値ハードコードが存在しない
- AC-21: Claim マッピング層を経由してアプリ内部の共通Userモデルへ正規化する設計が定義されている
- AC-22: `robots.txt` が環境ごとに自動生成され、非本番環境ではクロール抑止が適用される
- AC-23: `sitemap.xml` が公開商品のみを出力し、商品公開状態変更時に反映される
- AC-24: noindex 方針変更がレビュー記録対象として運用され、robots/sitemap の手動編集禁止が明記されている
- AC-25: LocalStack 検証で業務正常系シナリオが最低1件実行され、期待結果が記録されている
- AC-26: LocalStack 検証で業務異常系シナリオが最低1件実行され、期待するエラー制御が確認されている
- AC-27: 在庫整合性（負数在庫防止・重複減算防止）が検証記録で確認できる
- AC-28: 同時実行時の整合性確認（並行リクエスト時の結果整合）が検証記録で確認できる
- AC-29: 単純疎通確認のみでは検証完了と判定しない運用ルールが明記されている

---

## 11. 既存ドキュメント統合ポリシー

以下の資料は本要件定義へ吸収済みのため、個別ファイルは廃止した。以降は本書を上位要件として扱う。

- `docs/aws-infra-future-plan.md`（廃止）
- `docs/localstack-aws-serverless-template.md`（廃止）
- `docs/nextjs-ec-seo-guide.md`（廃止）

---


## 12. 要件定義の運用ルール（本フェーズ）

- 要件定義の拡充における提案・懸念点は `docs/requirements-definitions/proposals.md` に集約する。
- 本文への反映は、オーナー判断で `採用` となった項目のみ実施する。
- 要件定義は `docs/README.md` の優先順位（Next.js設計思想 > SEO > チャット）を上位原則として維持する。

### 12.1 公式一次情報参照ポリシー

本フェーズで参照する仕様は、以下の公式一次情報を優先する。

- Next.js App Router
- Rendering（Server / Client Components）
- Data Fetching
- Route Handlers
- Server Actions
- Metadata / OG / robots / sitemap
- JSON-LD
- Caching and Revalidation

※ 上記リンク先は `docs/README.md` の「公式一次情報（必読）」に準拠する。

---

## 13. 将来拡張要件（任意）

- 認証導入（購入履歴・再DL管理）
- レコメンド機能（閲覧履歴ベース）
- チャットのSSE/WebSocket移行
- 検索・フィルタUIの強化（カテゴリ、価格帯、タグ）
- WAF・Bot対策・監視基盤（CloudWatch/X-Ray/OpenSearch）
