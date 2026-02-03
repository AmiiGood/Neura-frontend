import { useState } from "react";
import Sidebar from "./components/Sidebar";
import BlockEditor from "./components/BlockEditor";
import Chat from "./components/Chat";
import RelatedNotes from "./components/RelatedNotes";
import { useTour } from "./hooks/useTour";

function App() {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [view, setView] = useState("notes");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Activar el tour
  useTour();
  
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
