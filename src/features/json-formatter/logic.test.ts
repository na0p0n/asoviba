import { describe, it, expect } from "vitest";
import { formatJson } from "./logic";

describe("formatJson", () => {
  it("既定（2スペース）で整形する", () => {
    expect(formatJson('{"a":1}')).toEqual({
      ok: true,
      output: '{\n  "a": 1\n}',
    });
  });

  it("indent=4 で整形する", () => {
    expect(formatJson('{"a":1}', { indent: 4 })).toEqual({
      ok: true,
      output: '{\n    "a": 1\n}',
    });
  });

  it("indent=0 で圧縮する", () => {
    expect(formatJson('{ "a" : 1 }', { indent: 0 })).toEqual({
      ok: true,
      output: '{"a":1}',
    });
  });

  it("空入力・空白のみはエラー", () => {
    expect(formatJson("   ").ok).toBe(false);
  });

  it("不正なJSONはエラーメッセージを返す", () => {
    const result = formatJson("{ bad }");
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.length).toBeGreaterThan(0);
    }
  });
});
