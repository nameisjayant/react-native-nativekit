import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Toc } from "@/components/Toc";
import { BottomSheetDoc, sections as bottomSheetSections } from "@/content/bottom-sheet";
import { ButtonDoc, sections as buttonSections } from "@/content/button";
import { components, getComponent } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

const CONTENT: Record<string, { Body: () => React.ReactNode; sections: { id: string; title: string }[] }> = {
  button: { Body: ButtonDoc, sections: buttonSections },
  "bottom-sheet": { Body: BottomSheetDoc, sections: bottomSheetSections },
};

export const dynamicParams = false;

export function generateStaticParams() {
  return components.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const c = getComponent((await params).slug);
  return c ? { title: c.name, description: c.summary } : {};
}

export default async function ComponentPage({ params }: Props) {
  const { slug } = await params;
  const c = getComponent(slug);
  const content = CONTENT[slug];
  if (!c || !content) notFound();

  const i = components.indexOf(c);
  const prev = components[i - 1];
  const next = components[i + 1];
  const { Body } = content;

  return (
    <div className="doc-with-toc">
      <article className="doc">
        <p className="crumbs">
          Docs / Components / <span>{String(i + 1).padStart(2, "0")}</span>
        </p>
        <h1>
          NativeKit<span className="h1-suffix">{c.component.replace("NativeKit", "")}</span>
        </h1>
        <p className="lead">{c.summary}</p>
        <ul className="tags" aria-label="Traits">
          {c.tags.map((t) => <li key={t}>{t}</li>)}
        </ul>

        <Body />

        <nav className="pager" aria-label="More components">
          {prev ? (
            <Link href={`/docs/${prev.slug}/`} className="pager-link">
              <span>Previous</span>
              {prev.name}
            </Link>
          ) : (
            <Link href="/docs/" className="pager-link">
              <span>Previous</span>
              Getting started
            </Link>
          )}
          {next && (
            <Link href={`/docs/${next.slug}/`} className="pager-link next">
              <span>Next</span>
              {next.name}
            </Link>
          )}
        </nav>
      </article>
      <Toc sections={content.sections} />
    </div>
  );
}
