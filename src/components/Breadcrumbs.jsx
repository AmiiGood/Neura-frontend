function Breadcrumbs({ note }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="text-stone-400">📄</span>
      <span className="text-stone-400">/</span>
      <span className="text-stone-600 truncate max-w-xs">
        {note?.title || "Sin título"}
      </span>
    </div>
  );
}

export default Breadcrumbs;
