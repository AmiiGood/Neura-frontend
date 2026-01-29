import { useState, useEffect, useRef } from "react";

const BLOCK_TYPES = [
  {
    type: "text",
    label: "Texto",
    description: "Párrafo de texto",
    keywords: ["text", "texto", "parrafo", "paragraph"],
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 6h16M4 12h16M4 18h12"
        />
      </svg>
    ),
  },
  {
    type: "heading",
    label: "Título",
    description: "Encabezado",
    keywords: ["heading", "titulo", "title", "h1", "h2", "h3", "header"],
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M7 8h10M7 12h10M7 16h6"
        />
      </svg>
    ),
  },
  {
    type: "code",
    label: "Código",
    description: "Bloque de código",
    keywords: ["code", "codigo", "script", "programming"],
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
        />
      </svg>
    ),
  },
  {
    type: "image",
    label: "Imagen",
    description: "Subir imagen",
    keywords: ["image", "imagen", "foto", "picture", "photo"],
    icon: (
      <svg
        className="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
        />
      </svg>
    ),
  },
  {
    type: "link",
    label: "Enlace",
    description: "Link con preview",
    keywords: ["link", "enlace", "url", "web"],
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
  {
    type: "quote",
    label: "Cita",
    description: "Bloque de cita",
    keywords: ["quote", "cita", "blockquote"],
    icon: (
      <svg
        className="w-5 h-5"
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
    ),
  },
];

function BlockMenu({ onSelect, onClose, filter = "" }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const menuRef = useRef(null);

  const filteredTypes = BLOCK_TYPES.filter((block) => {
    if (!filter) return true;
    const search = filter.toLowerCase();
    return (
      block.type.includes(search) ||
      block.label.toLowerCase().includes(search) ||
      block.keywords.some((k) => k.includes(search))
    );
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [filter]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => (i + 1) % filteredTypes.length);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (i) => (i - 1 + filteredTypes.length) % filteredTypes.length,
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredTypes[selectedIndex]) {
          onSelect(filteredTypes[selectedIndex].type);
        }
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [filteredTypes, selectedIndex, onSelect, onClose]);

  if (filteredTypes.length === 0) {
    return (
      <>
        <div className="fixed inset-0 z-10" onClick={onClose} />
        <div className="relative z-20 bg-white border border-stone-200 rounded-lg shadow-lg py-3 px-4 w-56">
          <p className="text-sm text-stone-400">Sin resultados</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <div
        ref={menuRef}
        className="relative z-20 bg-white border border-stone-200 rounded-lg shadow-lg py-1 w-56"
      >
        <p className="px-3 py-1.5 text-xs text-stone-400 uppercase tracking-wide">
          Bloques
        </p>
        {filteredTypes.map(({ type, icon, label, description }, index) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className={`w-full px-3 py-2 flex items-center gap-3 transition text-left ${
              index === selectedIndex ? "bg-stone-100" : "hover:bg-stone-50"
            }`}
          >
            <span className="text-stone-500">{icon}</span>
            <div>
              <p className="text-sm text-stone-700">{label}</p>
              <p className="text-xs text-stone-400">{description}</p>
            </div>
          </button>
        ))}
      </div>
    </>
  );
}

export default BlockMenu;
