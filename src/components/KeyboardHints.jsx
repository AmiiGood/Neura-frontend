function KeyboardHints() {
  const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
  const mod = isMac ? "⌘" : "Ctrl";

  return (
    <div className="px-3 py-2 border-t border-stone-200 text-xs text-stone-400">
      <p className="font-medium text-stone-500 mb-1">Atajos</p>
      <div className="space-y-0.5">
        <p>
          <kbd className="bg-stone-200 px-1 rounded">{mod} + S</kbd> Guardar
        </p>
        <p>
          <kbd className="bg-stone-200 px-1 rounded">{mod} + ⇧ + N</kbd> Nueva
          nota
        </p>
        <p>
          <kbd className="bg-stone-200 px-1 rounded">{mod} + B</kbd> Toggle
          sidebar
        </p>
      </div>
    </div>
  );
}

export default KeyboardHints;
