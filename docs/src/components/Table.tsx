import { Inline } from "./Inline";

/** A table whose cells accept inline markdown (`code`, **bold**, links). */
export function Table({ head, rows }: { head: string[]; rows: string[][] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead><tr>{head.map((h) => <th key={h}>{h}</th>)}</tr></thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>{r.map((c, k) => <td key={k}><Inline text={c} /></td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
