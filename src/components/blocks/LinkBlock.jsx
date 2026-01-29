import { useState } from "react";

function LinkBlock({ block, onChange }) {
  const [inputUrl, setInputUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!inputUrl.trim()) return;

    let url = inputUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    onChange({
      content: url,
      metadata: {
        ...block.metadata,
        title: new URL(url).hostname,
      },
    });
    setInputUrl("");
  };

  if (!block.content) {
    return (
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={inputUrl}
          onChange={(e) => setInputUrl(e.target.value)}
          placeholder="Pega un enlace..."
          className="flex-1 px-3 py-2 bg-stone-100 rounded-lg text-sm outline-none focus:ring-2 focus:ring-stone-300"
        />
        <button
          type="submit"
          className="px-3 py-2 bg-stone-800 text-white rounded-lg text-sm hover:bg-stone-700 transition"
        >
          Añadir
        </button>
      </form>
    );
  }

  return (
    <a
      href={block.content}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 p-3 bg-stone-100 rounded-lg hover:bg-stone-200 transition group"
    >
      <div className="w-10 h-10 bg-white rounded flex items-center justify-center flex-shrink-0">
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
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-stone-700 truncate">
          {block.metadata?.title || block.content}
        </p>
        <p className="text-xs text-stone-400 truncate">{block.content}</p>
      </div>
      <svg
        className="w-4 h-4 text-stone-400 opacity-0 group-hover:opacity-100 transition"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
        />
      </svg>
    </a>
  );
}

export default LinkBlock;
