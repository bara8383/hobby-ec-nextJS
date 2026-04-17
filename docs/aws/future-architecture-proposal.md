# AWS 将来構成案アーキテクチャ図（提案）

将来スケールを見据えた構成案です。現行 Terraform 実装とは別に、段階的移行を想定した図として記載します。

```mermaid
flowchart TB
  User["User Browser"] --> R53["Route 53"]
  R53 --> WAF["AWS WAF"]
  WAF --> CF["CloudFront"]

  CF --> S3["S3\n(静的アセット)"]
  CF --> ALB["Application Load Balancer"]

  subgraph PrivateSubnets["Private Subnets"]
    ECS["ECS Fargate Service\n(Next.js)"]
    Worker["ECS Fargate Worker\n(Chat非同期処理)"]
    Redis["ElastiCache Redis\n(セッション/キャッシュ)"]
    RDS["Aurora PostgreSQL"]
  end

  ALB --> ECS
  ECS --> Redis
  ECS --> RDS
  ECS --> SQS["SQS\n(Chat Queue)"]
  Worker --> SQS
  Worker --> RDS

  ECS --> CW["CloudWatch Logs / Metrics"]
  Worker --> CW

  ECS --> SM["Secrets Manager"]
  ECS --> SSM["SSM Parameter Store"]
  Worker --> SM
  Worker --> SSM

  GH["GitHub Actions\nOIDC"] --> IAM["IAM OIDC Role"]
  IAM --> ECR["ECR"]
  IAM --> ECS
```

## 補足
- 本図は「将来構成案」であり、現行の `infra/terraform/main.tf` にそのまま一致するものではありません。
- 目的は、配信最適化（CloudFront）、可用性向上（Fargate + ALB）、データ永続化（Aurora）、チャット負荷分離（SQS + Worker）の方向性を可視化することです。
