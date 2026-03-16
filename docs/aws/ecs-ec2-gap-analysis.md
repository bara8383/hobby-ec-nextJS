# ECS on EC2 移行前調査（実装前）

## 1. 現在のデプロイ方式との差分

### 現在
- README は **Lightsail Containers 想定** の低コスト案を主軸に記載。
- Terraform は **単体EC2 + SSM デプロイ**（ECS/ECR 非採用）。
- デプロイスクリプトは EC2 で `docker compose up -d --build` を直接実行する方式。

### 今回の採用先
- ECS on EC2（single-instance / single-task）
- ECR へイメージ保存
- ECS Service で 1 タスクを維持
- CloudWatch Logs 出力
- ALB なし（EC2 の public IP から直接公開）

### 差分要点
- `docker compose` デプロイから、**ECR + ECS Service 更新**へ切り替える。
- Terraform 管理対象を EC2 単体から、ECS クラスタ・タスク定義・サービス・IAM へ拡張する。
- 機密情報注入を `environment` 直書きから、**ECS task definition の `secrets`** に寄せる。

## 2. 実コードから抽出した環境変数一覧

抽出元: `process.env` 参照 + `.env.example`。

| 変数名 | 用途（現状） |
|---|---|
| NODE_ENV | 実行モード判定 |
| NEXT_PUBLIC_SITE_ORIGIN | canonical / metadata origin |
| AWS_REGION | AWS SDK リージョン |
| AWS_ENDPOINT_URL | LocalStack endpoint |
| LOCAL_S3_BUCKET | LocalStack health check |
| LOCAL_SQS_QUEUE_NAME | LocalStack health check |
| CHAT_CONVERSATIONS_TABLE | chat store設定 |
| CHAT_MESSAGES_TABLE | chat store設定 |
| CHAT_USER_QUEUE_TABLE | chat queue table |
| CHAT_USER_QUEUE_PREFIX | chat queue prefix |
| CHAT_STORAGE_MODE | chat storage backend モード |
| DATABASE_URL | DB 接続文字列 |

## 3. 環境変数分類表（今回方針）

| 分類 | 変数 | 理由 |
|---|---|---|
| Secrets Manager | `DATABASE_URL` | 漏洩時に重大事故へ直結する接続情報 |
| Secrets Manager | `JWT_SECRET` / `SESSION_SECRET` / OAuth secret / API secret / webhook secret / private key / password/token 類 | 方針で機密情報は Secrets Manager 管理 |
| SSM Parameter Store | `APP_ENV` / `AWS_REGION` / `SITE_URL` / `LOG_LEVEL` / `CHAT_STORAGE_MODE` | 非機密の実行時構成値 |
| SSM Parameter Store | `CHAT_CONVERSATIONS_TABLE` / `CHAT_MESSAGES_TABLE` / `CHAT_USER_QUEUE_TABLE` / `CHAT_USER_QUEUE_PREFIX` | 非機密の AWS リソース名 |
| build-time 値 | `NEXT_PUBLIC_SITE_ORIGIN`（必要なら） | `NEXT_PUBLIC_*` は build-time 固定が原則 |
| runtime 値 | `NODE_ENV` / `APP_ENV` / `AWS_REGION` / chat系テーブル名 | server-only 値は runtime 注入優先 |

> 注: `AWS_ENDPOINT_URL` / `LOCAL_*` はローカル向け値のため、本番 ECS では原則未使用。

## 4. single-instance 前提で問題になる箇所

- chat は in-memory / 単一プロセス前提の箇所があり、**multi-instance で整合性が崩れる**可能性がある。
- ALB なしのため、ヘルス監視は ECS タスクの `healthCheck` と `/api/health` へ依存。
- EC2 停止中はサービス完全停止（常時可用性は担保しない）。
- ローリング更新時も desired=1 のため、短時間の切替影響が出る可能性がある。

## 5. 修正対象一覧

- アプリ
  - `Dockerfile`: standalone 実行最適化 + public 欠如時の build/コピー失敗回避
  - `.dockerignore`: ビルドコンテキスト最小化
  - `app/api/health/route.ts`: ECS health check 用 endpoint
- インフラ
  - `infra/terraform/*`: ECS on EC2 最小構成へ再定義（ECR/ECS/EC2/IAM/Logs/SG/SSM/Secrets）
- CI/CD
  - `.github/workflows/*`: app build / Docker build / ECR push / ECS service 更新
- ドキュメント
  - `README.md`: ECS on EC2 手順へ更新
  - 必要に応じて `docs/aws/*`: 初回デプロイ・起動停止・ログ・ロールバック
