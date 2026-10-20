import { useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { TextPayload } from "@/types";
import { InsightFlowIcon } from "@/components/Brand/InsightFlowIcon";

interface Props {
  payload: TextPayload;
  role: "user" | "assistant";
  isStreaming?: boolean;
}

function stripChartJson(text: string): string {
  return text.replace(/```(?:json)?\s*\{[^`]*"chart_schema"[^`]*\}[^`]*```/gs, "").trim();
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded-md transition-all text-muted-foreground hover:text-foreground hover:bg-muted/80 cursor-pointer ${className ?? ""}`}
      title={copied ? "Copied!" : "Copy to clipboard"}
      data-print-hide
    >
      {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

export function TextMessage({ payload, role, isStreaming }: Props) {
  if (role === "user") {
    return (
      <div className="flex flex-col items-end w-full" data-print-user>
        <div className="relative group rounded-2xl rounded-br-xs px-4.5 py-3 sm:px-5 sm:py-3.5 text-sm bg-primary text-primary-foreground max-w-[85%] sm:max-w-[75%] min-w-[4.5rem] whitespace-pre-wrap leading-relaxed shadow-sm font-normal break-words">
          <span>{payload.text}</span>
          {isStreaming && <span className="inline-block w-1.5 h-4 bg-current ml-1 animate-pulse align-middle" />}
          <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <CopyButton text={payload.text} className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-white/10" />
          </div>
        </div>
      </div>
    );
  }

  const cleanText = role === "assistant" ? stripChartJson(payload.text) : payload.text;

  return (
    <div className="w-full max-w-3xl flex items-start gap-3 my-1" data-print-assistant>
      {/* Assistant Avatar Badge */}
      <div className="p-1.5 rounded-xl bg-surface border border-border shadow-xs flex-shrink-0 mt-0.5">
        <InsightFlowIcon size={22} />
      </div>

      {/* Main Response Area */}
      <div className="flex-1 min-w-0 space-y-1.5">
        {/* Identity bar */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-foreground tracking-tight">
              InsightFlow AI
            </span>
            <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded text-[10px] font-medium bg-accent/10 text-accent border border-accent/20">
              <Sparkles className="w-2.5 h-2.5" />
              Copilot
            </span>
          </div>
          {!isStreaming && cleanText && (
            <CopyButton text={cleanText} className="opacity-60 hover:opacity-100" />
          )}
        </div>

        {/* Card bubble */}
        <div className="relative group rounded-2xl rounded-tl-xs px-5 py-4 text-sm bg-surface border border-border text-foreground shadow-xs leading-relaxed">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ className, children, ...props }) {
                const isBlock = className?.includes("language-");
                if (isBlock) {
                  return (
                    <div className="relative my-3 rounded-xl overflow-hidden border border-border bg-[#0B1120]">
                      <div className="flex items-center justify-between px-3.5 py-1.5 bg-[#172554]/40 border-b border-border/40 text-[11px] font-mono text-muted-foreground">
                        <span>Code</span>
                        <CopyButton text={String(children).replace(/\n$/, "")} className="text-muted-foreground hover:text-foreground hover:bg-white/10" />
                      </div>
                      <pre className="px-4 py-3 overflow-x-auto text-xs font-mono text-[#F1F5F9] leading-relaxed">
                        <code className={className} {...props}>{children}</code>
                      </pre>
                    </div>
                  );
                }
                return (
                  <code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono text-accent font-medium border border-border/50" {...props}>
                    {children}
                  </code>
                );
              },
              table({ children }) {
                return (
                  <div className="overflow-x-auto my-3 rounded-xl border border-border bg-surface shadow-2xs">
                    <table className="text-xs border-collapse w-full">{children}</table>
                  </div>
                );
              },
              th({ children }) {
                return (
                  <th className="border-b border-border px-3.5 py-2.5 bg-muted/60 text-left font-semibold text-foreground whitespace-nowrap">
                    {children}
                  </th>
                );
              },
              td({ children }) {
                return (
                  <td className="border-b border-border/60 px-3.5 py-2 text-foreground/90 whitespace-nowrap">
                    {children}
                  </td>
                );
              },
              tr({ children }) {
                return (
                  <tr className="hover:bg-accent/5 transition-colors">
                    {children}
                  </tr>
                );
              },
              h1({ children }) { return <h1 className="text-base sm:text-lg font-bold text-foreground mt-4 mb-2">{children}</h1>; },
              h2({ children }) { return <h2 className="text-sm sm:text-base font-semibold text-foreground mt-3 mb-1.5">{children}</h2>; },
              h3({ children }) { return <h3 className="text-xs sm:text-sm font-semibold text-foreground mt-2 mb-1">{children}</h3>; },
              ul({ children }) { return <ul className="list-disc list-inside my-2 space-y-1 text-foreground/90 pl-1">{children}</ul>; },
              ol({ children }) { return <ol className="list-decimal list-inside my-2 space-y-1 text-foreground/90 pl-1">{children}</ol>; },
              li({ children }) { return <li className="leading-relaxed">{children}</li>; },
              p({ children }) { return <p className="my-1.5 leading-relaxed">{children}</p>; },
              blockquote({ children }) {
                return (
                  <blockquote className="border-l-3 border-accent pl-3.5 py-0.5 my-2.5 italic text-muted-foreground bg-accent/5 rounded-r-md">
                    {children}
                  </blockquote>
                );
              },
              hr() { return <hr className="border-border my-4" />; },
              strong({ children }) { return <strong className="font-semibold text-foreground">{children}</strong>; },
              em({ children }) { return <em className="italic">{children}</em>; },
            }}
          >
            {cleanText}
          </ReactMarkdown>

          {isStreaming && (
            <div className="flex items-center gap-1.5 text-xs text-accent mt-2 pt-2 border-t border-border/40 font-medium">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span>InsightFlow AI is answering…</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
