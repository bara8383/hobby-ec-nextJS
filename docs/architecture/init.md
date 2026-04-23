# Terraform による AWS 初期プロビジョニング可否（現状評価）

最終確認日: 2026-04-23（UTC）

## 結論（要点）

- **現状の `infra/terraform` で、AWS への基盤リソース作成自体は可能**です。  
  ただし、これは「Terraform 定義に含まれる範囲」に限ります（ECR/ECS(EC2)/IAM/SSM/Secrets Manager/CloudWatch Logs など）。
- **そのまま本番運用に耐える状態ではありません**。不足事項（下記）があるため、アプリを安全・継続運用できる状態にするには追加実装が必要です。

---

## 1) 現状 Terraform で何が作られるか

`infra/terraform/main.tf` から、主に以下が作成されます。

- ECS クラスタ（EC2 launch type）
- ECS タスク定義/サービス
- ECS 用 EC2 インスタンス（ECS Optimized AMI を SSM 公開パラメータから参照）
- ECR リポジトリ
- IAM（ECS instance role / task execution role / GitHub OIDC 用 CI role）
- SSM Parameter Store / Secrets Manager
- CloudWatch Logs

> 参考: Terraform の適用フローは `init` → `plan` → `apply` が公式コマンドです。  
> - `terraform init`: ワーキングディレクトリ初期化  
> - `terraform plan`: 実行計画の確認  
> - `terraform apply`: 計画の実行

---

## 2) 不足事項（現状のままでは不十分な点）

### A. AWS 認証情報・変数値の実値が未準備だと apply できない

- `provider "aws"` は `region = var.aws_region` のみで、認証情報の与え方は外部依存です。
- Terraform 公式では、プロバイダ値は環境変数など外部ソースから与える方式が想定されています。
- したがって、**実行環境に AWS 認証（例: `~/.aws/credentials` または環境変数）が必要**です。

### B. デフォルト VPC 依存

- この Terraform は `data "aws_vpc" "default"` と `data "aws_subnets" "default"` を参照します。
- AWS 公式上、通常はリージョンごとに default VPC が存在しますが、削除済みアカウントでは再作成が必要です。
- **default VPC が無いリージョンでは data source 解決時に失敗します。**

### C. ネットワーク/公開方式が最小構成（本番向け不足）

- 現状は EC2 SG で `container_port` をインターネットへ直接公開する構成です。
- ALB + HTTPS/TLS 終端 + ドメイン運用 + WAF 等の入口設計がありません。
- ECS 公式ではロードバランサ利用（特に ALB）を推奨する記載があります。

### D. OS ライフサイクル面の追従不足

- AMI 参照先が Amazon Linux 2 系 (`/aws/service/ecs/optimized-ami/amazon-linux-2/recommended/image_id`) です。
- AWS 公式では、ECS Optimized AL2 AMI は **2026-06-30 EOL** が案内されています。
- **中長期運用は AL2023 系パラメータへの移行計画が必要**です。

### E. アプリ運用前提の未充足

- `secrets_manager_values` のデフォルトが空文字（例: `DATABASE_URL`）で、実運用値投入が前提です。
- ECR にデプロイ対象イメージ（`:latest`）を push していない場合、サービスは正常稼働できません。
- Terraform state バックエンド（S3 + DynamoDB lock）も未定義のため、チーム運用の衝突耐性が不足します。

---

## 3) 不足解消後の AWS プロビジョニング手順（初心者向け）

ここでは「**この順番で実行すれば迷いにくい**」形で説明します。  
まずは **`terraform plan` まで成功**させることを目標にし、最後に `terraform apply` で作成します。

### ステップ 0: 先に理解しておくこと（重要）

- `plan` は「作成される内容の確認」です（まだ作成しない）。
- `apply` は「実際に AWS に作成する」です。
- いきなり `apply` せず、**必ず `plan` の差分を見てから**進めます。

### ステップ 1: 必要ツールを確認

ローカルで以下が使えることを確認します。

```bash
terraform -version
aws --version
```

- `terraform` が無い場合: Terraform をインストール
- `aws` が無い場合: AWS CLI をインストール

### ステップ 2: AWS 認証を設定

Terraform は AWS 認証情報がないと動きません。  
まず AWS CLI で認証状態を確認します。

```bash
aws sts get-caller-identity
```

- 成功したら、`Account` / `Arn` が表示されます（認証 OK）。
- エラーの場合は、`aws configure` や IAM Identity Center ログイン等を先に実施します。

### ステップ 3: tfvars ファイルを作る

`infra/terraform/terraform.tfvars.example` をコピーして実値を入れます。

```bash
cd infra/terraform
cp terraform.tfvars.example terraform.tfvars
```

最初に最低限チェックするキー:

- `github_owner`, `github_repo`, `github_branch`
- `ssm_parameters.SITE_URL`
- `secrets_manager_values.DATABASE_URL`
- `secrets_manager_values.JWT_SECRET`
- `secrets_manager_values.SESSION_SECRET`

> 注意: サンプル値（`replace-me` やダミー DB URL）のまま apply しないでください。

### ステップ 4: 前提不足を先に解消

次を満たしてから Terraform 実行に進みます。

1. default VPC が存在する（または VPC/Subnet を Terraform 管理へ変更済み）
2. AMI は AL2023 へ移行済み（または移行計画が合意済み）
3. 本番用途なら ALB/TLS/WAF など公開経路を追加済み
4. チーム運用なら state backend（S3 + DynamoDB lock）を定義済み

### ステップ 5: Terraform を実行（init → plan → apply）

```bash
cd infra/terraform
terraform init
terraform plan -var-file=terraform.tfvars -out=tfplan
terraform apply tfplan
```

実行時の見方:

- `Plan: X to add, 0 to change, 0 to destroy` が出れば plan 成功
- `Apply complete!` が出れば apply 成功

### ステップ 6: 作成後の確認

```bash
terraform output
```

最低限の確認ポイント:

- `ecr_repository_url` が出る
- `ecs_cluster_name` が出る
- `ecs_service_name` が出る

### ステップ 7: アプリを動かすための後続作業

Terraform でインフラ作成後、次を行って初めてアプリ稼働に近づきます。

1. ECR にアプリイメージを push
2. ECS サービスを更新（新イメージ反映）
3. CloudWatch Logs でタスク起動ログを確認
4. GitHub Actions を使う場合は OIDC (`id-token: write`) と `aws-actions/configure-aws-credentials` を確認

---

### つまずきやすいポイント（初心者向けチェックリスト）

- `NoCredentialProviders` / `Unable to locate credentials`  
  → AWS 認証が未設定です。ステップ 2 へ戻る。
- `default VPC not found`  
  → default VPC 依存が原因。VPC 前提を見直す。
- ECS タスクが起動しない  
  → ECR イメージ未 push、または Secrets/SSM 値不備を確認。

---

## 4) 公式情報による正当性検証（2026-04-23 時点）

- Terraform `init` / `plan` / `apply` の動作定義（HashiCorp 公式）
  - https://developer.hashicorp.com/terraform/cli/commands/init
  - https://developer.hashicorp.com/terraform/cli/commands/plan
  - https://developer.hashicorp.com/terraform/cli/commands/apply
- Provider 設定と認証値の外部注入（HashiCorp 公式）
  - https://developer.hashicorp.com/terraform/language/block/provider
- default VPC の性質と削除後の再作成（AWS 公式）
  - https://docs.aws.amazon.com/vpc/latest/userguide/default-vpc.html
  - https://docs.aws.amazon.com/vpc/latest/userguide/work-with-default-vpc.html
- ECS サービスにおけるロードバランサ利用（AWS 公式）
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/service-load-balancing.html
- ECS Optimized AMI（AL2 EOL と AL2023 移行）（AWS 公式）
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/ecs-optimized_AMI.html
  - https://docs.aws.amazon.com/AmazonECS/latest/developerguide/al2-to-al2023-ami-transition.html
- GitHub Actions OIDC in AWS（GitHub 公式）
  - https://docs.github.com/en/actions/how-tos/secure-your-work/security-harden-deployments/oidc-in-aws
