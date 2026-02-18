#!/usr/bin/env bash
set -euo pipefail

APP_DIR="/opt/app"
REPO_URL="https://github.com/${GITHUB_OWNER:?GITHUB_OWNER is required}/${GITHUB_REPO:?GITHUB_REPO is required}.git"
BRANCH="${GITHUB_BRANCH:-main}"

mkdir -p "$APP_DIR"

if [ -z "$(find "$APP_DIR" -mindepth 1 -maxdepth 1 2>/dev/null)" ]; then
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
else
  git -C "$APP_DIR" fetch origin "$BRANCH"
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
fi

cd "$APP_DIR"
docker compose down || true
docker compose up -d --build
docker image prune -f || true
