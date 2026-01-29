import { useEffect, useRef } from "react";

function TextBlock({ block, onChange, onKeyDown }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [block.content]);

  return (
    <textarea
      ref={textareaRef}
      value={block.content}
      onChange={(e) => onChange({ content: e.target.value })}
      onKeyDown={onKeyDown}
      placeholder="Escribe algo, o presiona '/' para comandos..."
      className="w-full bg-transparent border-none outline-none resize-none text-stone-600 leading-relaxed"
      style={{
        fontFamily: "Georgia, serif",
        fontSize: "1.1rem",
        minHeight: "1.75rem",
      }}
    />
  );
}

export default TextBlock;
