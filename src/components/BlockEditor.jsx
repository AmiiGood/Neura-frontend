import { useState, useEffect, useRef, useCallback } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import api from "../api";
import SortableBlock from "./blocks/SortableBlock";
import BlockPreview from "./blocks/BlockPreview";
import BlockMenu from "./blocks/BlockMenu";
import Breadcrumbs from "./Breadcrumbs";
import SyncIndicator from "./SyncIndicator";

// Hook para debounce
function useDebounce(callback, delay, onStart) {
  const timeoutRef = useRef(null);

  const debouncedCallback = useCallback(
    (...args) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        onStart?.(); // Notificar que va a empezar
        callback(...args);
      }, delay);
    },
    [callback, delay, onStart],
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
  saveRequested,
}) {
  const [title, setTitle] = useState("");
  const [blocks, setBlocks] = useState([]);
  const [saving, setSaving] = useState(false);
  const [menuOpen, setMenuOpen] = useState(null);
  const [menuFilter, setMenuFilter] = useState("");
  const [lastSaved, setLastSaved] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [activeBlock, setActiveBlock] = useState(null);
  const [focusIndex, setFocusIndex] = useState(null);
  const [focusTarget, setFocusTarget] = useState(null);
  const [syncStatus, setSyncStatus] = useState(null);

  // Refs para acceder a valores actuales en el callback
  const titleRef = useRef(title);
  const blocksRef = useRef(blocks);
  const noteRef = useRef(note);

  // Sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Necesita mover 8px antes de activar el drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

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

  useEffect(() => {
    if (saveRequested > 0) {
      saveNote();
    }
  }, [saveRequested]);

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

  const saveNote = useCallback(async () => {
    const currentTitle = titleRef.current;
    const currentBlocks = blocksRef.current;
    const currentNote = noteRef.current;

    if (!currentTitle.trim()) return;

    // Ya no seteamos "saving" aquí, lo hace el debounce
    try {
      let savedNote = currentNote;

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
      setSyncStatus("saved");
    } catch (err) {
      console.error("Error guardando:", err);
      setSyncStatus("error");

      setTimeout(() => {
        setSyncStatus("unsaved");
      }, 3000);
    }
  }, [setNotes, setNote]);

  const debouncedSave = useDebounce(saveNote, 2000, () =>
    setSyncStatus("saving"),
  );

  const handleTitleChange = (newTitle) => {
    setTitle(newTitle);
    setHasChanges(true);
    if (syncStatus !== "saving") {
      setSyncStatus("unsaved");
    }
    if (newTitle.trim()) {
      debouncedSave();
    }
  };

  const updateBlock = (index, updates) => {
    const newBlocks = [...blocks];
    newBlocks[index] = { ...newBlocks[index], ...updates };
    setBlocks(newBlocks);
    setHasChanges(true);
    if (syncStatus !== "saving") {
      setSyncStatus("unsaved");
    }

    const content = updates.content || "";
    if (content.startsWith("/")) {
      setMenuOpen(index);
      setMenuFilter(content.slice(1));
    } else if (menuOpen === index) {
      setMenuOpen(null);
      setMenuFilter("");
    }

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
    setFocusTarget({ index: afterIndex + 1, timestamp: Date.now() });
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
    setFocusTarget({ index, timestamp: Date.now() });
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
    const newFocusIndex = Math.max(0, index - 1);

    setBlocks(newBlocks);
    setHasChanges(true);

    // Usar setTimeout para que el estado de blocks se actualice primero
    setTimeout(() => {
      setFocusTarget({ index: newFocusIndex, timestamp: Date.now() });
    }, 10);
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

  // Handler para drag & drop
  const handleDragStart = (event) => {
    const { active } = event;
    const block = blocks.find((b) => b.id === active.id);
    setActiveBlock(block);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveBlock(null);

    if (active.id !== over?.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        const newItems = arrayMove(items, oldIndex, newIndex);
        setHasChanges(true);

        if (titleRef.current.trim()) {
          debouncedSave();
        }

        return newItems;
      });
    }
  };

  if (!note) {
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
            <Breadcrumbs note={{ title }} />
          </div>

          <SyncIndicator status={syncStatus} lastSaved={lastSaved} />
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

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={blocks.map((b) => b.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {blocks.map((block, index) => (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    index={index}
                    isFirst={index === 0}
                    focusTarget={focusTarget}
                    onFocused={() => setFocusTarget(null)}
                    menuOpen={menuOpen}
                    menuFilter={menuFilter}
                    setMenuOpen={setMenuOpen}
                    setMenuFilter={setMenuFilter}
                    updateBlock={updateBlock}
                    deleteBlock={deleteBlock}
                    replaceBlock={replaceBlock}
                    handleKeyDown={handleKeyDown}
                  />
                ))}
              </div>
            </SortableContext>

            <DragOverlay>
              {activeBlock ? <BlockPreview block={activeBlock} /> : null}
            </DragOverlay>
          </DndContext>

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
