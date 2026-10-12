/**
 * テーマ（ライト/ダーク）の型・定数・判定ロジックの単一の源。
 * 文字列リテラルをコンポーネント側に散らさず、ここに集約する。
 */
export type Theme = "light" | "dark";

/** localStorage のキー */
export const THEME_STORAGE_KEY = "theme";

export const THEMES = {
  light: "light",
  dark: "dark",
} as const satisfies Record<Theme, Theme>;

/** 値が Theme かどうかを判定する型ガード */
export function isTheme(value: unknown): value is Theme {
  return value === THEMES.light || value === THEMES.dark;
}

/** ダークかどうか */
export function isDark(value: unknown): boolean {
  return value === THEMES.dark;
}

/** 保存値（無ければ OS 設定）から初期テーマを決定する */
export function resolveTheme(stored: unknown, prefersDark: boolean): Theme {
  if (isTheme(stored)) return stored;
  return prefersDark ? THEMES.dark : THEMES.light;
}

/** 現在のテーマを反転した値を返す */
export function nextTheme(current: unknown): Theme {
  return isDark(current) ? THEMES.light : THEMES.dark;
}
