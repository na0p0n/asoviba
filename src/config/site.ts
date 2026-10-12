/**
 * サイト全体の設定。サイト名・URL・説明など横断的に使う値をここに集約する。
 */
export const SITE = {
  name: "asoviba",
  /** 本番URL（sitemap / OGP / canonical で使用。デプロイ確定後に差し替え） */
  url: "https://asoviba.pages.dev",
  description: "ブラウザ内で完結する小さなツールを集めたサイト。",
  locale: "ja",
} as const;
