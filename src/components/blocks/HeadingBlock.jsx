import { useEffect, useRef } from "react";

function HeadingBlock({
  block,
  onChange,
  onKeyDown,
  isFirst,
  shouldFocus,
  focusTimestamp,
  onFocused,
}) {
  const inputRef = useRef(null);
  const lastFocusTimestamp = useRef(null);
  const level = block.metadata?.level || 2;

  const sizes = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
  };

  useEffect(() => {
    if (
      shouldFocus &&
      focusTimestamp !== lastFocusTimestamp.current &&
      inputRef.current
    ) {
      lastFocusTimestamp.current = focusTimestamp;
      inputRef.current.focus();
      onFocused?.();
    }
  }, [shouldFocus, focusTimestamp, onFocused]);

  const placeholder = isFirst ? "Título (presiona '/' para más)" : "Título";

  return (
    <div className="flex items-center gap-2">
      <select
        value={level}
        onChange={(e) =>
          onChange({
            metadata: { ...block.metadata, level: Number(e.target.value) },
          })
        }
        className="text-xs text-stone-400 bg-transparent border-none outline-none cursor-pointer"
      >
        <option value={1}>H1</option>
        <option value={2}>H2</option>
        <option value={3}>H3</option>
      </select>
      <input
        ref={inputRef}
        type="text"
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        className={`flex-1 bg-transparent border-none outline-none font-bold text-stone-800 placeholder-stone-300 ${sizes[level]}`}
        style={{ fontFamily: "Georgia, serif" }}
      />
    </div>
  );
}

export default HeadingBlock;
