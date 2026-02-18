# Chat SSE + SQS 最小CDK構成

本ディレクトリは、チャット機能向けの最小AWSリソースを定義します。

## 作成リソース

- DynamoDB
  - `ChatConversations`
  - `ChatMessages`
  - `ChatUserQueue`
- IAM Policy（Next.js実行ロールに付与想定）
  - DynamoDBの `GetItem/PutItem/Query`
  - SQSの `CreateQueue/GetQueueUrl/ReceiveMessage/SendMessage/DeleteMessage`

## デプロイ例

```bash
cd infra/cdk
npm install
npx cdk synth
npx cdk deploy
```
