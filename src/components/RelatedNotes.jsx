import { useState, useEffect } from "react";
import api from "../api";

function RelatedNotes({ noteId, onSelectNote }) {
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (noteId) {
      loadRelated();
    }
  }, [noteId]);

  const loadRelated = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/notes/${noteId}/related`);
      setRelated(res.data);
    } catch (err) {
      console.error("Error cargando relacionadas:", err);
    }
    setLoading(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute right-4 top-14 p-2 bg-white border border-stone-200 rounded-lg shadow-sm hover:bg-stone-50 transition"
      >
        <svg
          className="w-4 h-4 text-stone-500"
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
      </button>
    );
  }

  return (
    <div className="w-64 border-l border-stone-200 bg-stone-50/50 flex flex-col">
      <div className="h-11 border-b border-stone-200 flex items-center justify-between px-3">
        <span className="text-xs font-medium text-stone-500 uppercase tracking-wide">
          Relacionadas
        </span>
        <button
          onClick={() => setIsOpen(false)}
          className="p-1 hover:bg-stone-200 rounded transition"
        >
          <svg
            className="w-4 h-4 text-stone-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <p className="text-sm text-stone-400">Buscando conexiones...</p>
        ) : related.length === 0 ? (
          <div className="text-center py-8">
            <svg
              className="w-8 h-8 text-stone-300 mx-auto mb-2"
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
            <p className="text-sm text-stone-400">Sin conexiones aún</p>
          </div>
        ) : (
          <div className="space-y-2">
            {related.map((note) => (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className="p-2.5 bg-white border border-stone-200 rounded-lg cursor-pointer hover:border-stone-300 hover:shadow-sm transition"
              >
                <p className="text-sm font-medium text-stone-700 truncate">
                  {note.title}
                </p>
                <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                  {note.content}
                </p>
                <div className="flex items-center gap-1 mt-2">
                  <div className="h-1 flex-1 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-stone-400 rounded-full"
                      style={{ width: `${Math.round(note.similarity * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs text-stone-400">
                    {Math.round(note.similarity * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RelatedNotes;
