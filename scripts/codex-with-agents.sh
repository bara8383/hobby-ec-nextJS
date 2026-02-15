#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
AGENTS_FILE="$ROOT_DIR/AGENTS.md"

if [[ ! -f "$AGENTS_FILE" ]]; then
  echo "AGENTS.md が見つかりません: $AGENTS_FILE" >&2
  exit 1
fi

if ! command -v codex >/dev/null 2>&1; then
  echo "codex コマンドが見つかりません。Codex CLI をインストールしてください。" >&2
  exit 1
fi

if [[ $# -eq 0 ]]; then
  echo "使い方: $0 \"ここに依頼文\"" >&2
  exit 1
fi

USER_PROMPT="$*"
FULL_PROMPT=$(cat <<PROMPT
以下のリポジトリ運用ルールを最初に読み、以後の実装判断で最優先してください。

===== BEGIN AGENTS.md =====
$(cat "$AGENTS_FILE")
===== END AGENTS.md =====

---

依頼:
$USER_PROMPT
PROMPT
)

exec codex "$FULL_PROMPT"
