import { useEffect, useRef } from "react";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

/**
 * MathRenderer – Wraps children and runs KaTeX auto-render on mount
 * and whenever the content changes. Handles both $...$ and \\(...\\)
 * delimiter formats.
 */
export function MathRenderer({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      renderMathInElement(ref.current, {
        delimiters: [
          { left: "\\(", right: "\\)", display: false },
          { left: "\\[", right: "\\]", display: true },
          { left: "$$", right: "$$", display: true },
          { left: "$", right: "$", display: false },
        ],
        throwOnError: false,
      });
    }
  });

  return <div ref={ref}>{children}</div>;
}
