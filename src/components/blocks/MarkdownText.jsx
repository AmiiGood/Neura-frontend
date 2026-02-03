import { useMarkdown } from "../../hooks/useMarkdown";

function MarkdownText({ content }) {
  const { parseMarkdown } = useMarkdown();
  const segments = parseMarkdown(content);

  if (!content) return null;

  return (
    <>
      {segments.map((segment, index) => {
        switch (segment.type) {
          case "bold":
            return (
              <strong key={index} className="font-bold">
                {segment.text}
              </strong>
            );
          case "italic":
            return (
              <em key={index} className="italic">
                {segment.text}
              </em>
            );
          case "strikethrough":
            return (
              <del key={index} className="line-through text-stone-400">
                {segment.text}
              </del>
            );
          case "code":
            return (
              <code
                key={index}
                className="bg-stone-100 text-red-600 px-1.5 py-0.5 rounded text-sm font-mono"
              >
                {segment.text}
              </code>
            );
          default:
            return <span key={index}>{segment.text}</span>;
        }
      })}
    </>
  );
}

export default MarkdownText;
