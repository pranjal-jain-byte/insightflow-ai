import { useState, useRef, type KeyboardEvent, type ChangeEvent } from "react";
import { Send, Square } from "lucide-react";

interface Props {
  onSend: (text: string) => void;
  onStop?: () => void;
  disabled: boolean;
  isStreaming?: boolean;
}

const SLASH_COMMANDS = [
  {
    command: "/improve-context",
    description: "Analyze this conversation and propose documentation improvements",
  },
];

export function MessageInput({ onSend, onStop, disabled, isStreaming }: Props) {
  const [text, setText] = useState("");
  const [showCommands, setShowCommands] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || disabled) return;
    setShowCommands(false);
    onSend(trimmed);
    setText("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
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

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setText(val);
    setShowCommands(val.startsWith("/") && !val.includes(" "));
  };

  const filteredCommands = SLASH_COMMANDS.filter((c) =>
    c.command.startsWith(text.toLowerCase())
  );

  return (
    <div className="border-t border-border bg-background/95 backdrop-blur-sm px-4 sm:px-6 md:px-8 py-3.5 flex-shrink-0" data-print-hide>
      <div className="max-w-4xl mx-auto w-full">
        {showCommands && filteredCommands.length > 0 && (
          <div className="mb-2 rounded-xl border border-border bg-surface shadow-lg overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-150">
            {filteredCommands.map((cmd) => (
              <button
                key={cmd.command}
                type="button"
                onClick={() => {
                  setText(cmd.command);
                  setShowCommands(false);
                  textareaRef.current?.focus();
                }}
                className="w-full flex items-baseline gap-2.5 px-3.5 py-2 text-left hover:bg-muted transition-colors cursor-pointer"
              >
                <span className="text-sm font-mono font-semibold text-primary">{cmd.command}</span>
                <span className="text-xs text-muted-foreground">{cmd.description}</span>
              </button>
            ))}
          </div>
        )}

        <div className="flex items-end gap-2.5 bg-surface border border-border shadow-xs focus-within:shadow-md focus-within:border-accent/60 focus-within:ring-2 focus-within:ring-accent/10 rounded-2xl px-4 py-3 transition-all">
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onInput={handleInput}
            placeholder={
              isStreaming
                ? "InsightFlow AI is generating insights…"
                : "Ask about your data…"
            }
            disabled={disabled}
            rows={1}
            className="flex-1 bg-transparent resize-none outline-none text-sm text-foreground placeholder:text-muted-foreground/60 disabled:opacity-50 max-h-40 leading-relaxed font-normal"
          />
          {isStreaming && onStop ? (
            <button
              onClick={onStop}
              title="Stop generating"
              className="flex-shrink-0 p-2 rounded-xl text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors cursor-pointer"
            >
              <Square className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={disabled || !text.trim()}
              className="flex-shrink-0 p-2 rounded-xl bg-accent text-accent-foreground hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-xs cursor-pointer"
              title="Send message"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
