import { useEffect, useRef } from "react";

function QuoteBlock({ block, onChange, onKeyDown }) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [block.content]);

  return (
    <div className="border-l-4 border-stone-300 pl-4">
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Escribe una cita..."
        className="w-full bg-transparent border-none outline-none resize-none text-stone-600 italic leading-relaxed"
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1.1rem",
          minHeight: "1.75rem",
        }}
      />
      <input
        type="text"
        value={block.metadata?.author || ""}
        onChange={(e) =>
          onChange({ metadata: { ...block.metadata, author: e.target.value } })
        }
        placeholder="— Autor"
        className="block-input w-full mt-1 text-sm text-stone-400 bg-transparent border-none outline-none"
      />
    </div>
  );
}

export default QuoteBlock;
