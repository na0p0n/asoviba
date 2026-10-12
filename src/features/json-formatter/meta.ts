import type { ToolMeta } from "../../registry/types";

export const meta: ToolMeta = {
  slug: "json-formatter",
  name: "JSON整形",
  description:
    "JSONを見やすく整形、または圧縮します。処理はすべてブラウザ内で完結し、データは外部に送信されません。",
  category: "developer",
  keywords: [
    "json",
    "整形",
    "フォーマット",
    "formatter",
    "beautify",
    "minify",
    "圧縮",
  ],
  component: "json-formatter",
  status: "stable",
};
