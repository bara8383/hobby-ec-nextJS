#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<USAGE >&2
使い方:
  $0 --title "PRタイトル" --body-file .github/pr-body.md [--base main] [--head ブランチ]

説明:
  gh CLI でPRを作成した後、タイトル/本文にプレースホルダー文が混入していないか検証します。
  検出時は指定した title/body で自動的に上書きします。
USAGE
  exit 1
}

TITLE=""
BODY_FILE=""
BASE="main"
HEAD=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --title)
      TITLE="${2:-}"
      shift 2
      ;;
    --body-file)
      BODY_FILE="${2:-}"
      shift 2
      ;;
    --base)
      BASE="${2:-}"
      shift 2
      ;;
    --head)
      HEAD="${2:-}"
      shift 2
      ;;
    *)
      usage
      ;;
  esac
done

[[ -n "$TITLE" && -n "$BODY_FILE" ]] || usage
[[ -f "$BODY_FILE" ]] || { echo "body file が存在しません: $BODY_FILE" >&2; exit 1; }

if ! command -v gh >/dev/null 2>&1; then
  echo "gh コマンドが見つかりません。GitHub CLI をインストールしてください。" >&2
  exit 1
fi

if [[ -z "$HEAD" ]]; then
  HEAD="$(git branch --show-current)"
fi

BODY_CONTENT="$(cat "$BODY_FILE")"

PR_URL="$(gh pr create --base "$BASE" --head "$HEAD" --title "$TITLE" --body "$BODY_CONTENT")"
PR_NUMBER="${PR_URL##*/}"

PR_TITLE="$(gh pr view "$PR_NUMBER" --json title -q .title)"
PR_BODY="$(gh pr view "$PR_NUMBER" --json body -q .body)"

PLACEHOLDER_PATTERNS=(
  "Codex generated this pull request, but encountered an unexpected error after generation. This is a placeholder PR message."
  "Codex-generated pull request"
)

needs_fix=0
for pattern in "${PLACEHOLDER_PATTERNS[@]}"; do
  if [[ "$PR_TITLE" == *"$pattern"* || "$PR_BODY" == *"$pattern"* ]]; then
    needs_fix=1
    break
  fi
done

if [[ "$needs_fix" -eq 1 ]]; then
  echo "プレースホルダー文を検出したため、PR本文/タイトルを上書きします: #$PR_NUMBER" >&2
  gh pr edit "$PR_NUMBER" --title "$TITLE" --body-file "$BODY_FILE" >/dev/null
fi

echo "$PR_URL"
