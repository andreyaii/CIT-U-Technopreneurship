import { CheckCircle2, Clock, Circle } from "lucide-react";

/**
 * StatusPill
 * Consistent status badge used across cards, tracker rows, and details.
 * Deliberately uses icon + text (not color alone) so meaning doesn't
 * depend on distinguishing yellow from gray.
 */
const CONFIG = {
  "Not Started": {
    icon: Circle,
    classes: "bg-white text-brand-black/60 border border-surface-border",
  },
  "In Progress": {
    icon: Clock,
    classes: "bg-brand-yellow text-brand-black border border-brand-yellow-dark",
  },
  Completed: {
    icon: CheckCircle2,
    classes: "bg-brand-black text-white border border-brand-black",
  },
};

export default function StatusPill({ status, size = "md" }) {
  const config = CONFIG[status] || CONFIG["Not Started"];
  const Icon = config.icon;
  const sizeClasses = size === "sm" ? "text-[11px] px-2 py-0.5 gap-1" : "text-xs px-2.5 py-1 gap-1.5";

  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold whitespace-nowrap ${sizeClasses} ${config.classes}`}
    >
      <Icon className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} strokeWidth={2.5} />
      {status}
    </span>
  );
}
