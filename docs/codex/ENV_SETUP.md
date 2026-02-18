# Codex Environment Setup Script 運用

`chatgpt.com/codex` の Environment 設定画面にある **Setup Script** 欄には、
`scripts/codex/setup.sh` の中身をそのまま貼り付けて運用してください。

## 前提

- このリポジトリは `package-lock.json` を正として扱うため、依存導入は `npm ci` を利用します。
- Codex Cloud は Setup Script フェーズではインターネットアクセスを利用できますが、agent フェーズではネットワークが制限されることがあります。
- そのため、依存導入は Setup Script フェーズで完了させる前提にします。

## 推奨フロー

1. `scripts/codex/setup.sh` を開く。
2. ファイル内容をコピーする。
3. Codex Environment の **Setup Script** に貼り付ける。
4. Environment のインターネットアクセス設定は最小権限を推奨します（例: Common dependencies レベル）。

## 補助スクリプト

- `scripts/codex/maintenance.sh`
  - キャッシュ再開時の軽量メンテナンス用途です。
  - 通常は `npm ci` を再実行せず、必要時のみコメントアウトを外して実行してください。

## ローカル検証と CI の住み分け

ローカル検証は `docker compose` を基本とし、再現性のある挙動確認を行います。
一方で、PR の品質ゲートは GitHub Actions CI（`npm ci` / `lint` / `build`）を真実として扱います。
この住み分けにより、ローカルの開発効率とマージ時の品質保証を両立します。
