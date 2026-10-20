import { useState, useRef, useEffect, useMemo, type KeyboardEvent } from "react";
import { Send, Database, Sparkles, TrendingUp, BarChart3, PieChart, HelpCircle } from "lucide-react";
import { useConversationsStore } from "@/store/conversations";
import { useDisplayStore, GREETING_TTL_MS } from "@/store/display";
import { InsightFlowIcon } from "@/components/Brand/InsightFlowIcon";

const FEATURED_PROMPTS = [
  {
    text: "Which product categories generated the highest revenue?",
    icon: TrendingUp,
  },
  {
    text: "Show monthly revenue trends.",
    icon: BarChart3,
  },
  {
    text: "Compare performance across business segments.",
    icon: PieChart,
  },
  {
    text: "Identify the main factors behind a sales decline.",
    icon: HelpCircle,
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
}

export function WelcomeView({ onSend }: Props) {
  const { engines } = useConversationsStore();
  const { appName, logoUrl } = useDisplayStore();
  const [text, setText] = useState("");
  const [engine, setEngine] = useState(engines[0]?.name ?? "");
  const {
    greeting: cachedGreeting,
    greetingGeneratedAt,
    setGreeting: storeGreeting,
  } = useDisplayStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed, engine);
    setText("");
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

  const resolvedAppName = appName || "InsightFlow AI";

  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-7 px-4 pb-12 pt-6 overflow-y-auto">
      {/* Brand Header */}
      <div className="flex flex-col items-center gap-3.5 text-center select-none max-w-xl">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="w-14 h-14 object-contain" />
        ) : (
          <div className="p-2.5 rounded-2xl bg-surface border border-border shadow-xs">
            <InsightFlowIcon size={44} />
          </div>
        )}

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Welcome to {resolvedAppName}
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground font-normal leading-relaxed max-w-md mx-auto">
            Ask questions about your business data and turn complex information into actionable insights.
          </p>
        </div>

        {cachedGreeting && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 text-accent text-xs font-medium border border-accent/20">
            <Sparkles className="w-3 h-3" />
            <span>{cachedGreeting}</span>
          </div>
        )}
      </div>

      {/* Input card */}
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-border bg-surface shadow-sm focus-within:shadow-md focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 transition-all">
          {/* Textarea */}
          <div className="px-4 pt-3.5 pb-2">
            <textarea
              ref={textareaRef}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              onInput={handleInput}
              placeholder="Ask questions about your business data (e.g. Which product categories generated the highest revenue?)"
              rows={1}
              className="w-full bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 max-h-40 leading-relaxed font-normal"
            />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between px-3.5 pb-3 pt-1 border-t border-border/40">
            {/* Engine selector */}
            {engines.length > 0 ? (
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
              <span className="text-[11px] text-muted-foreground italic">No engine selected</span>
            )}

            {/* Send */}
            <button
              onClick={handleSend}
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
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Suggested questions
            </span>
            <span className="text-[11px] text-muted-foreground/70">
              Click any question to start
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {FEATURED_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.text}
                  type="button"
                  onClick={() => {
                    setText(p.text);
                    textareaRef.current?.focus();
                  }}
                  className="group flex items-start gap-2.5 text-xs p-3 rounded-xl border border-border bg-surface
                             hover:bg-muted/50 hover:border-accent/40 text-foreground
                             transition-all text-left shadow-xs hover:shadow-sm"
                >
                  <div className="p-1.5 rounded-lg bg-accent/10 text-accent group-hover:bg-accent group-hover:text-accent-foreground transition-colors flex-shrink-0 mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="leading-snug font-medium text-foreground/90 group-hover:text-foreground">
                    {p.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
