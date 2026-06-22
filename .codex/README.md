# Codex Subagents 開発ループ

## 目的

このディレクトリは、Codex Subagents を使って改善提案、実装、品質レビュー、人間向けプロダクトレビュー準備を分離するための project-scoped agent 構成です。

Codex 公式の custom agent 仕様に合わせ、各 agent は `.codex/agents/*.toml` に配置しています。各 TOML は `name`、`description`、`developer_instructions` を持ち、必要に応じて `model_reasoning_effort`、`sandbox_mode`、`nickname_candidates` を設定しています。

設計では、Codex 公式ドキュメントの「project-level custom agent を TOML で定義する」考え方、VoltAgent 系 awesome subagents の責務分離、agent-skills / PM skills 系の品質ゲート・意思決定ゲート・出力形式固定の考え方を参考にしています。ただし、外部 OSS の本文はコピーせず、このリポジトリの開発ループ向けに最小構成へ調整しています。

## 人間と Codex の役割分担

### 人間の役割

1. 改善案の採用 / 却下 / 保留を決める意思決定者
2. 実装後のプロダクトを実際に触ってレビューするプロダクトレビュアー

### Codex の役割

- 改善案を出す
- 人間の意思決定を実装可能な作業に変換する
- 採用案だけを実装する
- 実装後に品質 / セキュリティ / 退行 / 意図ズレをレビューする
- 人間がプロダクトレビューしやすいように変更点・確認手順・判断ポイントを整理する
- 人間レビュー内容から次の改善案を出す

## 開発フロー

1. Codex: `improvement-proposer` が改善案を出す
2. 人間: 採用 / 却下 / 保留を決める
3. Codex: `implementer` が採用案だけを実装する
4. Codex: `quality-reviewer` が品質レビューする
5. Codex: `product-review-packager` が人間レビュー用資料を作る
6. 人間: 実際のプロダクトを触ってレビューする
7. Codex: 人間レビューをもとに `improvement-proposer` が次の改善案を出す
8. 1 に戻る

## 各 agent の責務

### improvement-proposer

- 現状、直近のレビュー、未解決課題から改善案を出す
- A 案 / B 案 / C 案 / 保留案のように選択肢を提示する
- 各案に目的、期待効果、実装コスト、リスク、採用判断ポイントを付ける
- 実装はしない
- 人間の意思決定を要求する

### implementer

- 人間が採用した改善案だけを実装する
- 未採用案や保留案を勝手に実装しない
- スコープ外のリファクタリングをしない
- 小さく安全に変更する
- 変更後に実行すべき確認コマンドを提示する

### quality-reviewer

- 人間がプロダクトを見る前に、実装内容をレビューする
- 観点は security / bug / regression / test / maintainability / unintended behavior / performance
- architecture risk は必要な場合だけ見る
- style-only な指摘は避ける
- 重大度つきで指摘する
- 修正案は出してよいが、勝手に実装しない

### product-review-packager

- 人間が実際にプロダクトをレビューしやすいように整理する
- 変更点、確認手順、見るべき画面 / URL、前回との差分、既知の未解決事項、判断してほしいポイント、人間レビュー用チェックリストを出す
- 実装や設計変更はしない

## いつどの agent を spawn するか

| タイミング | spawn する agent | 目的 |
| --- | --- | --- |
| 次に何を改善するか決めたいとき | `improvement-proposer` | 実装前に選択肢と判断材料を作る |
| 人間が採用案を明示したあと | `implementer` | 採用案だけを小さく実装する |
| 実装直後、人間が触る前 | `quality-reviewer` | 重大な品質・セキュリティ・退行リスクを先に潰す |
| 人間レビューを依頼する直前 | `product-review-packager` | 確認手順と判断ポイントを整理する |
| 人間レビューのフィードバック後 | `improvement-proposer` | 次サイクルの改善案に変換する |

## Codex に投げるプロンプト例

### 例1: 改善案を出す

```text
Spawn improvement-proposer.
Analyze the current repository state, recent changes, and known product direction.
Do not implement anything.
Return improvement proposals as A/B/C options with impact, cost, risk, and decision points.
Wait for my decision.
```

### 例2: 採用案だけ実装する

```text
Spawn implementer.
Implement only the options I explicitly accepted:
- A: <採用内容>
- C: <採用内容>
Do not implement rejected or deferred options.
Keep changes minimal.
After implementation, summarize changed files and validation commands.
```

### 例3: 品質レビューする

```text
Spawn quality-reviewer.
Review the latest implementation before human product review.
Focus on security, bugs, regressions, tests, maintainability, unintended behavior, and performance.
Do not edit code.
Return findings by severity with evidence and recommended fixes.
```

### 例4: 人間レビュー用に整理する

```text
Spawn product-review-packager.
Prepare a review package for a human product reviewer.
Include what changed, where to look, how to verify, known issues, screenshots/URLs if available, and decision points.
Do not edit code.
```

## 注意点

- 大きな方針変更は、人間が採用を明示するまで実装しないでください。
- `implementer` に渡す採用案は、箇条書きで明確にしてください。
- `quality-reviewer` と `product-review-packager` は read-only 前提です。修正が必要な場合は、再度人間が採用判断を行い、`implementer` に渡してください。
- UI 変更を含む場合は、可能なら `product-review-packager` に対象 URL、確認手順、スクリーンショット有無を整理させてください。
- このリポジトリでは Next.js 最新設計、SEO / AEO、リアルタイムチャット、AWS 最小コストの優先順位を意識してください。
- agent 構成を増やしすぎると運用が複雑になるため、常駐 agent はこの 4 つに限定します。
