# ローカル開発手順

本ドキュメントは、ローカル PC でこのプロジェクトを起動するための手順をまとめたものです。

- **最短で画面確認したい場合**: 「4. Node.js だけで起動（最短）」
- **本番に近い依存込みで確認したい場合（推奨）**: 「5. Docker Compose で起動（推奨）」

> このプロジェクトのローカル検証は **コンテナ起動を基本** とし、AWS 相当の依存は **LocalStack（S3 + SQS）** で再現します。

## 0. 前提環境（ローカル PC）

### 必須

- Git
- Node.js 20 以上（LTS 推奨）
- npm（Node.js 同梱）

### 推奨（コンテナ起動する場合）

- Docker Desktop（または Docker Engine + Compose Plugin）

## 1. リポジトリ取得

```bash
git clone <このリポジトリのURL>
cd hobby-ec-nextJS
```

## 2. 環境変数ファイルを作成

`.env.example` をコピーして `.env` を作成します。

```bash
cp .env.example .env
```

必要に応じて次の値を調整してください。

- `LOCAL_S3_BUCKET`（初期値: `hobby-ec-local-bucket`）
- `LOCAL_SQS_QUEUE_NAME`（初期値: `hobby-ec-local-queue`）

## 3. 依存パッケージのインストール

Node.js 起動を行う場合は、先に依存を入れます。

```bash
npm ci
```

## 4. Node.js だけで起動（最短）

まずは画面確認だけしたい場合に有効です。

```bash
npm run dev
```

起動後:

- アプリ: `http://localhost:3000`

> 注意: Node.js 単体起動では Postgres / LocalStack を別途起動していないため、機能によっては動作確認が限定されます。

## 5. Docker Compose で起動（推奨）

AWS 依存を含めたローカル再現を行う場合は、こちらを使います。

```bash
docker compose -f docker-compose.local.yml up --build
```

起動後:

- アプリ: `http://localhost:3000`
- LocalStack: `http://localhost:4566`
- Postgres: `localhost:5432`

### LocalStack 初期化

`localstack/init/01_create_resources.sh` が LocalStack の ready hook で自動実行され、以下を作成します。

- S3 バケット: `hobby-ec-local-bucket`（`LOCAL_S3_BUCKET` で変更可）
- SQS キュー: `hobby-ec-local-queue`（`LOCAL_SQS_QUEUE_NAME` で変更可）

## 6. 構成ファイルの役割分担

- `docker-compose.local.yml`: 日常ローカル開発用（`web` + `db` + `localstack`）
- `docker-compose.yml`: 本番近似確認用（production 相当の Next.js 起動）

## 6.1 環境の住み分け（重要）

- ローカル（compose + localstack）
  - 目的: 開発・デバッグ
  - 主体: `docker-compose.local.yml`
- 本番（EC2 + SSM + GitHub Actions）
  - 目的: `prod` のみを安全に運用
  - 方針: SSH ではなく SSM Run Command でデプロイ
- infra（Terraform）
  - 目的: EC2 / IAM / SG / GitHub OIDC をコード管理
  - 主体: `infra/terraform`
  - 運用: 初回 bootstrap のみ人手、以後は GitHub Actions の OIDC 実行

詳細は `docs/aws/terraform-ec2-oidc-ssm.md` を参照してください。

## 7. 疎通確認

以下へアクセスし、`ok: true` と S3/SQS の確認結果が返ることを確認します。

- `GET http://localhost:3000/api/localstack/health`

## 8. 本番近似確認（既存手順）

本番近似での確認は、既存の `docker-compose.yml` を利用します。

```bash
docker compose up --build
```

- `NODE_ENV=production` で起動
- Dockerfile ベースの build / start 経路を確認可能

## 9. 停止・リセット・便利コマンド

```bash
# ローカル開発コンテナ停止
docker compose -f docker-compose.local.yml down

# ローカル開発コンテナ停止 + volume 削除
docker compose -f docker-compose.local.yml down -v

# 本番ビルド確認
npm run build
```

## 10. よくあるつまずき

- `Port 3000 is already in use`
  - 別プロセスが 3000 番を使っています。該当プロセスを停止して再実行してください。
- `docker compose` が見つからない
  - Docker Desktop の起動状態、または Compose Plugin の導入を確認してください。
- `npm ci` が失敗する
  - Node.js バージョンを確認し、20 以上の LTS を使用してください。
