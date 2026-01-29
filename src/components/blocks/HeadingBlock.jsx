function HeadingBlock({ block, onChange, onKeyDown }) {
  const level = block.metadata?.level || 2;

  const sizes = {
    1: "text-3xl",
    2: "text-2xl",
    3: "text-xl",
  };

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
        type="text"
        value={block.content}
        onChange={(e) => onChange({ content: e.target.value })}
        onKeyDown={onKeyDown}
        placeholder="Título"
        className={`flex-1 bg-transparent border-none outline-none font-bold text-stone-800 placeholder-stone-300 ${sizes[level]}`}
        style={{ fontFamily: "Georgia, serif" }}
      />
    </div>
  );
}

export default HeadingBlock;
