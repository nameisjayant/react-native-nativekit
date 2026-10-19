"use client";

import { usePathname } from "next/navigation";
import { useLayoutEffect, useRef } from "react";
import { navDirection } from "@/lib/docsNav";

// A template remounts on every navigation, so the entrance animation replays each time a page is picked.
export default function DocsTemplate({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const slug = usePathname().split("/").filter(Boolean)[1] ?? "";

  useLayoutEffect(() => {
    ref.current?.setAttribute("data-dir", navDirection(slug));
  }, [slug]);

  return <div ref={ref} className="page-enter">{children}</div>;
}
