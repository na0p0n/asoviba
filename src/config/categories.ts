/**
 * ツールのカテゴリ定義。ここが ToolCategory 型の単一の源になる。
 * 新カテゴリはこの配列に追加する（表示順もこの順序）。
 */
export const CATEGORIES = [
  { id: "developer", label: "開発者向け" },
  { id: "text", label: "テキスト" },
  { id: "media", label: "メディア" },
  { id: "daily", label: "日常・生活" },
] as const;

export type ToolCategory = (typeof CATEGORIES)[number]["id"];

/** カテゴリID → 表示名 */
export const CATEGORY_LABELS = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c.label]),
) as Record<ToolCategory, string>;
