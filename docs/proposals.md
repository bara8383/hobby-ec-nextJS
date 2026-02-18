# 提案・懸念管理台帳

タスクを受けて、repo内のコード・ドキュメントを生成/修正/調査した際に気づいた提案・懸念点・問題点のみを管理します。

## 記録ルール

- 1行1件で追記する。
- 管理キーは日付ではなく識別番号（`P-001` のような連番）を使う。
- 記載対象は「当該タスクで実際に発見・確認したrepo内の記述・コードに起因する提案/懸念/問題点」のみとする。
- `Status` は `Open` / `Accepted` / `Rejected` / `Done` を使う。
- オーナー判断後は `Decision` と `Decision Date` を更新する。

## ログ（表形式）

| ID | Type | Category | Detail | Scope | Expected Impact | Priority | Status | Decision | Decision Date | Related PR |
|---|---|---|---|---|---|---|---|---|---|---|
| P-001 | Improvement | DX | Codex（IDE/ブラウザ）での変更時に必ず作業ブランチを切るルールを追加。あわせてPR記載ルールと提案ログ運用を明文化。【対応案】ブランチ命名規則（`feat/*`, `fix/*`, `chore/*`）とPRテンプレート導入を次タスクで決定する。 | Docs | 変更の追跡性向上、レビュー容易性向上、main系ブランチの安定化。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-002 | Improvement | Docs | `AGENTS.md` と `docs/proposals.md` の先頭に UTF-8 BOM が含まれており、差分や表示でノイズになる可能性を確認。【対応案】Markdown ファイルは UTF-8（BOM なし）で統一する。 | Docs | 不要な差分混入の抑制、エディタ間の表示差異低減。 | Low | Accepted | Accepted | 2026-02-16 | - |
| P-003 | Concern | DX | 「内容を書き換えない」の解釈が曖昧で、前回は体裁調整をBOM除去中心で実施したため期待との差分が生じた。【対応案】今後は「意味を変えない範囲での表記・句読点・空白調整」を体裁調整として明示的に扱う。 | Docs | 指示解釈の齟齬を減らし、レビュー手戻りを抑制。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-004 | Improvement | Docs | AGENTS.md を「クイックチェック→優先順位→必須ルール→PRテンプレート」の順に再構成し、AI が冒頭で要件を把握しやすい体裁へ調整。【対応案】AGENTS.md では、今後も意味不変を維持しつつ「先頭要約＋チェックリスト」形式を標準化する。 | Docs | Codex 実行時の初期解釈ミス削減、実装前チェック漏れの抑制。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-005 | Improvement | DX | AGENTS.md を AI 実行フロー基準で再設計し、proposals を表形式 + ステータス管理へ移行。【対応案】AGENTS.md は「必須事項→手順」の順で維持し、proposals は表の `Status/Decision` を定期更新する。 | Docs | ルール解釈の一貫性向上、提案の追跡性向上、意思決定状況の可視化。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-006 | Concern | CI/CD | make_pr 実行時にエラーが発生すると、`Codex generated this pull request...` のプレースホルダー本文でPRが作成されるケースを確認。【対応案】PR作成時はテンプレート準拠本文を必ず明示指定し、作成直後に内容検証する運用を追加する。 | CI | レビューアに実装背景が伝わらず、確認工数が増加。 | Medium | Open | Pending | - | - |
| P-007 | Improvement | CI/CD | ブラウザ版Codex環境では `gh` を利用できないため、ローカル専用スクリプト運用を廃止し、GitHub Actionsによる自動補完/ガードへ一本化。【対応案】ローカル専用スクリプトを削除し、Actions中心の運用を維持する。 | CI | 環境依存の運用を減らし、PR本文品質担保をサーバー側で統一。 | Medium | Done | Accepted | 2026-02-15 | - |
| P-008 | Improvement | CI/CD | `pull_request_target` で本文が空/プレースホルダーのPRを検知し、テンプレート本文へ自動更新するワークフローを追加。【対応案】作成時検証スクリプトとCIガードに加えて自動補完を三重化し、運用上の取りこぼしを最小化する。 | CI | make_pr障害時でもPR本文欠落を即時是正し、レビュー開始時の情報欠落を削減。 | Medium | Open | Pending | - | - |
| P-009 | Improvement | CI/CD | 自動補完ワークフローは本文更新のみで、レビュア/作成者への通知コメントがなかった。【対応案】本文更新後にPRコメントを自動投稿し、追記が必要な3見出しを明示する。 | CI | 本文更新の見落としを防ぎ、レビュー開始時の情報不足リスクを低減。 | Low | Done | Accepted | 2026-02-15 | - |
| P-010 | Improvement | CI/CD | PR本文が `Motivation / Description / Testing` 形式で入力された場合、`AGENTS PR Guard` が必須見出し不足で失敗する事象を確認。`Auto Fill PR Body` は空/プレースホルダーのみ補完対象のため、このケースを救済できなかった。【対応案】`Auto Fill PR Body` に旧形式見出し検知ロジックを追加し、AGENTS.md準拠テンプレートへの自動変換対象を拡張する。 | CI | PR本文フォーマットの不一致を自動是正し、手動修正の待ち時間とCI再実行コストを削減。 | Medium | Done | Rejected | 2026-02-15 | - |
| P-011 | Decision | CI/CD | GitHub Actions による PR本文の自動再生成（Auto Fill PR Body）は、CI失敗時の再実行運用がCodex依存となり現実的でないという懸念を確認。【対応案】`auto-fill-pr-body.yml` を廃止し、`AGENTS PR Guard` で必須フォーマット検証のみを実施する。 | CI | CIがPR本文を上書きしないため、本文責務をPR作成者に一元化でき、運用の説明責任が明確になる。 | Medium | Done | Accepted | 2026-02-15 | - |
| P-012 | Improvement | Docs | AGENTS.md の PR 記載ルールを必須見出し・記載順・判定基準（PASS/FAIL、影響範囲、ロールバック）まで具体化し、AI が迷わないテンプレートへ拡張。【対応案】新テンプレートを標準運用とし、以後のPRは必須見出し欠落を差し戻す。 | Docs | PR本文の抜け漏れ削減、レビューの高速化、運用判断の明確化。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-013 | Improvement | Docs | proposals 記録対象を「当該タスクで実際に触った repo 内の記述・コード由来の提案/懸念/問題点」に限定し、ユーザーの質問文そのものや解決済み事項は原則記録対象外とする運用を明文化。【対応案】AGENTS.md に対象/非対象の判定基準を明記し、PR の提案欄も同基準で運用する。 | Docs | 提案ログのノイズ削減、未解決課題の追跡精度向上、誤記録の防止。 | Low | Rejected | Rejected | 2026-02-16 | - |
| P-014 | Concern | Architecture | 現在のリアルタイムチャットは Route Handler のインメモリ実装のため、マルチインスタンス構成でメッセージ整合性が崩れる可能性を確認。【対応案】本番移行時は Redis（ElastiCache）または DynamoDB Streams へ置き換える。 | BE | 水平スケール時にチャット履歴欠落や片系配信が発生するリスク。 | High | Open | Pending | - | - |
| P-015 | Improvement | Security | デジタル商品のダウンロード配布は現状UI説明のみで、署名付きURL発行や購入者認証フローが未実装。【対応案】次段階で購入履歴連携 + 期限付き署名URL（S3/CloudFront）を実装する。 | Fullstack | 本番運用時に不正共有・無制限再配布リスクが残る。 | High | Open | Pending | - | - |
| P-016 | Improvement | Docs | README にローカル実行の概要はあるが、本番近似での確認観点（SEO/チャット/AWS移行前提）と将来AWS構成図が分離管理されていなかった。【対応案】`docs/local-development` と `docs/future-aws-architecture` を新設し、運用時の参照先を明確化する。 | Docs | オンボーディング時間短縮、環境差分による手戻り削減、低コスト構成判断の明確化。 | Low | Open | Pending | - | - |
| P-017 | Improvement | Docs | ローカル手順に「開発モード / 本番近似モード」を併記したが、使い分け理由（速度と本番差分のトレードオフ）が明示されていなかった。【対応案】`docs/local-development/README.md` に「モードが二つある理由」を追記し、標準運用（普段dev、PR前production近似）を明文化する。 | Docs | 運用時のモード選択ミスを減らし、レビュー前チェックの一貫性を向上。 | Low | Open | Pending | - | - |
| P-019 | Improvement | DX | ローカル運用を Docker のみに寄せたことで、`NODE_ENV` の公式的な使い分け（development で実装、production で本番検証）が読み取りにくくなっていた。【対応案】手順書を development/production 二段運用へ修正し、Node.js/Next.js 標準的な `NODE_ENV` 切替方針を明記する。 | Docs | 開発効率と本番再現性のバランス改善、運用ルールの誤解防止。 | Low | Open | Pending | - | - |
| P-020 | Improvement | Docs | AGENTS.md の「最重要ルール」に優先順位の明示文（`1 > 2 > 3 > 4`）を追加し、競合時の判断基準を即時参照できるようにした。【対応案】優先順位を明示する注記を維持し、新規ルール追加時も順位関係を同節で更新する。 | Docs | ルール解釈の揺れを減らし、実装判断とレビューの一貫性を向上。 | Low | Open | Pending | - | - |
| P-021 | Improvement | Docs | `docs/proposals.md` の見出しが「ログ」表現で、ユーザー提案の転記先と誤解される余地を確認。台帳の目的と記載対象（repo内の確認事項のみ）を明文化する必要があった。【対応案】先頭説明と記録ルールを「repo内の実装・調査で確認した事項のみ」に更新し、転記禁止を明記した運用を継続する。 | Docs | 記録対象の誤解を防ぎ、追跡すべき提案・懸念点だけを一貫管理できる。 | Low | Open | Pending | - | - |
| P-022 | Problem | Docs | `docs/proposals.md` への起票運用で、ユーザー提案文の転記混入と `proposal.md` / `proposals.md` の表記ゆれが再発要因になり得ることを確認。現状はPR前の機械的チェックがなく運用依存。【対応案】記録先を `docs/proposals.md` に一本化し、PR前チェック（repo内根拠の明記）とCI警告（転記疑い語/記録先誤り）を追加する。 | CI | 提案台帳の信頼性低下、記録先誤りによる追跡漏れ、レビュー手戻り増加。 | Medium | Open | Pending | - | - |
| P-023 | Improvement | DB | `data/products.ts` の商品型はタグ・サンプルメディア・カテゴリ別スペック（解像度/BPM/尺）を保持できず、確定済みの商品要件を表現しきれないことを確認。【対応案】`products` 本体と `product_specs` / `product_media` / `tags` を分離したスキーマへ拡張し、商品詳細ページの構造化データ出力に流用する。 | Fullstack | 商品詳細SEO（検索意図一致）と購入前判断情報が不足し、CV低下の懸念。 | Medium | Open | Pending | - | - |
| P-024 | Improvement | SEO | IA案では `slug` ベースの商品詳細導線とカテゴリ/タグLPを前提としているが、現状実装は `id` ルーティング中心で一覧導線も `/` のみだった。【対応案】App Routerで `/products/[slug]`・`/categories/[category]`・`/tags/[tag]` を追加し、SEO関連ロジックを `lib/seo` に集約する。 | FE | 商品詳細SEOの拡張余地が小さく、カテゴリ・タグ経由の検索流入を取り込みにくい。 | Medium | Open | Pending | - | - |
| P-025 | Concern | Security | MVPとして注文/ライブラリ/管理画面を実装したが、認証は `user-demo` 固定のため本番では不正アクセス防止の要件を満たさないことを確認。【対応案】次段階でNextAuth等のセッション認証と権限ベースアクセス制御を導入し、API/page双方で userId 固定ロジックを廃止する。 | Fullstack | 本番公開前に認証・認可を実装しない場合、購入情報とダウンロードURLの保護が不十分となる。 | High | Open | Pending | - | - |
| P-026 | Improvement | UX | ホーム画面は現状「ヒーロー + 新着 + タグ」の最小構成で、購入判断に必要な比較情報（用途別導線・価格帯導線・安心訴求）が不足していることを確認。画面作り込み要望に対し、段階導入可能なUI強化案を新規ドキュメント化。【対応案】`docs/ui-enhancement-proposal.md` をベースに Phase 1（Home + Card改善）から着手し、PRを小分けで進行する。 | FE | 情報探索性とCV導線の改善、SEO内部リンク強化、チャット利用文脈の明確化。 | Medium | Open | Pending | - | - |
| P-027 | Concern | UX | Phase 1としてホーム導線を拡張した結果、商品カード内のサンプル表示は「有無」の文字情報のみで、画像/音声プレビューの視認性が不足することを確認。【対応案】Phase 2で `ProductCard` にカテゴリ別サムネイル/波形プレビューを段階追加し、LCP悪化を避けるため遅延読み込み前提で実装する。 | FE | 一覧での比較速度が頭打ちとなり、詳細遷移率改善の上限が早期に到達する可能性。 | Medium | Open | Pending | - | - |
| P-028 | Improvement | DB | 現行DB定義はTypeScript型の最小表現に留まり、SEO用slug/カテゴリ・タグ正規化、購入後ダウンロード権限制御、チャット履歴永続化を一貫管理できないことを確認。【対応案】`docs/db-design-draft.md` を基準に、Drizzle + PostgreSQL互換スキーマへ段階移行（開発はSQLite）する。 | Fullstack | Next.js App Routerでの再利用性とSEO拡張性が不足し、将来のチャット分析や低コストAWS移行の設計判断が遅延する。 | Medium | Accepted | Accepted | 2026-02-16 | - |
| P-029 | Concern | DB | PostgreSQL互換DDLを追加したが、現状repoにはDrizzleマイグレーション実行設定（`drizzle.config.*` や適用スクリプト）がなく、運用が手動適用に依存している。【対応案】次タスクでDrizzle導入可否を再確認し、導入可能なら設定ファイルと `npm run db:migrate` を追加して機械適用へ移行する。 | Infra | 開発者ごとに適用手順がぶれると、スキーマ差分やレビュー時の再現性低下を招く。 | Medium | Open | Pending | - | - |
| P-030 | Concern | Architecture | `lib/chat/queue.ts` で採用した「ユーザー単位キュー方式」は、アクティブユーザー増加時に SQS キュー数クォータや CreateQueue API スロットリングの影響を受ける可能性を確認。【対応案】運用フェーズでキュー上限監視を追加し、しきい値超過時は「ユーザーシャード単位キュー + userId属性振り分け」へ段階移行する。 | BE | ユーザー増加時に新規キュー作成遅延が発生し、初回受信レイテンシ悪化やイベント取りこぼしリスクが増加。 | High | Open | Pending | - | - |
