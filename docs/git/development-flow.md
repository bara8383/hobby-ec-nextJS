# Git flow / CI/CD 運用

このドキュメントは、開発ブランチ、CI、アプリデプロイ、Terraform によるインフラ変更の運用方針を整理する。

## ブランチ方針

```text
feature/* -> develop -> main
```

- 通常開発は `feature/*` から `develop` へ PR を作成する
- `develop` はメイン開発ブランチとして CI / ローカル動作確認の基準にする
- 本番反映は `develop` から `main` へ PR を作成する
- `main` は本番反映対象ブランチとして扱う

## CI

- CI は `develop` / `main` への PR と push で実行する
- CI では lint / typecheck / build を確認する
- SEO / AEO に影響する変更では metadata、JSON-LD、heading、内部リンクの劣化がないことをセルフレビューする

対象 workflow:

- `.github/workflows/ci.yml`

## アプリデプロイ

- アプリは `main` push をトリガーに ECS on EC2 へ自動デプロイする
- アプリデプロイは GitHub Actions の `workflow_dispatch` でも手動実行できる
- デプロイ対象は ECS on EC2 の single-instance / single-task 構成とする
- 手動デプロイは緊急時の再実行や、本番反映の明示実行が必要な場合に使う

対象 workflow:

- `.github/workflows/deploy-ecs-ec2.yml`

## Terraform / インフラ変更

- Terraform は PR / `main` push では `plan` まで自動実行する
- Terraform の `apply` は GitHub Actions の手動実行 + `production` Environment 承認後のみ実行する
- アプリデプロイとインフラ変更は分離して扱う
- インフラ変更はアプリデプロイより影響範囲が大きいため、自動 apply は行わない

対象 workflow:

- `.github/workflows/infra-terraform.yml`

## 運用上の注意

- `production` Environment には承認者を設定する
- Terraform plan の結果を確認してから apply を承認する
- ECS on EC2 の現行構成では ALB なし、EC2 直接公開、desired count 1 を前提にする
- chat は single-instance 前提のため、水平分散や Blue/Green 化は別途設計する
