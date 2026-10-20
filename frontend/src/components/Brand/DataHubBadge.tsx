import { GitFork } from "lucide-react";

/** Open-source upstream attribution badge linking to DataHub Analytics Agent repo. */
export function DataHubBadge() {
  return (
    <a
      href="https://github.com/datahub-project/analytics-agent"
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-1.5 text-muted-foreground/60 hover:text-muted-foreground transition-colors group"
      title="Built on open-source DataHub Analytics Agent"
    >
      <GitFork className="w-3.5 h-3.5 text-muted-foreground/60 group-hover:text-accent transition-colors" />
      <span className="text-[11px] font-medium tracking-tight">
        Core: DataHub Agent
      </span>
    </a>
  );
}
