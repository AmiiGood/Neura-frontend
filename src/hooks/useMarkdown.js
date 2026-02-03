import { useCallback } from "react";

export function useMarkdown() {
  const parseMarkdown = useCallback((text) => {
    if (!text) return [];

    const patterns = [
      { regex: /\*\*(.+?)\*\*/g, type: "bold" },
      { regex: /\*(.+?)\*/g, type: "italic" },
      { regex: /~~(.+?)~~/g, type: "strikethrough" },
      { regex: /`(.+?)`/g, type: "code" },
    ];

    let result = [{ text, type: "normal" }];

    patterns.forEach(({ regex, type }) => {
      const newResult = [];

      result.forEach((segment) => {
        if (segment.type !== "normal") {
          newResult.push(segment);
          return;
        }

        let lastIndex = 0;
        let match;
        const str = segment.text;
        regex.lastIndex = 0;

        while ((match = regex.exec(str)) !== null) {
          if (match.index > lastIndex) {
            newResult.push({
              text: str.slice(lastIndex, match.index),
              type: "normal",
            });
          }
          newResult.push({
            text: match[1],
            type: type,
            raw: match[0],
          });
          lastIndex = match.index + match[0].length;
        }

        if (lastIndex < str.length) {
          newResult.push({
            text: str.slice(lastIndex),
            type: "normal",
          });
        }
      });

      result = newResult;
    });

    return result;
  }, []);

  return { parseMarkdown };
}
