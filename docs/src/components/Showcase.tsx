"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const INTERVAL = 4200;

/** Scenes drawn with CSS to suggest what each component looks like on a device. */
const SCENES = [
  {
    slug: "button",
    name: "Button",
    suffix: "Material 3",
    render: () => (
      <div className="demo demo-buttons">
        <span className="m3 m3-filled">Filled</span>
        <span className="m3 m3-tonal">Tonal</span>
        <span className="m3 m3-outlined">Outlined</span>
        <span className="m3 m3-elevated">Elevated</span>
        <span className="m3 m3-text">Text</span>
        <span className="m3 m3-filled m3-loading"><i className="spinner" />Placing order…</span>
      </div>
    ),
  },
  {
    slug: "button",
    name: "Button",
    suffix: "Liquid Glass",
    render: () => (
      <div className="demo demo-glass">
        <span className="glass">Get started</span>
        <span className="glass glass-tint">Tinted</span>
      </div>
    ),
  },
  {
    slug: "bottom-sheet",
    name: "Bottom sheet",
    suffix: "halfExpanded",
    render: () => (
      <div className="demo demo-sheet">
        <div className="scrim" />
        <div className="sheet">
          <span className="handle" />
          <span className="sheet-title" />
          <span className="sk-line" />
          <span className="sk-line short" />
          <span className="m3 m3-filled">Close</span>
        </div>
      </div>
    ),
  },
  {
    slug: "bottom-sheet",
    name: "Bottom sheet",
    suffix: "actionSheet",
    render: () => (
      <div className="demo demo-sheet">
        <div className="scrim" />
        <div className="action-sheet">
          <div className="as-group">
            <span className="as-head"><b>Photo options</b>Choose what to do with this photo.</span>
            <span>Share</span>
            <span className="as-disabled">Archive</span>
            <span className="as-destructive">Delete</span>
          </div>
          <div className="as-group"><span className="as-cancel">Cancel</span></div>
        </div>
      </div>
    ),
  },
];

/** A phone-shaped frame that cycles through the components. */
export function Showcase() {
  const [index, setIndex] = useState(0);

  // Always advances; a dot click restarts the timer since it changes `index`.
  useEffect(() => {
    const t = setTimeout(() => setIndex((i) => (i + 1) % SCENES.length), INTERVAL);
    return () => clearTimeout(t);
  }, [index]);

  const scene = SCENES[index];
  return (
    <div className="showcase">
      <div className="phone">
        <div className="phone-notch" aria-hidden="true" />
        <div className="phone-screen">
          <div className="phone-content" aria-hidden="true">
            <div className="sk sk-title" />
            <div className="sk sk-card" />
            <div className="sk-row"><div className="sk sk-tile" /><div className="sk sk-tile" /></div>
          </div>
          <div className="phone-demo" key={index} aria-hidden="true">{scene.render()}</div>
        </div>
      </div>
      <div className="showcase-caption" aria-live="polite">
        <Link href={`/docs/${scene.slug}/`} className="showcase-name">{scene.name} <span>{scene.suffix}</span></Link>
        <div className="showcase-dots" role="tablist" aria-label="Components">
          {SCENES.map((s, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`${s.name}, ${s.suffix}`}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
