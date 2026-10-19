// A small TSX / Kotlin / Swift / shell tokenizer, enough for the snippets on this site.
// Runs at build time, so pages ship as plain HTML with no highlighting library.

export type Token = { kind: string | null; text: string };

const KEYWORDS = new Set([
  // TypeScript / JavaScript
  "import", "export", "from", "default", "const", "let", "var", "function", "return", "type", "interface",
  "async", "await", "new", "if", "else", "true", "false", "null", "undefined", "typeof", "as", "for", "of",
  // Kotlin / Swift
  "val", "fun", "class", "struct", "object", "private", "public", "internal", "when", "in", "it", "this", "self",
]);

const RULES: [string, RegExp][] = [
  ["comment", /^(\/\/[^\n]*|#[^\n]*|\/\*[\s\S]*?\*\/)/],
  ["string", /^("(?:\\.|[^"\\\n])*"|'(?:\\.|[^'\\\n])*'|`(?:\\.|[^`\\])*`)/],
  ["number", /^(0x[0-9A-Fa-f]+|\d+(\.\d+)?)(\.dp|\.sp|f|L)?\b/],
  ["annotation", /^@\w+/],
  ["tag", /^<\/?[A-Za-z][\w.]*/],
  ["word", /^[A-Za-z_$][\w$]*/],
  ["space", /^\s+/],
  ["punct", /^[\s\S]/],
];

export function highlight(code: string, lang: string): Token[] {
  if (lang === "bash") return highlightShell(code);
  const out: Token[] = [];
  let rest = code;
  while (rest) {
    for (const [kind, re] of RULES) {
      const m = re.exec(rest);
      if (!m) continue;
      const text = m[0];
      rest = rest.slice(text.length);
      if (kind === "comment" && text.startsWith("#")) {
        // '#' only starts a comment in shell snippets; emit it as punctuation and re-scan the rest.
        rest = text.slice(1) + rest;
        push(out, "punct", "#");
      } else if (kind === "tag") {
        // `<Foo` / `</Foo`: the bracket stays plain, the name is a type.
        const name = text.replace(/^<\/?/, "");
        push(out, null, text.slice(0, text.length - name.length));
        push(out, "type", name);
      } else if (kind === "word") {
        const next = rest.trimStart()[0];
        if (KEYWORDS.has(text)) push(out, "keyword", text);
        else if (/^[A-Z]/.test(text)) push(out, "type", text);
        else if (next === "(") push(out, "fn", text);
        else if ((next === "=" && rest.trimStart()[1] !== "=" && rest.trimStart()[1] !== ">") || next === ":") push(out, "param", text);
        else push(out, null, text);
      } else {
        push(out, kind === "space" || kind === "punct" ? null : kind, text);
      }
      break;
    }
  }
  return out;
}

/** Shell: `# comments`, and the command at the start of a line or after `&&` is a function. */
function highlightShell(code: string): Token[] {
  const out: Token[] = [];
  for (const [n, line] of code.split("\n").entries()) {
    if (n > 0) push(out, null, "\n");
    if (line.trimStart().startsWith("#")) {
      push(out, "comment", line);
      continue;
    }
    line.split(/(\s*&&\s*)/).forEach((part, k) => {
      if (k % 2) return push(out, null, part);
      const [, cmd, rest] = /^(\S*)([\s\S]*)$/.exec(part)!;
      push(out, "fn", cmd);
      push(out, null, rest);
    });
  }
  return out;
}

function push(out: Token[], kind: string | null, text: string) {
  const last = out[out.length - 1];
  if (last && last.kind === kind && kind === null) last.text += text;
  else out.push({ kind, text });
}
