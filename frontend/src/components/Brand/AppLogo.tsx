import { useDisplayStore } from "@/store/display";
import { InsightFlowIcon } from "./InsightFlowIcon";

export function AppLogo() {
  const { appName, logoUrl } = useDisplayStore();
  const title = appName || "InsightFlow AI";

  return (
    <div className="flex items-center gap-2.5 select-none">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt="Logo"
          className="w-5 h-5 object-contain flex-shrink-0"
          onError={(e) => ((e.target as HTMLImageElement).style.display = "none")}
        />
      ) : (
        <InsightFlowIcon size={24} className="flex-shrink-0" />
      )}
      <div className="flex items-center gap-1.5">
        <span
          className="text-base font-semibold tracking-tight text-foreground"
          style={{ letterSpacing: "-0.025em" }}
        >
          {title === "InsightFlow AI" ? (
            <>
              Insight<span className="text-accent font-bold">Flow</span>
            </>
          ) : (
            title
          )}
        </span>
        {title === "InsightFlow AI" && (
          <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-primary text-primary-foreground tracking-wider uppercase">
            AI
          </span>
        )}
      </div>
    </div>
  );
}
