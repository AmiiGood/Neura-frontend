import { useEffect } from "react";

export function useKeyboardShortcuts({
  onSave,
  onNewNote,
  onToggleSidebar,
  onSearch,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
      const modifier = isMac ? e.metaKey : e.ctrlKey;

      // Cmd/Ctrl + S → Guardar
      if (modifier && e.key === "s") {
        e.preventDefault();
        onSave?.();
      }

      // Cmd/Ctrl + Shift + N → Nueva nota (evita colisión)
      if (modifier && e.shiftKey && e.key === "N") {
        e.preventDefault();
        onNewNote?.();
      }

      // Cmd/Ctrl + B → Toggle sidebar
      if (modifier && e.key === "b") {
        e.preventDefault();
        onToggleSidebar?.();
      }

      // Cmd/Ctrl + K → Buscar
      if (modifier && e.key === "k") {
        e.preventDefault();
        onSearch?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSave, onNewNote, onToggleSidebar, onSearch]);
}
