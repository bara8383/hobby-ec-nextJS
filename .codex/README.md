# Codex Subagents 開発ループ

## 目的

このディレクトリは、Codex Subagents を使って改善提案、AI による採用判断、実装、品質レビュー、人間向けプロダクトレビュー準備を分離するための project-scoped agent 構成です。

Codex 公式の custom agent 仕様に合わせ、各 agent は `.codex/agents/*.toml` に配置しています。各 TOML は `name`、`description`、`developer_instructions` を持ち、必要に応じて `model_reasoning_effort`、`sandbox_mode`、`nickname_candidates` を設定しています。

設計では、Codex 公式ドキュメントの「project-level custom agent を TOML で定義する」考え方、VoltAgent 系 awesome subagents の責務分離、agent-skills / PM skills 系の品質ゲート・意思決定ゲート・出力形式固定の考え方を参考にしています。ただし、外部 OSS の本文はコピーせず、このリポジトリの開発ループ向けに最小構成へ調整しています。

## 人間と Codex の役割分担

### 人間の役割

1. AI の採用 / 却下 / 保留判断を監査する decision quality auditor
2. 実装後のプロダクトを実際に触ってレビューするプロダクトレビュアー
3. 採用判断基準を保守する maintainer

### Codex の役割

- 改善案を出す
- 改善案を評価し、採用 / 却下 / 保留を判断する
- AI の採用判断を実装可能な作業に変換する
- 採用案だけを実装する
- 実装後に品質 / セキュリティ / 退行 / 意図ズレをレビューする
- 実画面の視覚的完成度とインターフェース設計を、責務を分けてレビューする
- 人間がプロダクトレビューしやすいように変更点・確認手順・判断ポイントを整理する
- 人間レビュー内容から次の改善案を出す

## 開発フロー

1. Codex: `improvement-proposer` が改善案を出す
2. Codex: `decision-reviewer` が改善案を評価し、採用 / 却下 / 保留を決める
3. Codex: `implementer` が `decision-reviewer` の採用案だけを実装する
4. Codex: `quality-reviewer` が品質レビューする
5. UI変更がある場合、Codex: `ui-design-reviewer` と `interface-design-reviewer` が担当範囲を分けてレビューする
6. Codex: `product-review-packager` が人間レビュー用資料を作る
7. 人間: 実際のプロダクトを触ってレビューし、AI の採用判断品質を監査する
8. Codex: 人間レビューと監査結果をもとに `improvement-proposer` が次の改善案を出す
9. 1 に戻る

## 各 agent の責務

### improvement-proposer

- 現状、直近のレビュー、未解決課題から改善案を出す
- A 案 / B 案 / C 案 / 保留案のように選択肢を提示する
- 各案に目的、期待効果、実装コスト、リスク、採用判断ポイントを付ける
- 実装はしない
- 採用判断に必要な材料を `decision-reviewer` に渡せる形で整理する

### decision-reviewer

- `improvement-proposer` の改善案を評価する
- 採用 / 却下 / 保留を判断する
- 判断基準は modern Next.js architecture、SEO / AEO、ecommerce UX、real-time chat、minimum AWS cost、learning value
- 小さく、戻しやすく、検証価値の高い改善を優先する
- 投機的な大規模リライトや、明確なプロダクト価値のない AWS コスト増を避ける
- 実装はしない
- `implementer` へ採用案だけを handoff する

### implementer

- `decision-reviewer` が採用した改善案だけを実装する
- 却下案や保留案を勝手に実装しない
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

### ui-design-reviewer

- `.agents/skills/review-ui-design/` のskillを必ず使用する
- 配色、タイポグラフィ、アイコン、画像、装飾、ブランド表現をレビューする
- UIの視覚的一貫性、印象、完成度を実画面またはスクリーンショットで評価する
- 情報設計、コンポーネント配置、UI状態、操作フロー、実装品質は評価しない
- `visual-design-reviewer` に相当する責務を、`ui-design-reviewer` という名前で担う

### interface-design-reviewer

- `.agents/skills/review-interface-design/` のskillを必ず使用する
- 情報階層、レイアウト、コンポーネント、操作要素の識別性をレビューする
- loading、empty、error、disabledなどの状態設計とレスポンシブ配置を評価する
- 配色の美しさ、装飾、ブランド表現、コード品質は評価しない
- UIデザイン上の視覚表現と重なる問題は、`ui-design-reviewer` への引き継ぎ事項として分離する

### product-review-packager

- 人間が実際にプロダクトをレビューしやすいように整理する
- 変更点、確認手順、見るべき画面 / URL、前回との差分、既知の未解決事項、判断してほしいポイント、人間レビュー用チェックリストを出す
- 実装や設計変更はしない

## いつどの agent を spawn するか

| タイミング | spawn する agent | 目的 |
| --- | --- | --- |
| 次に何を改善するか決めたいとき | `improvement-proposer` | 実装前に選択肢と判断材料を作る |
| 改善案が出たあと | `decision-reviewer` | 採用 / 却下 / 保留を判断し、実装 handoff を作る |
| `decision-reviewer` が採用案を明示したあと | `implementer` | 採用案だけを小さく実装する |
| 実装直後、人間が触る前 | `quality-reviewer` | 重大な品質・セキュリティ・退行リスクを先に潰す |
| UI変更後、実画面を確認できるとき | `ui-design-reviewer` | 配色、タイポグラフィ、装飾、ブランド表現、視覚的完成度を確認する |
| UI変更後、実画面と主要状態を確認できるとき | `interface-design-reviewer` | 画面構造、情報階層、UI部品、状態、レスポンシブ配置を確認する |
| 人間レビューを依頼する直前 | `product-review-packager` | 確認手順と判断ポイントを整理する |
| 人間レビューと AI 判断監査のフィードバック後 | `improvement-proposer` | 次サイクルの改善案に変換する |

## Codex に投げるプロンプト例

### 例1: 改善案を出す

```text
Spawn improvement-proposer.
Analyze the current repository state, recent changes, and known product direction.
Do not implement anything.
Return improvement proposals as A/B/C options with impact, cost, risk, and decision points.
Prepare the proposal set for decision-reviewer. Do not wait for human adoption decisions in the normal loop.
```

### 例2: AI が採用 / 却下 / 保留を判断する

```text
Spawn decision-reviewer.
Evaluate the improvement-proposer proposals.
Decide accepted, rejected, and deferred items using this repository's priorities: modern Next.js architecture, SEO/AEO, ecommerce UX, real-time chat, minimum AWS cost, and learning value.
Prefer small, reversible, high-signal improvements.
Do not implement anything.
Return a decision summary and implementation handoff for implementer.
```

### 例3: 採用案だけ実装する

```text
Spawn implementer.
Implement only the items accepted by decision-reviewer:
- A: <採用内容>
- C: <採用内容>
Do not implement rejected or deferred items.
Keep changes minimal.
After implementation, summarize changed files and validation commands.
```

### 例4: 品質レビューする

```text
Spawn quality-reviewer.
Review the latest implementation before human product review.
Focus on security, bugs, regressions, tests, maintainability, unintended behavior, and performance.
Do not edit code.
Return findings by severity with evidence and recommended fixes.
```

### 例5: UIデザインとインターフェースをレビューする

```text
Spawn ui-design-reviewer and interface-design-reviewer for the changed UI.
Review the rendered screens and keep the responsibilities separate.
ui-design-reviewer must evaluate only visual expression and aesthetic completeness.
interface-design-reviewer must evaluate only interface structure, components, states, and responsive layout.
Do not edit code.
Return each review as standalone Japanese Markdown so the parent agent can save it under docs/ai/output/<agent-name>/.
```

### 例6: 人間レビュー用に整理する

```text
Spawn product-review-packager.
Prepare a review package for a human product reviewer.
Include what changed, where to look, how to verify, known issues, screenshots/URLs if available, and decision points.
Do not edit code.
```

## 注意点

- 大きな方針変更は、`decision-reviewer` が通常ループで採用せず、人間監査または追加基準の整備に回してください。
- `implementer` に渡す採用案は、`decision-reviewer` の handoff から箇条書きで明確にしてください。
- `decision-reviewer`、各reviewer、`product-review-packager` は read-only 前提です。修正が必要な場合は、改善案または採用判断として再整理してから `implementer` に渡してください。
- UI 変更を含む場合は、可能なら `product-review-packager` に対象 URL、確認手順、スクリーンショット有無を整理させてください。
- `ui-design-reviewer` と `interface-design-reviewer` の最終出力は、親 agent がそれぞれ `docs/ai/output/ui-design-reviewer/` と `docs/ai/output/interface-design-reviewer/` に連番で保存してください。
- このリポジトリでは Next.js 最新設計、SEO / AEO、ecommerce UX、リアルタイムチャット、AWS 最小コスト、学習価値の判断軸を意識してください。
- 人間は通常の採用判断者ではなく、AI 判断品質の監査者として、判断基準の不足やズレをフィードバックしてください。
- reviewerを追加するときは責務の重複を避け、各agentの担当外を明示してください。
