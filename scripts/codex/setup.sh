#!/usr/bin/env bash
set -euo pipefail

echo "[codex-setup] Node.js version"
node -v

echo "[codex-setup] npm version"
npm -v

echo "[codex-setup] Installing dependencies via npm ci"
npm ci

echo "[codex-setup] Building application"
npm run build
# NOTE: 初回セットアップ時間を短縮したい場合のみ、上行をコメントアウトしてください。
