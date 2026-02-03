import { useState, useEffect, useRef, useCallback } from "react";
import api from "../api";
import TextBlock from "./blocks/TextBlock";
import HeadingBlock from "./blocks/HeadingBlock";
import CodeBlock from "./blocks/CodeBlock";
import ImageBlock from "./blocks/ImageBlock";
import LinkBlock from "./blocks/LinkBlock";
import QuoteBlock from "./blocks/QuoteBlock";
import BlockMenu from "./blocks/BlockMenu";

const BLOCK_COMPONENTS = {
  text: TextBlock,
  heading: HeadingBlock,
  code: CodeBlock,
  image: ImageBlock,
  link: LinkBlock,
  quote: QuoteBlock,
};

// Hook para debounce
function useDebounce(callback, delay) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay],
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return debouncedCallback;
}

function BlockEditor({
  note,
  setNote,
  notes,
  setNotes,
  sidebarOpen,
  setSidebarOpen,
}) {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuFilter, setMenuFilter] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  // Refs para acceder a valores actuales en el callback
  const titleRef = useRef(title);
  const blocksRef = useRef(blocks);
  const noteRef = useRef(note);

  useEffect(() => {
    titleRef.current = title;
  }, [title]);

  useEffect(() => {
    blocksRef.current = blocks;
  }, [blocks]);

  useEffect(() => {
    noteRef.current = note;
  }, [note]);

  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setHasChanges(false);
      if (note.id) {
        loadBlocks();
      } else {
        setBlocks([{ id: "temp-1", type: "text", content: "", position: 0 }]);
      }
    }
  }, [note?.id]);

  const loadBlocks = async () => {
    try {
      const res = await api.get(`/blocks/note/${note.id}`);
      if (res.data.length === 0) {
        setBlocks([{ id: "temp-1", type: "text", content: "", position: 0 }]);
      } else {
        setBlocks(res.data);
      }
    } catch (err) {
      console.error("Error cargando bloques:", err);
    }
  };

  // Función de guardado
  const saveNote = useCallback(async () => {
    const currentTitle = titleRef.current;
    const currentBlocks = blocksRef.current;
    const currentNote = noteRef.current;

    if (!currentTitle.trim()) return;

    setSaving(true);
    try {
      let savedNote = currentNote;

      // Crear o actualizar nota
      if (currentNote?.id) {
        const content = currentBlocks.map((b) => b.content).join("\n");
        const res = await api.put(`/notes/${currentNote.id}`, {
          title: currentTitle,
          content,
        });
        setNotes((prev) =>
          prev.map((n) => (n.id === currentNote.id ? res.data : n)),
        );
        savedNote = res.data;
      } else {
        const content = currentBlocks.map((b) => b.content).join("\n");
        const res = await api.post("/notes", { title: currentTitle, content });
        setNotes((prev) => [res.data, ...prev]);
        setNote(res.data);
        savedNote = res.data;
      }

      // Guardar bloques
      const updatedBlocks = [...currentBlocks];
      for (let i = 0; i < updatedBlocks.length; i++) {
        const block = updatedBlocks[i];
        if (String(block.id).startsWith("temp-")) {
          const res = await api.post(`/blocks/note/${savedNote.id}`, {
            type: block.type,
            content: block.content,
            metadata: block.metadata || {},
            position: i,
          });
          updatedBlocks[i] = res.data;
        } else {
          await api.put(`/blocks/${block.id}`, {
            type: block.type,
            content: block.content,
            metadata: block.metadata || {},
            position: i,
          });
        }
      }

      setBlocks(updatedBlocks);
      setLastSaved(new Date());
      setHasChanges(false);
    } catch (err) {
      console.error("Error guardando:", err);
    }
    setSaving(false);
  }, [setNotes, setNote]);

  // Autoguardado con debounce de 2 segundos
  const debouncedSave = useDebounce(saveNote, 2000);

  // Detectar cambios y disparar autoguardado
  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setHasChanges(true);
    if (newTitle.trim()) {
      debouncedSave();
    }
  };

  const updateBlock = (index, updates) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
    setHasChanges(true);

    // Detectar slash command
    const content = updates.content || "";
    if (content.startsWith("/")) {
      setMenuOpen(index);
      setMenuFilter(content.slice(1));
    } else if (menuOpen === index) {
      setMenuOpen(null);
      setMenuFilter("");
    }

    // Disparar autoguardado si hay título
    if (titleRef.current.trim()) {
      debouncedSave();
    }
  };

  const addBlock = (type, afterIndex) => {
    if (blocks[afterIndex]?.content?.startsWith("/")) {
      const newBlocks = [...blocks];
      newBlocks[afterIndex] = { ...newBlocks[afterIndex], content: "" };
      setBlocks(newBlocks);
    }

    const newBlock = {
      id: `temp-${Date.now()}`,
      type,
      content: "",
      metadata: type === "heading" ? { level: 2 } : {},
      position: afterIndex + 1,
    };
    const newBlocks = [...blocks];
    newBlocks.splice(afterIndex + 1, 0, newBlock);
    setBlocks(newBlocks);
    setMenuOpen(null);
    setMenuFilter("");
    setHasChanges(true);
  };

  const replaceBlock = (index, type) => {
    const newBlocks = [...blocks];
    newBlocks[index] = {
      ...newBlocks[index],
      type,
      content: "",
      metadata: type === "heading" ? { level: 2 } : {},
    };
    setBlocks(newBlocks);
    setMenuOpen(null);
    setMenuFilter("");
    setHasChanges(true);
  };

  const deleteBlock = async (index) => {
    if (blocks.length === 1) return;

    const block = blocks[index];
    if (!String(block.id).startsWith("temp-")) {
      try {
        await api.delete(`/blocks/${block.id}`);
      } catch (err) {
        console.error("Error eliminando bloque:", err);
      }
    }

    const newBlocks = blocks.filter((_, i) => i !== index);
    setBlocks(newBlocks);
    setHasChanges(true);
  };

  const handleKeyDown = (e, index) => {
    if (menuOpen === index) {
      return;
    }

    if (e.key === "Enter" && !e.shiftKey && blocks[index].type === "text") {
      e.preventDefault();
      addBlock("text", index);
    }
    if (
      e.key === "Backspace" &&
      blocks[index].content === "" &&
      blocks.length > 1
    ) {
      e.preventDefault();
      deleteBlock(index);
    }
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
          {/* Indicador de estado */}
          <span className="text-xs text-stone-400 flex items-center gap-1">
            {saving ? (
              <>
                <span className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
                Guardando...
              </>
            ) : hasChanges ? (
              <>
                <span className="w-2 h-2 bg-orange-400 rounded-full" />
                Sin guardar
              </>
            ) : lastSaved ? (
              <>
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Guardado{" "}
                {lastSaved.toLocaleTimeString("es", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </>
            ) : null}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-24 py-12">
          <input
            type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Sin título"
            className="w-full text-4xl font-bold bg-transparent border-none outline-none placeholder-stone-300 text-stone-800 mb-8"
            style={{ fontFamily: "Georgia, serif" }}
          />

          <div className="space-y-2">
            {blocks.map((block, index) => {
              const BlockComponent = BLOCK_COMPONENTS[block.type];
              return (
                <div key={block.id} className="group relative">
                  <div className="absolute -left-17 top-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 h-7">
                    <button
                      onClick={() => {
                        if (menuOpen === index) {
                          setMenuOpen(null);
                          setMenuFilter("");
                        } else {
                          setMenuOpen(index);
                          setMenuFilter("");
                        }
                      }}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600"
                      title="Añadir bloque"
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
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => deleteBlock(index)}
                      className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-red-500"
                      title="Eliminar bloque"
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
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                    </button>
                  </div>

                  {menuOpen === index && (
                    <div className="absolute left-0 top-7 z-20">
                      <BlockMenu
                        filter={menuFilter}
                        onSelect={(type) => replaceBlock(index, type)}
                        onClose={() => {
                          setMenuOpen(null);
                          setMenuFilter("");
                        }}
                      />
                    </div>
                  )}

                  <BlockComponent
                    block={block}
                    onChange={(updates) => updateBlock(index, updates)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                </div>
              );
            })}
          </div>

          <button
            onClick={() => addBlock("text", blocks.length - 1)}
            className="mt-4 text-stone-400 hover:text-stone-600 text-sm flex items-center gap-1 transition"
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
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Añadir bloque
          </button>
        </div>
      </div>
    </div>
  );
}

export default BlockEditor;
