import Editor from "@monaco-editor/react";

const LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "typescript", label: "TypeScript" },
  { value: "python", label: "Python" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
  { value: "sql", label: "SQL" },
  { value: "json", label: "JSON" },
  { value: "shell", label: "Bash" },
];

function CodeBlock({ block, onChange }) {
  const language = block.metadata?.language || "javascript";
  const lineCount = (block.content || "").split("\n").length;
  const height = Math.max(100, Math.min(400, lineCount * 20 + 40));

  return (
    <div className="rounded-lg overflow-hidden border border-stone-200">
      <div className="flex items-center justify-between px-3 py-1.5 bg-stone-100 border-b border-stone-200">
        <select
          value={language}
          onChange={(e) =>
            onChange({
              metadata: { ...block.metadata, language: e.target.value },
            })
          }
          className="text-xs text-stone-600 bg-transparent border-none outline-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>
        <button
          onClick={() => navigator.clipboard.writeText(block.content)}
          className="text-xs text-stone-500 hover:text-stone-700 transition"
        >
          Copiar
        </button>
      </div>

      <Editor
        height={height}
        language={language}
        value={block.content || ""}
        onChange={(value) => onChange({ content: value || "" })}
        theme="vs-dark"
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          wordWrap: "on",
          padding: { top: 10, bottom: 10 },
          renderLineHighlight: "none",
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          scrollbar: {
            vertical: "hidden",
            horizontal: "hidden",
          },
        }}
      />
    </div>
  );
}

export default CodeBlock;
