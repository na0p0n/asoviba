# 仕様書 — asoviba

- ドキュメント種別: 仕様書（Specification）
- 最終更新: 2026-10-12
- ステータス: Draft v0.1

関連文書: [企画書](./proposal.md) / [ロードマップ](./roadmap.md)

---

## 1. 技術スタック

| 層 | 採用技術 | 理由 |
|---|---|---|
| フレームワーク | **Astro** | 静的HTML生成（SEO/AdSense審査に有利）、Islandsで必要箇所だけJS水和＝軽量 |
| UI（動的部分） | **React**（Astro Islands） | 対話的なツールUIを部分的に実装。慣れた人が多く情報も豊富 |
| スタイル | **Tailwind CSS** | 統一したデザインを高速に構築、クラス駆動で保守が容易 |
| 言語 | **TypeScript** | 型安全。ツールの入出力仕様を型で表現 |
| ホスティング | **Cloudflare Pages** | 静的配信＋Functions（Workers）でサーバー処理も可能。無料枠・高速CDN |
| サーバー処理 | **Astro endpoints / Pages Functions** | 必要なツールのみサーバー実行（画像の重い処理、外部API中継など） |

### なぜ Workers 単体でなく Cloudflare Pages か
- Pages は内部的に Workers を使いつつ、静的アセット配信・ビルド・プレビュー・独自ドメインを統合管理できる。
- 「静的ページ多数＋一部サーバー処理」という本プロダクトの性質に最も素直。
- Astro 公式アダプタ `@astrojs/cloudflare` でSSR/エンドポイントをPages Functionsとしてデプロイ可能。

### Astro 学習の勘所（未経験者向けメモ）
- **基本は`.astro`ファイル**＝HTMLに近い。ビルド時にHTMLへ変換され、デフォルトでJSを一切送らない。
- **動的UIが必要な箇所だけ** React等のコンポーネントを置き、`client:load` / `client:visible` などの**ディレクティブ**で水和（＝ブラウザ側で動かす）を指定する。これが「Islands」。
- ルーティングは**ファイルベース**（`src/pages/` 配下のファイル＝URL）。
- データは **Content Collections**（型付きのコンテンツ管理）で扱える。ツールのメタデータ管理に活用。
- まず Phase 0 で「ツール1個」のパターンを完成させれば、以降は複製して中身を差し替えるだけで増やせる。

## 2. アーキテクチャ方針

- **静的ファースト**: 原則すべてのツールページをビルド時に静的HTML化（SEO・審査・速度）。
- **クライアント処理優先**: データはブラウザ内で処理し外部送信しない。各ツールにその旨を明示。
- **サーバー処理は例外的に**: クライアントで困難な処理（重い画像変換、CORS制約のある外部API等）のみエンドポイント化。
- **ツール＝独立モジュール**: 各ツールは自己完結した「feature」として実装し、レジストリに登録するだけで一覧・検索・ページに反映される（アジャイルで足しやすい）。

## 3. ディレクトリ構成（アジャイル前提）

ツールを1つずつ安全に追加・削除できるよう、**機能単位（feature-sliced）** で独立性を高める。

```text
asoviba/
├── docs/                      # 企画・仕様・ロードマップ
├── public/                    # 静的アセット（そのまま配信）
│   ├── ads.txt                # AdSense用（ルート配信）
│   ├── robots.txt
│   └── favicon 等
├── src/
│   ├── pages/                 # ★ファイルベースルーティング
│   │   ├── index.astro        # トップ（ツール一覧・検索）
│   │   ├── tools/
│   │   │   └── [slug].astro    # ツール個別ページ（レジストリから動的生成）
│   │   ├── privacy.astro      # プライバシーポリシー
│   │   └── sitemap 等
│   ├── features/              # ★ツール本体（1ツール=1フォルダ・自己完結）
│   │   └── json-formatter/
│   │       ├── JsonFormatter.tsx   # UI（React Island）
│   │       ├── logic.ts            # 純粋ロジック（テスト対象）
│   │       ├── logic.test.ts       # 単体テスト
│   │       └── meta.ts             # このツールのメタdata（名前/説明/カテゴリ/slug等）
│   ├── registry/              # ★全ツールのメタデータを集約
│   │   └── tools.ts           # 各feature/meta.ts を import して一覧化
│   ├── components/            # 共通UI（ツール非依存）
│   │   ├── layout/            # Header / Footer / Sidebar
│   │   ├── ui/                # Button / Card / Input など汎用部品
│   │   └── ads/               # AdSense広告枠コンポーネント
│   ├── layouts/               # ページ共通レイアウト（.astro）
│   │   ├── BaseLayout.astro
│   │   └── ToolLayout.astro   # ツールページ共通（広告枠・SEOメタ・説明枠込み）
│   ├── lib/                   # 横断ユーティリティ（SEO生成・クリップボード等）
│   ├── config/                # サイト設定（サイト名・URL・カテゴリ定義・AdSense ID）
│   └── styles/                # グローバルCSS・Tailwindエントリ
├── tests/                     # E2E等（必要に応じ）
├── astro.config.mjs
├── tailwind.config.mjs
├── tsconfig.json
└── package.json
```

### 設計上のポイント
- **`features/<tool>/` が追加の単位**。新ツールはこのフォルダを1つ作り、`meta.ts` を `registry/tools.ts` に登録するだけ。
- **ロジックとUIを分離**（`logic.ts` / `*.tsx`）。ロジックは純粋関数にして**単体テスト**を書ける＝アジャイルで安全に改修できる。
- **一覧・検索・ページ生成はレジストリ駆動**。個別ページ（`tools/[slug].astro`）はレジストリからslugを引いて静的生成。
- **広告・SEOは共通レイアウトに集約**。各ツールは中身に集中すればよい。

## 4. ツールのデータモデル（meta.ts の型イメージ）

```ts
export type ToolCategory = 'developer' | 'text' | 'media' | 'daily';

export interface ToolMeta {
  slug: string;            // URL: /tools/<slug>
  name: string;            // 表示名
  description: string;     // 一覧・SEO用の説明
  category: ToolCategory;
  keywords: string[];      // 検索・SEO
  serverSide?: boolean;    // サーバー処理を伴うか（既定 false）
  component: string;       // 読み込むIslandコンポーネント識別子
  status?: 'stable' | 'beta';
}
```

## 5. 画面仕様（MVP）

- **トップページ**: ヒーロー＋カテゴリ別のツールカード一覧＋クライアント検索（絞り込み）。
- **ツールページ**: 入力/出力UI＋使い方の短い説明＋関連ツール＋広告枠。見出し・説明は静的HTMLでクローラーに提供。
- **共通**: ヘッダー（ロゴ・検索・ダークモード切替）、フッター（プライバシー・各カテゴリリンク）。
- **プライバシーポリシー**: 「処理はブラウザ内で完結」「AdSense/Cookie利用」を明記（審査必須）。

## 6. 非機能要件

| 項目 | 目標 |
|---|---|
| パフォーマンス | Lighthouse 90+ / LCP 2.5s以内 / 初期JSは最小 |
| SEO | 各ツールに固有のtitle/description/OGP、sitemap.xml、構造化データ |
| アクセシビリティ | キーボード操作、適切なlabel、コントラスト確保 |
| レスポンシブ | スマホ〜デスクトップ対応 |
| プライバシー | クライアント処理ツールはデータを外部送信しない |
| 対応ブラウザ | モダンブラウザ最新2バージョン |

## 7. AdSense / Cloudflare 対応仕様

- `public/ads.txt` をルートに配置。Cloudflare 側で `/ads.txt` を **Bot Fight / チャレンジから除外**（Configuration Rule）。
- 広告枠は `components/ads/` に集約し、環境変数でパブリッシャーIDを注入。開発時は非表示。
- 審査前提として、初期から十分なツール数・独自説明文・プライバシーポリシー・明確なナビを用意。

## 8. 開発・デプロイ

- **パッケージ管理**: npm（または pnpm）
- **ローカル開発**: `npm run dev`（Astro dev server）
- **ビルド**: `npm run build` → 静的＋Functions出力
- **デプロイ**: Cloudflare Pages（Git連携で自動デプロイ、PRごとにプレビュー）
- **テスト**: ロジックは Vitest で単体テスト。重要導線は後日E2E（Playwright等）検討。

## 9. 未確定事項（要決定）

- 独自ドメイン名の確定。
- パッケージマネージャ（npm / pnpm）の最終決定。
- 初期リリースするツールの最終選定（ロードマップPhSE 1 で確定）。
- UIデザインのトーン（配色・ロゴ）。
