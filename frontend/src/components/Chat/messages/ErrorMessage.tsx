import { AlertCircle } from "lucide-react";

interface Props {
  payload: { error: string };
}

export function ErrorMessage({ payload }: Props) {
  return (
    <div className="max-w-[90%] flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-700 dark:text-red-400 text-xs shadow-xs">
      <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0 text-red-600 dark:text-red-400" />
      <div className="space-y-0.5">
        <p className="font-semibold text-red-800 dark:text-red-300">Execution Error</p>
        <p className="font-mono leading-relaxed whitespace-pre-wrap">{payload.error}</p>
      </div>
    </div>
  );
}
