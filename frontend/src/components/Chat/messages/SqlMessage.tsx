import { useState } from "react";
import { Copy, Check, Table2, Terminal } from "lucide-react";
import type { SqlPayload } from "@/types";

interface Props {
  payload: SqlPayload;
}

export function SqlMessage({ payload }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(payload.sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="max-w-[95%] w-full space-y-3" data-print-sql>
      {/* SQL block */}
      <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-xs">
        <div className="flex items-center justify-between px-3.5 py-2 bg-muted/60 border-b border-border">
          <div className="flex items-center gap-1.5">
            <Terminal className="w-3.5 h-3.5 text-accent" />
            <span className="text-xs font-mono font-semibold text-foreground">Generated SQL</span>
          </div>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground px-2 py-0.5 rounded hover:bg-muted transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-600" />
                <span className="text-[11px] text-emerald-600 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="text-[11px]">Copy SQL</span>
              </>
            )}
          </button>
        </div>
        <pre className="px-4 py-3 text-xs font-mono overflow-x-auto bg-[#0B1120] text-[#F1F5F9] leading-relaxed selection:bg-accent selection:text-white">
          <code>{payload.sql}</code>
        </pre>
      </div>

      {/* Result table */}
      {payload.rows.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden bg-surface shadow-xs">
          <div className="flex items-center justify-between px-3.5 py-2 bg-muted/60 border-b border-border">
            <div className="flex items-center gap-1.5">
              <Table2 className="w-3.5 h-3.5 text-accent" />
              <span className="text-xs font-semibold text-foreground">Query Results</span>
            </div>
            <span className="text-[11px] font-mono text-muted-foreground px-2 py-0.5 rounded bg-muted/80">
              {payload.rows.length.toLocaleString()} row{payload.rows.length !== 1 ? "s" : ""}
              {payload.truncated ? " (truncated)" : ""}
            </span>
          </div>
          <div className="overflow-x-auto max-h-72">
            <table className="text-xs w-full border-collapse">
              <thead className="bg-muted/80 sticky top-0 z-10">
                <tr>
                  {payload.columns.map((col) => (
                    <th
                      key={col}
                      className="px-3.5 py-2 text-left font-semibold text-foreground border-b border-border whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {payload.rows.map((row, i) => (
                  <tr key={i} className={`transition-colors hover:bg-accent/5 ${i % 2 === 0 ? "bg-surface" : "bg-muted/20"}`}>
                    {payload.columns.map((col) => (
                      <td key={col} className="px-3.5 py-2 font-mono text-foreground/90 whitespace-nowrap">
                        {String(row[col] ?? "")}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
