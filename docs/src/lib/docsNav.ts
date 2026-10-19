// Sidebar order of doc pages ("" is Getting started), so the page transition
// can slide forward or back depending on where the reader came from.
let order: string[] = [];
let lastSlug: string | null = null;
let lastDir: "forward" | "back" = "forward";

export function setDocsOrder(slugs: string[]) {
  order = slugs;
}

export function navDirection(slug: string): "forward" | "back" {
  // Same slug again means a re-run of the effect (Strict Mode), not a new navigation.
  if (slug !== lastSlug) {
    if (lastSlug !== null) lastDir = order.indexOf(slug) < order.indexOf(lastSlug) ? "back" : "forward";
    lastSlug = slug;
  }
  return lastDir;
}
