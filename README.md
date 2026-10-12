# asoviba

ブラウザ内で完結する小さなツールを少しずつ増やしていく静的サイト。各ツールは独立モジュールとして追加する。

## 技術スタック

- [Astro](https://astro.build/)（静的ファースト）
- React（Astro Islands・対話的なUI部分のみ）
- Tailwind CSS v4
- TypeScript
- Cloudflare Pages（`@astrojs/cloudflare` アダプタ）

詳細は [docs/specification.md](docs/specification.md) を参照。

## セットアップ

Node.js 22.12 以上が必要。

```bash
npm install
```

## コマンド

| コマンド | 内容 |
|---|---|
| `npm run dev` | 開発サーバを起動 |
| `npm run build` | `dist/` に本番ビルド |
| `npm run preview` | ビルド結果をローカルで確認 |
| `npm run typecheck` | `astro check` による型チェック |

## ドキュメント

- [企画書](docs/proposal.md)
- [仕様書](docs/specification.md)
- [ロードマップ](docs/roadmap.md)
- [開発ルール（CLAUDE.md）](CLAUDE.md)
