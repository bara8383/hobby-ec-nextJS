# AWS SSO Role Profile Setup

最終確認日: 2026-04-26

このメモは、AWS アクセスポータルで対象ロールが見える状態か確認し、そのロールをローカル AWS CLI から使えるように設定するまでの手順。

## 前提

- AWS CLI v2 を使う。
- AWS IAM Identity Center のユーザーが作成済み。
- 対象 AWS アカウントに利用したい permission set / role が割り当て済み。
- ローカル profile 名は任意。手順内では `<ローカルprofile名>` と書く。

注意:

- AWS 側に表示される permission set / role 名は、アカウントや用途によって異なる。手順内では `<対象ロール名>` と書く。
- ローカル AWS CLI の profile 名は自分で決める別名。コマンド実行時は完全一致が必要。

## 1. アクセスポータルで対象ロールが見えるか確認

1. AWS アクセスポータルにログインする。
2. 対象 AWS アカウントを開く。
3. permission set / role の一覧に `<対象ロール名>` が表示されていることを確認する。
4. `<対象ロール名>` の `Access keys` または `Command line or programmatic access` を開く。
5. 次の値を控える。

- SSO start URL
- SSO region
- AWS account ID
- Role name: `<対象ロール名>`
- Default region: `ap-northeast-1`

`<対象ロール名>` が見えない場合は、ローカル設定では解決できない。IAM Identity Center 側で対象ユーザーまたはグループに permission set を割り当てる必要がある。

## 2. ローカルに profile を追加

以下を実行する。

```bash
aws configure sso --profile <ローカルprofile名>
```

対話プロンプトでは、アクセスポータルで確認した値を入力する。

入力例:

```text
SSO session name (Recommended): <SSOセッション名>
SSO start URL [None]: <SSO start URL>
SSO region [None]: <SSO region>
SSO registration scopes [None]: sso:account:access
CLI default client Region [None]: ap-northeast-1
CLI default output format [None]: json
CLI profile name [<対象ロール名>-<AWSアカウントID>]: <ローカルprofile名>
```

補足:

- AWS CLI v2.22.0 以降は、ブラウザがある端末では PKCE 認可がデフォルト。
- 別端末で認証コードを入力したい場合は `--use-device-code` を使う。

```bash
aws configure sso --profile <ローカルprofile名> --use-device-code
```

## 3. SSO ログイン

```bash
aws sso login --profile <ローカルprofile名>
```

ブラウザで認証を完了する。

認証情報は `~/.aws/sso/cache` 配下にキャッシュされる。期限切れになった場合は、同じコマンドで再ログインする。

## 4. profile が使えるか確認

```bash
aws sts get-caller-identity --profile <ローカルprofile名>
```

期待する状態:

- `Account` が対象 AWS アカウント ID と一致する。
- `Arn` に `AWSReservedSSO_<対象ロール名>` を含む role が表示される。
- エラーにならない。


## 公式情報

- AWS CLI: Configuring IAM Identity Center authentication with the AWS CLI
  - https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-sso.html
- AWS CLI: aws sso login
  - https://docs.aws.amazon.com/cli/latest/reference/sso/login.html
