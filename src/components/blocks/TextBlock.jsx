import { useEffect, useRef, useState } from "react";
import MarkdownText from "./MarkdownText";

function TextBlock({
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
      // Primero activar modo edición, luego enfocar
      setIsFocused(true);
      onFocused?.();
    }
  }, [shouldFocus, focusTimestamp, onFocused]);

  // Enfocar el textarea cuando isFocused cambia a true
  useEffect(() => {
    if (isFocused && textareaRef.current) {
      textareaRef.current.focus();
      // Mover cursor al final
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isFocused]);

  const placeholder = isFirst
    ? "Escribe algo, o presiona '/' para comandos..."
    : "Escribe aquí...";

  const hasMarkdown = block.content && /(\*\*|~~|`|\*)/.test(block.content);

  // Modo preview: sin focus y tiene markdown
  if (!isFocused && hasMarkdown && block.content) {
    return (
      <div
        onClick={() => setIsFocused(true)}
        className="text-stone-600 leading-relaxed cursor-text min-h-[1.75rem]"
        style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}
      >
        <MarkdownText content={block.content} />
      </div>
    );
  }

  // Modo edición
  return (
    <textarea
      ref={textareaRef}
      value={block.content}
      onChange={(e) => onChange({ content: e.target.value })}
      onKeyDown={onKeyDown}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      placeholder={placeholder}
      className="w-full bg-transparent border-none outline-none resize-none text-stone-600 leading-relaxed placeholder-stone-300"
      style={{
        fontFamily: "Georgia, serif",
        fontSize: "1.1rem",
        minHeight: "1.75rem",
      }}
    />
  );
}

export default TextBlock;
