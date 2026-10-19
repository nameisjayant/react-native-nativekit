import { DocsSidebar } from "@/components/DocsSidebar";
import { components } from "@/lib/data";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="docs">
      <DocsSidebar items={components.map(({ slug, name }) => ({ slug, name }))} />
      <main id="main" className="docs-main">{children}</main>
    </div>
  );
}
