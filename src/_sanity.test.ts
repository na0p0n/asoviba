import { describe, it, expect } from "vitest";

/**
 * Vitest 導入確認用のサニティテスト。
 * 最初の実ロジック（features/<tool>/logic.ts）のテストが入ったら削除してよい。
 */
describe("vitest setup", () => {
  it("runs a test", () => {
    expect(1 + 1).toBe(2);
  });
});
