import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import TextBlock from "./TextBlock";
import HeadingBlock from "./HeadingBlock";
import CodeBlock from "./CodeBlock";
import ImageBlock from "./ImageBlock";
import LinkBlock from "./LinkBlock";
import QuoteBlock from "./QuoteBlock";
import BlockMenu from "./BlockMenu";

const BLOCK_COMPONENTS = {
  text: TextBlock,
  heading: HeadingBlock,
  code: CodeBlock,
  image: ImageBlock,
  link: LinkBlock,
  quote: QuoteBlock,
};

function SortableBlock({
  block,
  index,
  isFirst,
  focusTarget,
  shouldFocus,
  onFocused,
  menuOpen,
  menuFilter,
  setMenuOpen,
  setMenuFilter,
  updateBlock,
  deleteBlock,
  replaceBlock,
  handleKeyDown,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const BlockComponent = BLOCK_COMPONENTS[block.type];

  return (
    <div ref={setNodeRef} style={style} className="group relative">
      <div className="absolute -left-25 top-0 opacity-0 group-hover:opacity-100 transition flex items-center gap-0.5 h-7">
        <button
          {...attributes}
          {...listeners}
          className="p-1.5 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-600 cursor-grab active:cursor-grabbing"
          title="Arrastrar bloque"
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
              d="M4 8h16M4 16h16"
            />
          </svg>
        </button>

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
        isFirst={isFirst}
        shouldFocus={focusTarget?.index === index}
        focusTimestamp={focusTarget?.timestamp}
        onFocused={onFocused}
        onChange={(updates) => updateBlock(index, updates)}
        onKeyDown={(e) => handleKeyDown(e, index)}
      />
    </div>
  );
}

export default SortableBlock;
