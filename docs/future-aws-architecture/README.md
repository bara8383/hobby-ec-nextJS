# 将来AWS構成（低コスト優先）

このドキュメントは、現状の Next.js 単一コンテナ構成を起点に、トラフィック増加時に段階移行できる将来構成を整理したものです。

## 1. 構成方針

- フェーズ1（最小コスト）: Lightsail Containers 単一サービス
- フェーズ2（可用性向上）: App Runner または ECS Fargate へ移行
- フェーズ3（機能分離）: チャット状態を ElastiCache / DynamoDB へ外部化

## 2. Mermaid 図

```mermaid
flowchart LR
  U[User Browser] --> CF[CloudFront]
  CF --> APP[Next.js Container\n(Lightsail/App Runner/ECS)]
  APP --> S3[S3 Assets]
  APP --> CHAT[(ElastiCache Redis\nor DynamoDB)]
  APP --> CW[CloudWatch Logs]
```

## 3. Markdown で確認できる簡易図（テキスト）

```text
[User Browser]
      |
      v
 [CloudFront]
      |
      v
 [Next.js Container] ---> [S3 Assets]
      |\
      | \----> [CloudWatch Logs]
      |
      \-------> [Chat Store: Redis or DynamoDB]
```

## 4. フェーズ別の推奨構成

### フェーズ1: 立ち上げ（最小コスト）

- Next.js standalone を単一コンテナで公開
- チャットはインメモリ（低負荷前提）
- 目的: 固定費最小化とリリース速度確保

### フェーズ2: 負荷増加時

- App Runner / ECS Fargate に移行
- オートスケールでピーク対応
- CloudWatch 監視を強化

### フェーズ3: チャット信頼性強化

- SSEのメッセージ状態を ElastiCache Redis または DynamoDB へ移行
- 複数インスタンスでも配信整合性を担保

## 5. コスト観点の目安

- 開発初期: Lightsail Containers（最小プラン）
- 伸長時: App Runner（運用簡素） or ECS Fargate（柔軟性高）
- 状態管理追加時: Redisは低遅延、DynamoDBは運用負荷低め

## 6. ローカル検証との対応

- ローカル本番近似: `docker compose up --build`
- 移行前提の検証: コンテナ起動 / SEO出力 / チャットSSEの正常性
- 将来差分: マルチインスタンス整合性はローカル単体では再現不可（外部ストア導入時に別途検証）
