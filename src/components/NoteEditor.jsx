import { useState, useEffect } from "react";
import api from "../api";

function NoteEditor({
  note,
  setNote,
  notes,
  setNotes,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setContent(note.content || "");
    }
  }, [note]);

  const saveNote = async () => {
    if (!title.trim() || !content.trim()) return;

    setSaving(true);
    try {
      if (note?.id) {
        const res = await api.put(`/notes/${note.id}`, { title, content });
        setNotes(notes.map((n) => (n.id === note.id ? res.data : n)));
        setNote(res.data);
      } else {
        const res = await api.post("/notes", { title, content });
        setNotes([res.data, ...notes]);
        setNote(res.data);
      }
      setLastSaved(new Date());
    } catch (err) {
      console.error("Error guardando nota:", err);
    }
    setSaving(false);
  };

  if (!note) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="h-11 border-b border-stone-200 flex items-center px-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-stone-100 rounded transition mr-2"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-stone-400 text-lg">Selecciona una nota</p>
            <p className="text-stone-300 text-sm mt-1">
              o crea una nueva desde el sidebar
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Top bar */}
      <div className="h-11 border-b border-stone-200 flex items-center justify-between px-3">
        <div className="flex items-center gap-2">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-1 hover:bg-stone-100 rounded transition"
            >
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
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          )}
          <span className="text-sm text-stone-400 truncate max-w-xs">
            {title || "Sin título"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {lastSaved && (
            <span className="text-xs text-stone-400">
              Guardado{" "}
              {lastSaved.toLocaleTimeString("es", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
          <button
            onClick={saveNote}
            disabled={saving || !title.trim() || !content.trim()}
            className="px-3 py-1 text-sm bg-stone-800 text-white rounded hover:bg-stone-700 disabled:bg-stone-300 disabled:text-stone-500 transition"
          >
            {saving ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-16 py-12">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Sin título"
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-stone-300 text-stone-800"
            style={{ fontFamily: "Georgia, serif" }}
          />

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Escribe algo, o presiona '/' para comandos..."
            className="w-full mt-4 bg-transparent border-none outline-none resize-none text-stone-600 leading-relaxed min-h-[60vh]"
            style={{ fontFamily: "Georgia, serif", fontSize: "1.1rem" }}
          />
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;
