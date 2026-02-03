// src/App.jsx
import { useState, useCallback } from "react";
import Sidebar from "./components/Sidebar";
import BlockEditor from "./components/BlockEditor";
import Chat from "./components/Chat";
import RelatedNotes from "./components/RelatedNotes";
import { useTour } from "./hooks/useTour";
import { useKeyboardShortcuts } from "./hooks/useKeyboardShortcuts";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState("notes");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [saveRequested, setSaveRequested] = useState(0); // Trigger para guardar

  useTour();

  // Handlers para atajos
  const handleSave = useCallback(() => {
    setSaveRequested((prev) => prev + 1);
  }, []);

  const handleNewNote = useCallback(() => {
    setSelectedNote({ title: "", content: "" });
    setView("notes");
  }, []);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const handleSearch = useCallback(() => {
    // Lo implementaremos después con la búsqueda
    console.log("Buscar...");
  }, []);

  useKeyboardShortcuts({
    onSave: handleSave,
    onNewNote: handleNewNote,
    onToggleSidebar: handleToggleSidebar,
    onSearch: handleSearch,
  });

  return (
    <div className="h-screen flex bg-white text-stone-800">
      <Sidebar
        notes={notes}
        setNotes={setNotes}
        selectedNote={selectedNote}
        setSelectedNote={setSelectedNote}
        view={view}
        setView={setView}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      <main className="flex-1 flex overflow-hidden">
        {view === "notes" ? (
          <>
            <BlockEditor
              note={selectedNote}
              setNote={setSelectedNote}
              notes={notes}
              setNotes={setNotes}
              sidebarOpen={sidebarOpen}
              setSidebarOpen={setSidebarOpen}
              saveRequested={saveRequested}
            />
            {selectedNote?.id && (
              <RelatedNotes
                noteId={selectedNote.id}
                onSelectNote={(note) => setSelectedNote(note)}
              />
            )}
          </>
        ) : (
          <Chat sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        )}
      </main>
    </div>
  );
}

export default App;
