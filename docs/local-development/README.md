# ローカル開発手順

本プロジェクトのローカル検証は **コンテナ起動を基本** とし、AWS 相当の依存は **LocalStack（S3 + SQS）** で再現します。

## 1. 役割分担

- `docker-compose.local.yml`: 日常ローカル開発用（`web` + `db` + `localstack`）
- `docker-compose.yml`: 本番近似確認用（production 相当の Next.js 起動）

## 2. 事前準備

1. `.env.example` をコピーして `.env` を作成

```bash
cp .env.example .env
```

2. 必要に応じてバケット名・キュー名を調整

- `LOCAL_S3_BUCKET`（初期値: `hobby-ec-local-bucket`）
- `LOCAL_SQS_QUEUE_NAME`（初期値: `hobby-ec-local-queue`）

## 3. ローカル開発環境の起動（推奨）

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

## 4. 疎通確認

以下へアクセスし、`ok: true` と S3/SQS の確認結果が返ることを確認します。

- `GET http://localhost:3000/api/localstack/health`

## 5. 本番近似確認（既存手順）

本番近似での確認は、既存の `docker-compose.yml` を利用します。

```bash
docker compose up --build
```

- `NODE_ENV=production` で起動
- Dockerfile ベースの build / start 経路を確認可能

## 6. 便利コマンド

```bash
# ローカル開発コンテナ停止
docker compose -f docker-compose.local.yml down

# ローカル開発コンテナ停止 + volume 削除
docker compose -f docker-compose.local.yml down -v

# 本番ビルド確認
npm run build
```
