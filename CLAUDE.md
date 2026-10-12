# CLAUDE.md — asoviba

Claude Code がこのリポジトリで作業するときのルール。プロダクトの内容は `docs/` を正とする。

- [企画書](docs/proposal.md) / [仕様書](docs/specification.md) / [ロードマップ](docs/roadmap.md)

## 役割分担

- **Claude が書き、人間（オーナー）がレビューして承認・マージする。**
- Claude は GitHub のボットアカウント（`na0p0n-claude`）として動く。

| 担当 | 作業 |
|---|---|
| **Claude** | ブランチ作成、実装、PRの作成、**オーナーのコメントへの対応**（修正コミットの push、返信）、タグの作成、GitHub Release の作成 |
| **オーナー** | PRのレビュー・承認・**マージ**（すべてのPR。release PR、hotfix、バックマージを含む） |

- **PR のマージは Claude が一切行わない。** 承認済み・CIグリーンでも、`gh pr merge`、auto-merge、API 経由のマージはしない（`.claude/settings.json` でも拒否している）。
- レビューコメントのスレッドは、Claude が返信・修正をしても **resolve しない**。解決の判断はオーナーが行う。
- `main` / `develop` への直接 push、force push はしない（Ruleset でも禁止されている）。

## ブランチ・コミット・PR

### ブランチ命名

`feature/<内容>` `fix/<内容>` `docs/<内容>` `chore/<内容>` `release/v<semver>` `hotfix/<内容>`

（`feat/` は使わない。コミットの type としての `feat:` は Conventional Commits の規約としてそのまま使う。）

### ブランチ運用

初回リリースまでと、リリース後で運用が異なる。

| | 初回リリースまで（現在） | リリース後 |
|---|---|---|
| 作業ブランチの起点 | `main` | `develop` |
| PRの向き先 | `main` | `develop` |
| マージ方法 | Squash | feature → `develop` は Squash |
| リリース | — | `develop` から `release/vX.Y.Z` を切り、`main` 向きにPR。マージ方法は **Merge commit**。マージ後に `vX.Y.Z` タグを付ける |
| 緊急修正 | — | `main` から `hotfix/<内容>` を切って `main` へ。**マージ後、`main` を `develop` へバックマージする** |

- `release/*` ではバグ修正・バージョン更新・CHANGELOG 以外の変更をしない。
- hotfix をマージしたら、バックマージのPR（`main` → `develop`）が必要か常に確認し、必要なら作成する。
- リリース後への切り替えは、`develop` の作成・Ruleset・デフォルトブランチの変更を済ませたうえで、オーナーの指示で行う。それまでは `main` から切る。

### タグ・リリース（Claude の担当）

オーナーが release PR（または hotfix PR）を `main` にマージし、リリース作業を依頼したら、次の手順で行う。

1. `main` に該当のマージコミットが存在し、CIが通っていることを確認する（未マージなら実施しない）。
2. バージョン（`vMAJOR.MINOR.PATCH`）が `release/vX.Y.Z` / CHANGELOG と一致していることを確認する。
3. `main` のマージコミットに注釈付きタグ `vX.Y.Z` を作成して push する。既存タグは上書きしない。
4. `gh release create vX.Y.Z --verify-tag` で GitHub Release を作成する。本文は CHANGELOG の該当節を使う。
5. hotfix の場合は、`main` → `develop` のバックマージPRが必要か確認し、必要ならPRを作成してオーナーに知らせる（マージはオーナー）。

### コミット・PR

- コミット/PRタイトルは Conventional Commits（`feat:` `fix:` `docs:` `chore:` `test:` `refactor:`）。
- **1 PR = 1 関心事。** ツール追加は 1 PR につき 1 ツールを基本とする。
- PR 本文は `.github/pull_request_template.md` に沿って埋める。確認方法を必ず書く。
- レビュー指摘は同じブランチへ追加コミットで対応する。

## 開発方針

- 仕様や方針を変える場合は、コードと一緒に `docs/` も更新する。
- ロードマップのチェックボックスは、実装が完了したPRの中で更新する。
- ツールは `features/<tool>/` に自己完結させる（詳細は仕様書のディレクトリ構成）。
- ユーザーデータは原則ブラウザ内で処理し、外部に送信しない。
- 依存パッケージの追加は理由を PR に書く。

## 禁止事項

- **PR をマージしない。** `gh pr merge`、auto-merge、API 経由のマージ、`main` / `develop` への直接 push のいずれも行わない。承認済み・CI グリーンであっても同じ。マージはオーナーだけが行う。
- 自分（ボット）の作った PR を承認しない。別アカウントを用意して承認させるなど、レビューを迂回する操作もしない。
- レビューコメントのスレッドを resolve しない。
- 既存のタグを削除・上書きしない。
- トークン・APIキー・`.env` をコミットしない。`.claude/settings.local.json` は個人設定でコミットしない。
- 無関係なリファクタや整形を機能変更のPRに混ぜない。
- GitHub の設定（Ruleset、Secrets、Collaborators など）を、依頼なしに変更しない。
