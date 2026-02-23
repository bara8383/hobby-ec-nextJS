## envファイルの扱い方

- .env* は基本gitの管理外。理由は秘密情報管理。
- チームで共有する場合は.env.exampleにテンプレートを作成し、git管理。

### 秘密情報管理

AWSでデプロイ想定
- AWS KMSなどに.env.prodの秘密情報を置いておく
- github actionsによるAWSへのpush時に、OICDによる認証(github ationsの環境とawsの環境の間)で.env.prodに秘密情報を差し込むとヒューマンエラーを少なくしやすい。


