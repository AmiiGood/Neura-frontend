import { useEffect, useRef, useState } from "react";
import MarkdownText from "./MarkdownText";

function QuoteBlock({
  block,
  onChange,
  onKeyDown,
  isFirst,
  shouldFocus,
  focusTimestamp,
  onFocused,
}) {
  const textareaRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const lastFocusTimestamp = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [block.content]);

  // Autofocus cuando shouldFocus cambia
  useEffect(() => {
    if (shouldFocus && focusTimestamp !== lastFocusTimestamp.current) {
      lastFocusTimestamp.current = focusTimestamp;
      setIsFocused(true);
      onFocused?.();
    }
  }, [shouldFocus, focusTimestamp, onFocused]);

  // Enfocar el textarea cuando isFocused cambia a true
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isFocused]);

  const placeholder = isFirst
    ? "Escribe una cita, o presiona '/' para comandos..."
    : "Escribe una cita...";

  const hasMarkdown = block.content && /(\*\*|~~|`|\*)/.test(block.content);

  return (
    <div className="border-l-4 border-stone-300 pl-4">
      {!isFocused && hasMarkdown && block.content ? (
        <div
          onClick={() => setIsFocused(true)}
          className="text-stone-600 italic leading-relaxed cursor-text min-h-[1.75rem]"
          style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}
        >
          <MarkdownText content={block.content} />
        </div>
      ) : (
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => onChange({ content: e.target.value })}
          onKeyDown={onKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none outline-none resize-none text-stone-600 italic leading-relaxed placeholder-stone-300"
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "1.1rem",
            minHeight: "1.75rem",
          }}
        />
      )}
      <input
        type="text"
        value={block.metadata?.author || ""}
        onChange={(e) =>
          onChange({ metadata: { ...block.metadata, author: e.target.value } })
        }
        placeholder="— Autor"
        className="w-full mt-1 text-sm text-stone-400 bg-transparent border-none outline-none placeholder-stone-300"
      />
    </div>
  );
}

export default QuoteBlock;
