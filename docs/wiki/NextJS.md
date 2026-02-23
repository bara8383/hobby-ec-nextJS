# NextJS

## envファイルの扱い方

- .env* は基本gitの管理外。理由は秘密情報管理。
- チームで共有する場合は.env.exampleにテンプレートを作成し、git管理。
- ただし、基本nextJSの参照は.envであるから、.env.exampleからコピペする