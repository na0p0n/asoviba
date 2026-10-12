import { useState } from "react";
import { formatJson } from "./logic";

const INDENT_OPTIONS = [
  { label: "2スペース", value: 2 },
  { label: "4スペース", value: 4 },
  { label: "圧縮（最小化）", value: 0 },
];

export default function JsonFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [indent, setIndent] = useState(2);
  const [copied, setCopied] = useState(false);

  const run = () => {
    const result = formatJson(input, { indent });
    setCopied(false);
    if (result.ok) {
      setOutput(result.output);
      setError("");
    } else {
      setOutput("");
      setError(result.error);
    }
  };

  const copy = async () => {
    if (!output) return;
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
    } catch {
      /* クリップボードが使えない環境では無視 */
    }
  };

  const fieldClass =
    "w-full rounded-md border border-border bg-card p-3 font-mono text-sm text-fg";

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <label htmlFor="json-input" className="text-sm font-medium">
          入力
        </label>
        <textarea
          id="json-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={'{ "hello": "world" }'}
          rows={10}
          spellCheck={false}
          className={`${fieldClass} resize-y`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label htmlFor="json-indent" className="text-muted text-sm">
          インデント
        </label>
        <select
          id="json-indent"
          value={indent}
          onChange={(e) => setIndent(Number(e.target.value))}
          className="border-border bg-card text-fg rounded-md border px-2 py-1 text-sm"
        >
          {INDENT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <button
          type="button"
          onClick={run}
          className="bg-accent text-accent-fg rounded-md px-4 py-1.5 text-sm font-medium"
        >
          整形する
        </button>
      </div>

      {error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}

      {output && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <label htmlFor="json-output" className="text-sm font-medium">
              結果
            </label>
            <button
              type="button"
              onClick={copy}
              className="border-border text-muted hover:text-fg rounded-md border px-3 py-1 text-sm transition-colors"
            >
              {copied ? "コピーしました" : "コピー"}
            </button>
          </div>
          <textarea
            id="json-output"
            value={output}
            readOnly
            rows={10}
            spellCheck={false}
            className={`${fieldClass} resize-y`}
          />
        </div>
      )}
    </div>
  );
}
