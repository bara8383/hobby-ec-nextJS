# AGENTS.md


## このプロジェクトの設計・実装方針

以下の 1〜4 は上から順に優先順位が高い。
競合する場合は `1 > 2 > 3 > 4` の順で判断する。

1. Next.js の最新設計を採用する。
2. SEO / AEO((AI Engine Optimization)) を高度に最適化する。
3. リアルタイムチャット機能を実装する。
4. AWS に最小コストでデプロイする。

---

## 作業におけるルール

- PR 本文は必ず日本語で、後述「PR 記載テンプレート」に従う。
- リポジトリへ変更を入れる前に必ず作業ブランチを作成する。

---

## Development Workflow（作業フロー）

1. Understand the task（タスク理解）
2. Create an implementation plan（実装計画）
3. Implement changes（実装）
4. Run tests（テスト）
5. Self-review（セルフレビュー）
6. Report changes（変更報告）
- make PR (refs to "PR template")

---

## PR template (PR 記載テンプレート)

PR の本文は必ずこの順序・見出し名で記載する。

### 1) 実装・修正内容
- 何を変更したかを箇条書きで記載する。
- UI変更時は対象画面/コンポーネント名を書く。

### 2) 実装理由
- 採用理由（性能・保守性・コスト・納期）を詳細に記載する。
- 方針 1〜4 のどれを考慮したか明記する。
- 比較案がある場合は却下理由も記載する。

### 3) 変更ファイル
- 主要ファイルのみを列挙し、各ファイルの変更意図を 1 行で書く。

### 4) 動作確認
- 実行コマンドをコードブロックで記載し、各コマンドに `PASS` / `FAIL` を明記する。
- 手動確認を行った場合は確認手順と結果を記載する。

### 5) 影響範囲
以下 4 項目を必ず記載する（影響なしでも `なし` と書く）：

- Next.js 最新設計への整合性
- SEO 影響
- リアルタイムチャット機能への影響
- AWS コスト影響（増減見込み）

### 6) 提案・懸念点
- repo内のコードにおいて、提案・懸念点を記載する。

### 7) リスクとロールバック
- 想定リスクを箇条書きで記載する。
- 必要に応じてロールバック方法を記載する。

## Self-Review Requirements

Before finalizing any code change or documentation output, the agent MUST perform a self-review.

The self-review must validate the following.

### 1. AEO (AI Engine Optimization)

Verify that content is optimized for AI systems and structured extraction.

Checklist:

- Structured data exists when applicable (JSON-LD)
- FAQ schema used when appropriate
- Semantic HTML structure exists (h1 → h2 → h3)
- Content is machine-readable and logically structured
- Internal links exist where relevant

### 2. SEO Compatibility

Ensure changes do not degrade SEO quality.

Checklist:

- structured data validity
- proper heading hierarchy
- no duplicate title or meta description

### 3. CI Compatibility

Ensure the change will not fail CI gates.

Checklist:

- lint passes
- type checks pass
- tests pass
- AEO validation scripts pass

If potential CI failure is detected, the agent MUST fix the issue before producing the final result.

--------------------------------------------------

## Self-Review Process

Before producing the final result, the agent must internally perform the following steps:

1. Implement the requested change
2. Execute the self-review checklist
3. Identify any issues
4. Fix the issues
5. Only then produce the final answer

The self-review process must never be skipped.

--------------------------------------------------

## CI Alignment

This repository assumes CI gates exist for:

- AEO validation
- SEO checks
- build verification

The agent must assume these checks exist and implement code that will pass them.

--------------------------------------------------
