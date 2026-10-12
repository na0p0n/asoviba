export type FormatResult =
  { ok: true; output: string } | { ok: false; error: string };

export interface FormatOptions {
  /** インデント幅（スペース数）。0 で圧縮（最小化） */
  indent?: number;
}

/**
 * JSON文字列を整形または圧縮する純粋関数。
 * 外部送信は一切行わず、入出力の変換のみを担う（テスト対象）。
 */
export function formatJson(
  input: string,
  options: FormatOptions = {},
): FormatResult {
  const { indent = 2 } = options;
  const trimmed = input.trim();
  if (trimmed === "") {
    return { ok: false, error: "入力が空です。" };
  }
  try {
    const parsed: unknown = JSON.parse(trimmed);
    return { ok: true, output: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
