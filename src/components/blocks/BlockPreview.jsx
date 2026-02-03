function BlockPreview({ block }) {
  const getPreviewContent = () => {
    switch (block.type) {
      case "text":
        return (
          <p
            className="text-stone-600 leading-relaxed"
            style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}
          >
            {block.content || "Escribe algo..."}
          </p>
        );

      case "heading":
        const sizes = { 1: "text-3xl", 2: "text-2xl", 3: "text-xl" };
        const level = block.metadata?.level || 2;
        return (
          <p
            className={`font-bold text-stone-800 ${sizes[level]}`}
            style={{ fontFamily: "Georgia, serif" }}
          >
            {block.content || "Título"}
          </p>
        );

      case "quote":
        return (
          <div className="border-l-4 border-stone-300 pl-4">
            <p
              className="text-stone-600 italic leading-relaxed"
              style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}
            >
              {block.content || "Escribe una cita..."}
            </p>
          </div>
        );

      case "code":
        return (
          <div className="bg-stone-800 text-stone-200 rounded-lg p-3 text-sm font-mono">
            {block.content || "// código"}
          </div>
        );

      case "image":
        return block.content ? (
          <img
            src={block.content}
            alt={block.metadata?.alt || "Imagen"}
            className="max-w-full rounded-lg"
          />
        ) : (
          <div className="border-2 border-dashed border-stone-300 rounded-lg p-4 text-center text-stone-400">
            Imagen
          </div>
        );

      case "link":
        return (
          <div className="flex items-center gap-3 p-3 bg-stone-100 rounded-lg">
            <div className="w-10 h-10 bg-white rounded flex items-center justify-center">
              <svg
                className="w-5 h-5 text-stone-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                />
              </svg>
            </div>
            <span className="text-sm text-stone-600 truncate">
              {block.content || "Enlace"}
            </span>
          </div>
        );

      default:
        return <p className="text-stone-400">Bloque</p>;
    }
  };

  return (
    <div className="bg-white border border-stone-200 rounded-lg shadow-lg p-3 max-w-3xl cursor-grabbing">
      {getPreviewContent()}
    </div>
  );
}

export default BlockPreview;
