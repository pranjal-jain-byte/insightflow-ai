import { useState } from "react";
import { Plus, Search } from "lucide-react";
import { useConversationsStore } from "@/store/conversations";
import { createConversation, deleteConversation } from "@/api/conversations";
import { ConversationItem } from "./ConversationItem";
import { AppLogo } from "@/components/Brand/AppLogo";
import { DataHubBadge } from "@/components/Brand/DataHubBadge";
import { ThemeSwitcher } from "@/components/Brand/ThemeSwitcher";

export function Sidebar() {
  const {
    conversations,
    activeId,
    engines,
    setActiveId,
    addConversation,
    removeConversation,
  } = useConversationsStore();

  const [filter, setFilter] = useState("");

  const defaultEngine = engines[0]?.name ?? "";

  const handleNew = async () => {
    const conv = await createConversation(defaultEngine);
    addConversation(conv);
    setActiveId(conv.id);
    setFilter("");
  };

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    removeConversation(id);
  };

  const normalizedFilter = filter.trim().toLowerCase();
  const visibleConversations = normalizedFilter
    ? conversations.filter((c) =>
        c.title.toLowerCase().includes(normalizedFilter)
      )
    : conversations;

  return (
    <aside className="w-64 flex flex-col border-r border-border h-full bg-surface">
      {/* Brand header */}
      <div className="flex items-center justify-between px-3.5 py-3.5 border-b border-border">
        <button
          onClick={() => setActiveId(null)}
          className="hover:opacity-85 transition-opacity text-left"
          title="InsightFlow AI Home"
        >
          <AppLogo />
        </button>
        <button
          onClick={handleNew}
          className="p-1.5 rounded-lg text-muted-foreground hover:text-accent hover:bg-accent/10 border border-transparent hover:border-accent/20 transition-all"
          title="New conversation"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Filter */}
      <div className="px-3 py-2.5 border-b border-border/60">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground/60 pointer-events-none" />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filter conversations…"
            className="w-full pl-8 pr-2.5 py-1.5 text-xs bg-muted/40 border border-border/80 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent placeholder:text-muted-foreground/50 transition-all"
          />
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {conversations.length === 0 ? (
          <div className="text-center py-8 px-3 space-y-1">
            <p className="text-xs font-medium text-foreground">No conversations yet</p>
            <p className="text-[11px] text-muted-foreground">Start by asking a question about your business data.</p>
          </div>
        ) : visibleConversations.length === 0 ? (
          <p className="text-xs text-muted-foreground px-2 py-6 text-center">
            No matching conversations
          </p>
        ) : (
          visibleConversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={conv.id === activeId}
              onSelect={() => setActiveId(conv.id)}
              onDelete={() => handleDelete(conv.id)}
            />
          ))
        )}
      </div>

      {/* Footer: theme switcher + attribution badge */}
      <div className="px-3 py-3 border-t border-border flex items-center justify-between bg-muted/20">
        <DataHubBadge />
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
