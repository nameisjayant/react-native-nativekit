import { Fragment, type ReactNode } from "react";

/** Renders inline markdown: `code`, **bold** and [links](url). */
export function Inline({ text }: { text: string }) {
  const parts: ReactNode[] = [];
  const re = /`([^`]+)`|\*\*([^*]+)\*\*|\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text))) {
    parts.push(text.slice(last, m.index));
    if (m[1]) parts.push(<code key={m.index}>{m[1]}</code>);
    else if (m[2]) parts.push(<strong key={m.index}>{m[2]}</strong>);
    else {
      const external = /^https?:/.test(m[4]);
      parts.push(
        <a key={m.index} href={m[4]} {...(external ? { target: "_blank", rel: "noreferrer" } : {})}>
          <Inline text={m[3]} />
        </a>,
      );
    }
    last = re.lastIndex;
  }
  parts.push(text.slice(last));
  return <>{parts.map((p, i) => <Fragment key={i}>{p}</Fragment>)}</>;
}
