# Propsals Management

このディレクトリは、設計・改善・懸念・問題を正式に記録するための場所です。

すべての提案・懸念・問題は本ディレクトリに起票します。

---

## ファイル命名規則

P-XXX-{kebab-case-title}.md

例:
P-001-seo-metadata-fix.md
P-002-chat-connection-stability.md

XXXは連番。

---

## 起票ルール

1. 1ファイル = 1論点
2. 推奨アクションは必ず1案に絞る
3. Statusは必ず更新する
4. 非採用の場合は理由を必ず記録する
5. proposals.md は使用しない（廃止）

---

## メタ情報定義

### Category

- proposal : 改善や新設計の提案
- concern  : 将来的リスクや設計不安
- problem  : 明確な不具合・設計違反・SEO悪影響

### Priority

- blocker : (1)Next.js設計違反 or (2)SEO重大影響 or 本番障害
- high    : 早期改善が望ましい
- normal  : 計画的に対応
- low     : アイデア・最適化

### Status

- pending  : 検討中
- accepted : 実施決定
- denied   : 実施しない

---

## 判断観点（必ず確認）

- SEO
- Next.js設計
- Realtime Chat
- AWSコスト
- UX

プロジェクト優先順位：

1. Next.js最新設計パターン採用
2. SEO最適化
3. リアルタイムチャット
4. AWS最小コスト
