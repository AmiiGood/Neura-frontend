import { useEffect, useState } from "react";
import api from "../api";
import logo from "../assets/logo.png";
import KeyboardHints from "./KeyboardHints";
import ConfirmModal from "./ConfirmModal";

function Sidebar({
  notes,
  setNotes,
  selectedNote,
  setSelectedNote,
  view,
  setView,
  isOpen,
  setIsOpen,
}) {
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, note: null });

  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      const res = await api.get("/notes");
      setNotes(res.data);
    } catch (err) {
      console.error("Error cargando notas:", err);
    }
  };

  const createNote = () => {
    setSelectedNote({ title: "", content: "" });
    setView("notes");
  };

  const handleDeleteClick = (note, e) => {
    e.stopPropagation();
    setDeleteModal({ isOpen: true, note });
  };

  const confirmDelete = async () => {
    const note = deleteModal.note;
    if (!note) return;

    try {
      await api.delete(`/notes/${note.id}`);
      setNotes(notes.filter((n) => n.id !== note.id));
      if (selectedNote?.id === note.id) {
        setSelectedNote(null);
      }
    } catch (err) {
      console.error("Error eliminando nota:", err);
    }

    setDeleteModal({ isOpen: false, note: null });
  };

  const cancelDelete = () => {
    setDeleteModal({ isOpen: false, note: null });
  };

  return (
    <aside
      className={`${isOpen ? "w-60" : "w-0"} bg-stone-100 flex flex-col transition-all duration-200 overflow-hidden`}
    >
      <div className="p-3 flex items-center gap-2">
        <img
          src={logo}
          alt="Logo"
          className="w-40 h-25 rounded object-contain"
        />
      </div>

      <div className="px-2 space-y-0.5">
        <button
          onClick={() => setView("notes")}
          className={`w-full text-left px-2 py-1 rounded text-sm flex items-center gap-2 transition ${
            view === "notes" ? "bg-stone-200/80" : "hover:bg-stone-200/50"
          }`}
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
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span className="text-stone-600">Notas</span>
        </button>
        <button
          onClick={() => setView("chat")}
          className={`w-full text-left px-2 py-1 rounded text-sm flex items-center gap-2 transition ${
            view === "chat" ? "bg-stone-200/80" : "hover:bg-stone-200/50"
          }`}
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
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span className="text-stone-600">Chat</span>
        </button>
      </div>

      <div className="mt-4 px-2">
        <button
          id="new-page-btn"
          onClick={createNote}
          className="w-full py-1.5 text-sm text-stone-500 hover:bg-stone-200/50 rounded flex items-center gap-2 px-2 transition"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 4v16m8-8H4"
            />
          </svg>
          Nueva página
        </button>
      </div>

      <div className="flex-1 overflow-y-auto mt-2 px-2">
        <p className="text-xs text-stone-400 px-2 mb-1">Páginas</p>
        {notes.map((note) => (
          <div
            key={note.id}
            onClick={() => {
              setSelectedNote(note);
              setView("notes");
            }}
            className={`group px-2 py-1 rounded cursor-pointer transition flex justify-between items-center text-sm ${
              selectedNote?.id === note.id
                ? "bg-stone-200/80"
                : "hover:bg-stone-200/50"
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <span className="text-stone-400">📄</span>
              <span className="truncate text-stone-600">
                {note.title || "Sin título"}
              </span>
            </div>
            <button
              onClick={(e) => handleDeleteClick(note, e)}
              className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 transition p-0.5"
            >
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>

      <KeyboardHints />

      {/* Modal de confirmación */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        title="Eliminar nota"
        message={`¿Estás seguro de que quieres eliminar "${deleteModal.note?.title || "Sin título"}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
        danger
      />
    </aside>
  );
}

export default Sidebar;
