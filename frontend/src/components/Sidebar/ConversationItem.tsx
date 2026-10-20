import { Trash2, MessageSquare } from "lucide-react";
import type { ConversationSummary } from "@/types";

interface Props {
  conversation: ConversationSummary;
  isActive: boolean;
  onSelect: () => void;
  onDelete: () => void;
}

export function ConversationItem({ conversation, isActive, onSelect, onDelete }: Props) {
  return (
    <div
      className={`group flex items-center gap-2.5 px-3 py-2.5 rounded-xl cursor-pointer transition-all ${
        isActive
          ? "bg-accent/10 text-foreground font-medium shadow-xs border border-accent/20"
          : "hover:bg-muted/60 text-muted-foreground hover:text-foreground"
      }`}
      data-testid="conversation-item"
      data-conv-id={conversation.id}
      onClick={onSelect}
    >
      <MessageSquare
        className={`w-3.5 h-3.5 flex-shrink-0 ${
          isActive ? "text-accent" : "text-muted-foreground/60 group-hover:text-foreground"
        }`}
      />
      <div className="flex-1 min-w-0">
        <p className="text-xs truncate font-medium">{conversation.title}</p>
        <p className="text-[10px] text-muted-foreground/70 truncate">{conversation.engine_name}</p>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        title="Delete conversation"
        className="opacity-0 group-hover:opacity-100 p-1 rounded-md text-muted-foreground/60 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all"
      >
        <Trash2 className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
