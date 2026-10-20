import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { Send, Database, Sparkles, Table2, TrendingUp, BarChart3, ChevronRight, Info } from "lucide-react";
import { useConversationsStore } from "@/store/conversations";
import { useDisplayStore, GREETING_TTL_MS } from "@/store/display";
import { InsightFlowIcon } from "@/components/Brand/InsightFlowIcon";

const NO_ENGINE_PROMPTS = [
  {
    text: "Show me the available tables and explain their schemas.",
    icon: Table2,
    description: "Database exploration & schema overview",
  },
  {
    text: "Analyze monthly revenue and identify the top-performing products.",
    icon: TrendingUp,
    description: "Financial performance & product rankings",
  },
  {
    text: "Compare business performance across categories.",
    icon: BarChart3,
    description: "Cross-segment breakdown & trends",
  },
];

async function fetchDataHubUser(): Promise<string> {
  try {
    const res = await fetch("/api/me");
    if (!res.ok) return "";
    const data = await res.json();
    return data.display_name || data.username || "";
  } catch {
    return "";
  }
}

function getTimeOfDay(): string {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

let _greetingFetchInFlight = false;

async function fetchLlmGreeting(name: string): Promise<string> {
  try {
    const params = new URLSearchParams({ name, time_of_day: getTimeOfDay() });
    const res = await fetch(`/api/greeting?${params}`);
    if (!res.ok) return "";
    const data = await res.json();
    return data.greeting || "";
  } catch {
    return "";
  }
}

interface Props {
  onSend: (text: string, engineName: string) => void;
  onOpenSettings?: (section?: "connections" | "model" | "prompt" | "display" | "about") => void;
}

export function WelcomeView({ onSend, onOpenSettings }: Props) {
  const { engines } = useConversationsStore();
  const { logoUrl } = useDisplayStore();
  const [text, setText] = useState("");
  const [engine, setEngine] = useState(engines[0]?.name ?? "");
  const [guidePrompt, setGuidePrompt] = useState<string | null>(null);
  const {
    greeting: cachedGreeting,
    greetingGeneratedAt,
    setGreeting: storeGreeting,
  } = useDisplayStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const hasEngine = engines.length > 0;

  useEffect(() => {
    if (!engine && engines.length > 0) setEngine(engines[0].name);
  }, [engines]);

  useEffect(() => {
    const stale = Date.now() - greetingGeneratedAt > GREETING_TTL_MS;
    if ((cachedGreeting && !stale) || _greetingFetchInFlight) return;
    _greetingFetchInFlight = true;
    fetchDataHubUser().then((name) => {
      fetchLlmGreeting(name).then((g) => {
        storeGreeting(g, name);
        _greetingFetchInFlight = false;
      });
    });
  }, []);

  const handleSend = (textToSend?: string) => {
    const targetText = (textToSend ?? text).trim();
    if (!targetText) return;
    setGuidePrompt(null);
    onSend(targetText, engine);
    setText("");
  };

  const handleSelectPrompt = (promptText: string) => {
    setText(promptText);
    if (!hasEngine) {
      setGuidePrompt(promptText);
    } else {
      handleSend(promptText);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = () => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center gap-7">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-3.5 text-center select-none max-w-xl">
          {logoUrl ? (
            <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
          ) : (
            <div className="p-3 rounded-2xl bg-surface border border-border shadow-xs">
              <InsightFlowIcon size={46} />
            </div>
          )}

          {/* Status Indicator */}
          {!hasEngine ? (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-medium border border-amber-500/25">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span>No data source connected</span>
            </div>
          ) : (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-medium border border-emerald-500/25">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span>Data source ready ({engine || engines[0]?.name})</span>
            </div>
          )}

          <div className="space-y-2.5">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              Turn business questions into actionable insights.
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed max-w-lg mx-auto">
              Explore your business data using natural language. Connect a database to start querying tables, analyzing trends, and generating visualizations.
            </p>
          </div>

          {/* Connect Data Source CTA Button when no engine */}
          {!hasEngine && onOpenSettings && (
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onOpenSettings("connections")}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-primary-foreground font-medium text-xs sm:text-sm hover:opacity-90 transition-all shadow-xs"
              >
                <Database className="w-4 h-4" />
                <span>Connect Data Source</span>
                <ChevronRight className="w-3.5 h-3.5 opacity-80" />
              </button>
            </div>
          )}

          {cachedGreeting && hasEngine && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
              <Sparkles className="w-3 h-3" />
              <span>{cachedGreeting}</span>
            </div>
          )}
        </div>

        {/* Guidance Banner when user selects a suggested prompt without a connected engine */}
        {guidePrompt && !hasEngine && (
          <div className="w-full rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs space-y-2.5 text-foreground animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-start gap-2.5">
              <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold text-amber-900 dark:text-amber-300">
                  Data source needed for live queries
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  To execute <span className="font-mono text-foreground font-medium">"{guidePrompt}"</span> against your tables, please connect a database (e.g. Snowflake, BigQuery, PostgreSQL, MySQL, DuckDB) via Settings → Connections.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 pt-1 pl-6">
              {onOpenSettings && (
                <button
                  type="button"
                  onClick={() => onOpenSettings("connections")}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity"
                >
                  Connect Data Source
                </button>
              )}
              <button
                type="button"
                onClick={() => handleSend(guidePrompt)}
                className="px-3 py-1.5 rounded-lg bg-surface border border-border text-foreground hover:bg-muted transition-colors"
              >
                Ask Copilot Anyway
              </button>
            </div>
          </div>
        )}

        {/* Input card */}
        <div className="w-full">
          <div className="rounded-2xl border border-border bg-surface shadow-xs focus-within:shadow-md focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
            {/* Textarea */}
            <div className="px-4 pt-3.5 pb-2">
              <textarea
                ref={textareaRef}
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (guidePrompt) setGuidePrompt(null);
                }}
                onKeyDown={handleKeyDown}
                onInput={handleInput}
                placeholder={hasEngine ? "Ask questions about your business data…" : "Say hello or ask general questions (connect a data source for live queries)…"}
                rows={1}
                className="w-full bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 max-h-40 leading-relaxed font-normal"
              />
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between px-3.5 pb-3 pt-1 border-t border-border/40">
              {/* Engine selector / status */}
              {hasEngine ? (
                <div className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-muted-foreground" />
                  <select
                    value={engine}
                    onChange={(e) => setEngine(e.target.value)}
                    className="text-xs bg-muted/60 border border-border rounded-md px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    {engines.map((e) => (
                      <option key={e.name} value={e.name}>{e.name}</option>
                    ))}
                  </select>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => onOpenSettings?.("connections")}
                  className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 hover:underline"
                >
                  <Database className="w-3.5 h-3.5" />
                  <span>Connect a database</span>
                </button>
              )}

              {/* Send */}
              <button
                type="button"
                onClick={() => handleSend()}
                disabled={!text.trim()}
                className="p-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90
                           disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs"
                title="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Suggested Questions */}
          <div className="mt-6 space-y-2.5">
            <div className="flex items-center justify-between px-1">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Suggested Prompts
              </span>
              <span className="text-[11px] text-muted-foreground/70">
                Click any prompt to start
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              {NO_ENGINE_PROMPTS.map((p) => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.text}
                    type="button"
                    onClick={() => handleSelectPrompt(p.text)}
                    className="group flex items-start gap-3 p-3 rounded-xl border border-border bg-surface
                               hover:bg-muted/50 hover:border-accent/40 text-foreground
                               transition-all text-left shadow-xs hover:shadow-sm"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors flex-shrink-0 mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5 flex-1 min-w-0">
                      <p className="text-xs font-medium text-foreground group-hover:text-foreground">
                        {p.text}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {p.description}
                      </p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1" />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
