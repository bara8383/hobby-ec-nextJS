# Digital Creator Market (Next.js)

壁紙・写真・図やイラスト・デジタル音楽を販売する、Next.js App Router ベースのデジタル商品ECです。  
本リポジトリの本番デプロイ前提は **ECS on EC2（single-instance / single-task）** です。

## 現在の本番構成（最小実用）

- ECS on EC2
- ECS Cluster: 1
- EC2 Instance: 1（ECS container instance）
- ECS Service: 1
- ECS Task: 1
- ECR: 1
- CloudWatch Logs
- ALB なし（EC2 側公開）

> chat は **single-instance 前提** です。multi-instance 対応（状態外部化）は本スコープ外です。

## Next.js / SEO / Chat 方針

- Next.js App Router + `output: "standalone"` を継続
- SEO を損なわない（metadata / JSON-LD / robots / sitemap 維持）
- chat の現状 API / SSE 動作を壊さない

## Docker 運用

- `Dockerfile` は standalone 生成物で起動します
- `public` が存在しない場合でも build 失敗しないよう `mkdir -p public` を実行
- ヘルスチェックエンドポイント: `GET /api/health`

## 環境変数方針（build-time と runtime）

- `NEXT_PUBLIC_*` は原則 build-time 値
- server-only 値は ECS タスク runtime 注入を優先
- 機密値は Docker build args に渡さない
- 機密値は task definition `secrets` で注入し、`environment` へ直書きしない

## SSM / Secrets Manager の責務表

| 保存先 | 例 | 取り扱い |
|---|---|---|
| Secrets Manager | `DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`, OAuth secret, API secret, webhook secret, private key, password/token | 漏洩時に重大事故へ直結する値 |
| SSM Parameter Store | `APP_ENV`, `AWS_REGION`, `SITE_URL`, `LOG_LEVEL`, `CHAT_STORAGE_MODE`, 各種 table/bucket/queue 名 | 非機密の環境依存設定 |

## 初回 bootstrap 手順（Terraform apply）

まず `infra/terraform/bootstrap` で、GitHub Actions が以後利用する以下を 1 回だけ作成します。

- Terraform state 用 S3 bucket
- Terraform lock 用 DynamoDB table
- GitHub Actions OIDC provider
- GitHub Actions 用 IAM role

```bash
cp infra/terraform/bootstrap/terraform.tfvars.example infra/terraform/bootstrap/terraform.tfvars
cd infra/terraform/bootstrap
terraform init
terraform fmt -recursive
terraform validate
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

bootstrap 完了後、出力された `github_actions_role_arn` / state bucket / lock table を使って、GitHub Secrets / Variables を設定します。

### bootstrap が 403 で止まったとき

`aws_iam_openid_connect_provider.github` の作成で 403 が出た場合は、実行中の SSO ロールに IAM 作成権限が不足しています。

最低限、次の権限が必要です。

- `iam:CreateOpenIDConnectProvider`
- `iam:GetOpenIDConnectProvider`
- `iam:TagOpenIDConnectProvider`
- `iam:CreateRole`
- `iam:GetRole`
- `iam:TagRole`
- `iam:PutRolePolicy`
- `iam:GetRolePolicy`

S3 bucket / DynamoDB table が途中まで成功していても、`infra/terraform/bootstrap/terraform.tfstate` はそのまま保持してください。
権限付与後に `terraform plan -var-file=terraform.tfvars` と `terraform apply -var-file=terraform.tfvars` を再実行すれば、残りの IAM 3 リソースを継続作成できます。

また、`infra/terraform/bootstrap/terraform.tfvars` の `github_owner` は実際の GitHub owner に合わせてください。
本リポジトリでは `bara8383` です。ここが誤っていると apply 完了後も GitHub Actions の OIDC AssumeRole が失敗します。

## 本番スタック初回デプロイ手順（Terraform apply）

`infra/terraform` は bootstrap 後に remote state 前提で利用します。

```bash
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars
cp infra/terraform/backend.hcl.example infra/terraform/backend.hcl
cd infra/terraform
terraform init -backend-config=backend.hcl
terraform fmt -recursive
terraform validate
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

Terraform 出力で以下を取得します。

- `ecs_cluster_name`
- `ecs_service_name`
- `ecr_repository_url`
- `ecs_instance_public_ip`

## GitHub Actions デプロイ

`.github/workflows/infra-terraform.yml` は Terraform の `plan/apply` を実行します。  
`.github/workflows/deploy-ecs-ec2.yml` はアプリの build / image push / ECS 反映を実行します。

### GitHub Variables

- `AWS_REGION`
- `TF_STATE_BUCKET`
- `TF_LOCK_TABLE`
- `TF_STATE_KEY`（任意。未設定時は `infra/terraform/prod.tfstate`）
- `TF_PROJECT_NAME`
- `TF_ENV`
- `TF_INSTANCE_TYPE`
- `TF_CONTAINER_PORT`
- `TF_PUBLIC_INGRESS_CIDRS`（JSON 配列文字列。例 `["0.0.0.0/0"]`）
- `TF_SSM_PARAMETERS_JSON`（JSON object 文字列）
- `ECS_CLUSTER_NAME`
- `ECS_SERVICE_NAME`
- `ECR_REPOSITORY_NAME`（Terraform の ECR リポジトリ名）

### GitHub Secrets

- `AWS_CI_ROLE_ARN`（bootstrap 出力 `github_actions_role_arn`）
- `TF_SECRETS_MANAGER_VALUES_JSON`（JSON object 文字列）

`infra-terraform.yml` はこれらの Variables / Secrets から `terraform.auto.tfvars.json` を組み立てて実行します。  
ローカル apply を続けたい場合のみ、`infra/terraform/backend.hcl` と `infra/terraform/terraform.tfvars` をローカルに置いてください。

## 起動・停止・ログ・ロールバック

### 起動

```bash
aws ecs update-service --cluster <cluster> --service <service> --desired-count 1
```

### 停止（コスト削減）

```bash
aws ecs update-service --cluster <cluster> --service <service> --desired-count 0
aws ec2 stop-instances --instance-ids <instance-id>
```

### ログ確認

```bash
aws logs tail /ecs/<project>-<env> --follow
```

### ロールバック

```bash
# 直前のタスク定義リビジョンへ戻して再デプロイ
aws ecs update-service --cluster <cluster> --service <service> --task-definition <family:revision>
```

## single-instance 制約

- max=1 前提（自動スケーリング無効）
- EC2 障害時はサービス停止
- chat の水平分散は未対応
- Blue/Green / ALB / Route53 / ACM / Fargate は本スコープ外

## ローカル開発

```bash
npm ci
npm run dev
```

または:

```bash
cp .env.example .env
docker compose -f docker-compose.local.yml up --build
```
