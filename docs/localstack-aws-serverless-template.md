# LocalStack で構築する EC サイト向け AWS サーバーレス検証環境

このドキュメントは、将来の本番構成（CloudFront + S3 + Cognito + API Gateway + Lambda + DB）を見据え、**ローカルで検証できる Docker / Docker Compose テンプレート**としてまとめたものです。  
本番構成の将来計画は `docs/aws-infra-future-plan.md` を参照してください。

---

## 1. このテンプレートでできること

- LocalStack で以下をローカル模擬
  - API Gateway
  - Lambda
  - S3
  - DynamoDB
  - Cognito(User Pool) ※制約あり
- Next.js を `next build` + `next export` で静的化し、S3 へアップロード可能
- Nginx を CloudFront 代替として立て、`/` を静的配信、`/api/*` を API Gateway にプロキシ可能
- Cognito の代替として Keycloak を同時起動し、JWT 発行フローを検証可能

---

## 2. ディレクトリ構成（docs 配下）

```text
docs/
├─ localstack-aws-serverless-template.md
└─ localstack-template/
   ├─ docker-compose.yml
   ├─ init/
   │  ├─ 01-bootstrap.sh
   │  └─ lambda/
   │     └─ product-api/
   │        └─ index.py
   └─ nginx/
      └─ default.conf
```

> `localstack-template` 配下はそのまま検証用テンプレートとして利用できます。

---

## 3. docker-compose 完全版

`docs/localstack-template/docker-compose.yml` を利用してください。

### 有効化している LocalStack サービス

`SERVICES=s3,dynamodb,lambda,apigateway,iam,cloudwatch,logs,sts,cognito-idp`

- `s3`: 静的アセット配置
- `dynamodb`: 商品/注文データ
- `lambda`: API 実装
- `apigateway`: REST API 公開
- `iam`/`sts`: Lambda Role 模擬
- `cloudwatch`/`logs`: ログ系
- `cognito-idp`: Cognito User Pool 系（機能は LocalStack 版の制限あり）

### ポート一覧

- `4566`: LocalStack Edge
- `4510-4559`: LocalStack 内部サービス（補助）
- `3000`: Next.js 開発サーバ
- `8080`: Nginx（CloudFront 代替）
- `8081`: Keycloak

---

## 4. 起動順（推奨）

1. LocalStack を起動（`01-bootstrap.sh` が自動実行）
2. Keycloak を起動（Cognito 代替 JWT 必要時）
3. Next.js を起動
4. Nginx を起動

```bash
cd docs/localstack-template
docker compose up -d
```

`01-bootstrap.sh` は LocalStack の ready フックとして動き、以下を自動作成します。

- S3 バケット `local-ec-frontend`
- DynamoDB テーブル `Products`, `Orders`
- 商品の初期データ
- Lambda `product-api`
- API Gateway `ec-local-api` + `/products(GET)` + `/orders(POST)` + `dev` stage

---

## 5. 初期データ投入 / 再投入コマンド例

### DynamoDB テーブル確認

```bash
awslocal --region ap-northeast-1 dynamodb list-tables
```

### 商品データ追加

```bash
awslocal --region ap-northeast-1 dynamodb put-item \
  --table-name Products \
  --item '{
    "productId": {"S": "sku-003"},
    "name": {"S": "Compose Sticker"},
    "price": {"N": "480"},
    "stock": {"N": "250"}
  }'
```

### S3 バケット確認

```bash
awslocal --region ap-northeast-1 s3api list-buckets
```

---

## 6. API Gateway / Lambda の接続・動作確認

### API ID と invoke URL を取得

```bash
REST_API_ID=$(awslocal --region ap-northeast-1 apigateway get-rest-apis \
  --query "items[?name=='ec-local-api'].id" --output text)

echo "$REST_API_ID"

echo "http://localhost:4566/restapis/${REST_API_ID}/dev/_user_request_"
```

### 商品一覧 API（GET /products）

```bash
curl "http://localhost:4566/restapis/${REST_API_ID}/dev/_user_request_/products"
```

### 注文 API（POST /orders）

```bash
curl -X POST "http://localhost:4566/restapis/${REST_API_ID}/dev/_user_request_/orders" \
  -H "Content-Type: application/json" \
  -d '{"productId":"sku-001","quantity":2}'
```

### Lambda 直接テスト

```bash
awslocal --region ap-northeast-1 lambda invoke \
  --function-name product-api \
  --payload '{"path":"/products","httpMethod":"GET"}' \
  /tmp/lambda-output.json && cat /tmp/lambda-output.json
```

---

## 7. S3 PUT / GET 動作確認

```bash
echo '<html><body><h1>local ec</h1></body></html>' > /tmp/index.html
awslocal --region ap-northeast-1 s3 cp /tmp/index.html s3://local-ec-frontend/index.html
awslocal --region ap-northeast-1 s3 cp s3://local-ec-frontend/index.html -
```

---

## 8. Next.js の繋ぎ方（静的出力 → LocalStack S3）

### 1) Next.js を静的出力

```bash
npm ci
npm run build
npx next export -o out
```

### 2) LocalStack S3 に同期

```bash
awslocal --region ap-northeast-1 s3 sync ./out s3://local-ec-frontend --delete
```

> LocalStack の S3 Website Hosting は本番 S3 と完全一致しない場合があるため、ローカルでは **Nginx で静的配信 + API プロキシ** を使うのが実務上扱いやすいです。

---

## 9. Nginx を CloudFront 代替として使う

`docs/localstack-template/nginx/default.conf` の `__REST_API_ID__` を実値へ置換してください。

```bash
REST_API_ID=$(awslocal --region ap-northeast-1 apigateway get-rest-apis \
  --query "items[?name=='ec-local-api'].id" --output text)

sed -i "s/__REST_API_ID__/${REST_API_ID}/g" docs/localstack-template/nginx/default.conf
```

静的ファイルを Nginx 配信用ディレクトリへ配置:

```bash
mkdir -p docs/localstack-template/dist
cp -r out/* docs/localstack-template/dist/
```

アクセス:

- フロント: `http://localhost:8080`
- API 経由: `http://localhost:8080/api/products`

---

## 10. Cognito と Keycloak の使い分け

### LocalStack Cognito の位置づけ

- User Pool の主要 API は試せますが、**本番 Cognito 完全互換ではありません**。
- Hosted UI / OIDC フローなどで差分が出る場合があります。

### Keycloak 併用時の方針

- ログイン UI や JWT 検証など、認証フロー全体の試験は Keycloak で代替
- API 側は JWT issuer/audience を差し替え可能に実装
- 本番移行時に Cognito issuer へ戻す

---

## 11. よくある注意点（ローカル検証向け）

- LocalStack のバージョンで機能差があるため、`localstack/localstack` のタグ固定を推奨
- Lambda パッケージ更新後は `awslocal lambda update-function-code` を使う
- `init` スクリプトは初回起動で流れる前提のため、再初期化時は `./.localstack` を消して再起動
- この構成は**本番利用不可**（セキュリティ、可用性、監視、データ永続化要件を満たさない）

---

## 12. 最短クイックスタート

```bash
# 1) 起動
cd docs/localstack-template
docker compose up -d

# 2) API ID 取得
REST_API_ID=$(awslocal --region ap-northeast-1 apigateway get-rest-apis --query "items[?name=='ec-local-api'].id" --output text)

# 3) 商品 API テスト
curl "http://localhost:4566/restapis/${REST_API_ID}/dev/_user_request_/products"
```

以上で、S3 / DynamoDB / Lambda / API Gateway / (Cognito 代替として Keycloak) を使ったローカル EC 検証基盤をすぐ試せます。
