# AGENTS.md


## このプロジェクトの設計・実装方針

以下の 1〜4 は上から順に優先順位が高い。
競合する場合は `1 > 2 > 3 > 4` の順で判断する。

1. Next.js の最新設計を採用する。
2. SEO / AEO((AI Engine Optimization)) を高度に最適化する。
3. リアルタイムチャット機能を実装する。
4. AWS に最小コストでデプロイする。

---

## subagentの使用方法

各 subagent の最終出力を、親 agent が次の規則で Markdown として保存してください。

保存先:
docs/ai/output/[agent-name]/[3桁連番]-[内容を表すファイル名].md

例:
docs/ai/output/improvement-proposer/001-improvement-proposals.md
docs/ai/output/decision-reviewer/001-improvement-decisions.md
docs/ai/output/implementer/001-implementation-result.md
docs/ai/output/quality-reviewer/001-quality-review.md
docs/ai/output/product-review-packager/001-product-review-guide.md

規則:
- agent-name は TOML の name を使用する
- 既存ファイルの最大連番に1を加える
- 既存ファイルを上書きしない
- subagent の出力を省略せず保存する
- 親 agent の統合結果とは分離する

---
## 作業ルール
- 作業ブランチを作成して、push & mergeを行う。直push禁止。
