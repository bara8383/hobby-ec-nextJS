# Terraform + EC2 + GitHub OIDC + SSM 運用ガイド（prod 専用）

このドキュメントは、**長期 AccessKey を使わず**、**SSH なし（SSM のみ）**で EC2 本番運用を行うための一本道手順です。

- 対象: `prod` のみ（stg/qa は作らない）
- インフラ管理: Terraform
- CI/CD 認証: GitHub Actions OIDC（短期認証）
- デプロイ方式: SSM Run Command で `scripts/deploy/ec2_deploy.sh` を実行

---

## 1) SSO bootstrap の意味（最初だけ人間が terraform apply する）

最初はまだ GitHub Actions が Assume できる IAM ロール（OIDC ロール）が存在しないため、
**人間が AWS SSO ログイン済み端末から 1 回だけ Terraform apply** します。

この bootstrap で以下が作られます。

- EC2 + Security Group
- EC2 用 IAM ロール + Instance Profile（AmazonSSMManagedInstanceCore 付与）
- GitHub OIDC Provider
- GitHub Actions が Assume する CI ロール

2 回目以降は、GitHub Actions から OIDC ロールを使って Terraform 適用できます。

---

## 2) 初回に必要な値

`infra/terraform/terraform.tfvars` を作成して、最低限以下を設定します。

- `aws_region`: 例 `ap-northeast-1`
- `project_name`: 例 `hobby-ec`
- `env`: `prod`（固定）
- `instance_type`: 例 `t3.small`
- `allow_ssh`: 通常 `false`
- `ssh_cidr`: `allow_ssh=true` の時のみ使用
- `github_owner`: GitHub オーナー
- `github_repo`: リポジトリ名
- `github_branch`: 通常 `main`
- `github_thumbprints`: GitHub OIDC 用 thumbprint

例は `infra/terraform/terraform.tfvars.example` を参照してください。

### GitHub thumbprint の考え方

- OIDC Provider の `thumbprint_list` は将来更新される可能性があります。
- まずは現在の推奨値を設定し、失効時は更新して `terraform apply` します。
- 本スタックでは `github_thumbprints` 変数で外だししているため、コード変更なしで差し替えできます。

---

## 3) ローカルでの bootstrap 手順（aws sso login → terraform apply）

```bash
# 1. AWS SSO ログイン
aws sso login --profile <your-sso-profile>

# 2. tfvars 作成
cp infra/terraform/terraform.tfvars.example infra/terraform/terraform.tfvars

# 3. 値を編集（github_owner, github_repo, aws_region など）

# 4. Terraform 実行
cd infra/terraform
AWS_PROFILE=<your-sso-profile> terraform init
AWS_PROFILE=<your-sso-profile> terraform fmt -recursive
AWS_PROFILE=<your-sso-profile> terraform validate
AWS_PROFILE=<your-sso-profile> terraform plan -var-file=terraform.tfvars
AWS_PROFILE=<your-sso-profile> terraform apply -var-file=terraform.tfvars
```

apply 完了後、`ci_role_arn` が出力されます。

---

## 4) GitHub Actions で回す手順（以後は Actions のみ）

### 4-1. GitHub 側設定

Repository の Settings で以下を設定します。

- **Secrets**
  - `AWS_CI_ROLE_ARN`: Terraform 出力 `ci_role_arn`
- **Variables**
  - `AWS_REGION`
  - `GITHUB_OWNER`
  - `GITHUB_REPO`
  - `GITHUB_BRANCH`（任意、未設定時は `main`）

### 4-2. ワークフロー

- `infra-terraform.yml`
  - `push(main)` と `workflow_dispatch` で Terraform を `init/plan/apply`
  - 認証は `aws-actions/configure-aws-credentials@v4` + OIDC
- `deploy-ec2-ssm.yml`
  - `push(main)` で SSM Run Command を実行
  - タグ `Env=prod` かつ `Role=web` のインスタンスに対してデプロイスクリプトを起動

---

## 5) EC2 が SSM managed nodes に現れる確認

EC2 へ付与した IAM ロールに `AmazonSSMManagedInstanceCore` をアタッチしているため、
起動後しばらくすると Managed Node に登録されます。

```bash
aws ssm describe-instance-information \
  --region <aws_region> \
  --query 'InstanceInformationList[].InstanceId'
```

対象 EC2 の InstanceId が表示されれば、SSM 配下として操作可能です。

---

## 6) コスト事故防止（重要）

- 本構成は最小構成（単一 EC2 + default VPC）
- ALB / RDS / NAT Gateway / Elastic IP は作成しない
- 使わない期間は EC2 を停止（ただし EBS 課金は継続）
- 不要になったら `terraform destroy` で削除

```bash
cd infra/terraform
terraform destroy -var-file=terraform.tfvars
```

> `destroy` 前に `terraform plan -destroy` で削除対象を確認してください。

---

## 付録: デプロイスクリプトの動作

`deploy-ec2-ssm.yml` は SSM 経由で `scripts/deploy/ec2_deploy.sh` を実行します。

スクリプトの処理内容:

1. `/opt/app` を作成
2. 初回は clone、2 回目以降は fetch/reset
3. `docker compose down || true`
4. `docker compose up -d --build`
5. `docker image prune -f || true`

これにより、SSH 鍵管理なしで本番反映できます。
