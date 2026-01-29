import { useState, useRef } from "react";
import api from "../../api";

function ImageBlock({ block, onChange }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const res = await api.post("/blocks/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onChange({
        content: res.data.url,
        metadata: { ...block.metadata, alt: file.name },
      });
    } catch (err) {
      console.error("Error subiendo imagen:", err);
    }
    setUploading(false);
  };

  if (!block.content) {
    return (
      <div
        onClick={() => fileRef.current?.click()}
        className="border-2 border-dashed border-stone-300 rounded-lg p-8 text-center cursor-pointer hover:border-stone-400 transition"
      >
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />
        {uploading ? (
          <p className="text-stone-400">Subiendo...</p>
        ) : (
          <>
            <svg
              className="w-8 h-8 text-stone-300 mx-auto mb-2"
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
            <p className="text-stone-400 text-sm">Click para subir imagen</p>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="relative group">
      <img
        src={block.content}
        alt={block.metadata?.alt || "Imagen"}
        className="max-w-full rounded-lg"
      />
      <button
        onClick={() => onChange({ content: "", metadata: {} })}
        className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded opacity-0 group-hover:opacity-100 transition"
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
      <input
        type="text"
        value={block.metadata?.alt || ""}
        onChange={(e) =>
          onChange({ metadata: { ...block.metadata, alt: e.target.value } })
        }
        placeholder="Descripción de la imagen..."
        className="w-full mt-2 text-sm text-stone-400 bg-transparent border-none outline-none text-center"
      />
    </div>
  );
}

export default ImageBlock;
