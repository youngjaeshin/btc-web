"use client";

import { useEffect, useRef } from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

interface KatexBlockProps {
  math: string;
  display?: boolean;
  className?: string;
}

export function KatexBlock({
  math,
  display = false,
  className = "",
}: KatexBlockProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (ref.current) {
      katex.render(math, ref.current, {
        displayMode: display,
        throwOnError: false,
        strict: false,
      });
    }
  }, [math, display]);

  return (
    <span
      ref={ref}
      className={`${display ? "block my-4 text-center overflow-x-auto" : "inline"} ${className}`}
    />
  );
}
