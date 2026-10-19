"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { setDocsOrder } from "@/lib/docsNav";

interface Item { slug: string; name: string }

export function DocsSidebar({ items }: { items: Item[] }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);
  const activeSlug = path.split("/").filter(Boolean)[1] ?? "";
  const active = items.find((i) => i.slug === activeSlug);
  setDocsOrder(["", ...items.map((i) => i.slug)]);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.classList.add("no-scroll");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.classList.remove("no-scroll");
    };
  }, [open]);

  return (
    <>
      <button type="button" className="sidebar-trigger" onClick={() => setOpen(true)} aria-expanded={open} aria-controls="docs-sidebar">
        <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        <span>{active ? active.name : "Getting started"}</span>
        <span className="sidebar-trigger-hint">All components</span>
      </button>
      <div className={open ? "sidebar-scrim show" : "sidebar-scrim"} onClick={() => setOpen(false)} aria-hidden="true" />
      <aside id="docs-sidebar" className={open ? "sidebar open" : "sidebar"} aria-label="Documentation">
        <div className="sidebar-head">
          <span>Docs</span>
          <button type="button" className="icon-btn sidebar-close" onClick={() => setOpen(false)} aria-label="Close menu">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
          </button>
        </div>
        <nav>
          <p className="sidebar-group">Overview</p>
          <Link href="/docs/" className={activeSlug === "" ? "side-link active" : "side-link"}>
            <span className="side-dot" aria-hidden="true" />Getting started
          </Link>
          <p className="sidebar-group">
            Components <span className="count">{items.length}</span>
          </p>
          {items.map((it) => (
            <Link key={it.slug} href={`/docs/${it.slug}/`} className={it.slug === activeSlug ? "side-link active" : "side-link"}>
              <span className="side-dot" aria-hidden="true" />
              {it.name}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
