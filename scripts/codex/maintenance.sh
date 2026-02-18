#!/usr/bin/env bash
set -euo pipefail

echo "[codex-maintenance] Node.js version"
node -v

echo "[codex-maintenance] npm version"
npm -v

# 通常のキャッシュ再開時は npm ci は不要です。
# 依存ロックファイル変更時のみ手動で実行してください:
# npm ci

# 必要時のみビルド確認を有効化してください:
# npm run build
