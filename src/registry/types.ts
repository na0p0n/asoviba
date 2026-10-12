import type { ToolCategory } from "../config/categories";

export type { ToolCategory };

export type ToolStatus = "stable" | "beta";

/**
 * 1ツールのメタデータ。各 features/<tool>/meta.ts がこの型で定義し、
 * registry/tools.ts に登録する。
 */
export interface ToolMeta {
  /** URL: /tools/<slug> */
  slug: string;
  /** 表示名 */
  name: string;
  /** 一覧・SEO用の説明 */
  description: string;
  category: ToolCategory;
  /** 検索・SEO用のキーワード */
  keywords: string[];
  /** サーバー処理を伴うか（既定 false = クライアント処理のみ） */
  serverSide?: boolean;
  /** 読み込む Island コンポーネントの識別子 */
  component: string;
  /** 公開状態（既定 stable） */
  status?: ToolStatus;
}
