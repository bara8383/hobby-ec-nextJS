## Propsals Management

このディレクトリは、レビューを行った際に、改善・懸念・問題を正式に記録するための場所です。

すべての提案・懸念・問題は本ディレクトリに起票します。

---

### ファイル命名規則と内容について

P-XXX-{kebab-case-title}.md

例:
P-001-seo-metadata-fix.md
P-002-chat-connection-stability.md

XXXは連番。

ファイルの内容は以下を参考にすること。

```
# P-XXX: {title}

- Category: proposal | concern | problem
- Priority: blocker | high | normal | low
- Status: pending | accepted | denied

---

## 概要
{何が論点かをまとめて}

## 詳細
{要点をまとめ、リスト形式で分解して、具体的にわかりやすく説明}
- 
- 

## 影響範囲（Impact）
- SEO:
- Next.js設計:
- Realtime Chat:
- AWSコスト:
- UX:

## 推奨アクション
{この案に対する具体的な解決方法を示すとともに、この方法で何を行うかを具体的に記述}
- 修正方法:
  - {具体的にわかりやすく、リスト形式で分解して説明}
- 理由:
- 期待効果:

## 非採用理由（deniedの場合）
- 理由:

```

---

### 起票ルール

1. 1ファイル = 1論点
2. 推奨アクションは必ず1案に絞り、できるだけ詳細に記述する
3. Statusは必ず更新する
4. 非採用の場合は理由を必ず記録する
5. 

---

### 補足・説明

#### Category

- proposal : 改善や新設計の提案
- concern  : 将来的リスクや設計不安
- problem  : 明確な不具合・設計違反・SEO悪影響

#### Priority

- blocker : (1)Next.js設計違反 or (2)SEO重大影響 or 本番障害
- high    : 早期改善が望ましい
- normal  : 計画的に対応
- low     : アイデア・最適化

#### Status

- pending  : 検討中
- accepted : 実施決定
- denied   : 実施しない

---
