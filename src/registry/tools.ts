import type { ToolMeta } from "./types";
import { meta as jsonFormatter } from "../features/json-formatter/meta";

/**
 * 全ツールのメタデータ一覧。
 *
 * ツールを追加するときは features/<tool>/meta.ts を import し、この配列に登録する。
 * 一覧・検索・個別ページ生成はすべてこの配列を起点にする（レジストリ駆動）。
 */
export const tools: ToolMeta[] = [jsonFormatter];

/** slug からツールを取得する。見つからなければ undefined。 */
export function getTool(slug: string): ToolMeta | undefined {
  return tools.find((tool) => tool.slug === slug);
}
