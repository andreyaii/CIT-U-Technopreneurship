import { CheckCircle2, Clock, Circle } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StatusPill from "./StatusPill";

const NODE_ICON = {
  "Not Started": Circle,
  "In Progress": Clock,
  Completed: CheckCircle2,
};

const NODE_STYLE = {
  "Not Started": "bg-white border-2 border-surface-border text-brand-black/40",
  "In Progress": "bg-brand-yellow border-2 border-brand-yellow-dark text-brand-black",
  Completed: "bg-brand-black border-2 border-brand-black text-white",
};

function formatDueDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-PH", { month: "short", day: "numeric", year: "numeric" });
}

/**
 * RequirementItem
 * One row/step of the RequirementTracker stepper. `step` and `isLast`
 * control the connecting rail so the sequence (ReqInventory -> SRS ->
 * SDD -> SPMP) reads as an actual pipeline, not just a list.
 */
export default function RequirementItem({ requirement, step, isLast }) {
  const { label, status, progress, dueDate } = requirement;
  const Icon = NODE_ICON[status] || Circle;

  return (
    <li className="relative flex gap-4 pb-8 last:pb-0">
      {/* connecting rail */}
      {!isLast && (
        <span
          aria-hidden="true"
          className="absolute left-[15px] top-9 bottom-0 w-0.5 bg-surface-border"
        />
      )}

      {/* step node */}
      <div className="relative z-10 flex flex-col items-center shrink-0">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${NODE_STYLE[status] || NODE_STYLE["Not Started"]}`}
        >
          <Icon className="w-4 h-4" strokeWidth={2.5} />
        </div>
      </div>

      {/* content */}
      <div className="flex-1 min-w-0 pt-0.5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-brand-black/40 uppercase">
              Step {step}
            </p>
            <h4 className="text-sm font-semibold text-brand-black leading-snug">
              {label}
            </h4>
          </div>
          <StatusPill status={status} size="sm" />
        </div>

        <div className="mt-3 max-w-sm">
          <ProgressBar value={progress} size="sm" />
        </div>

        {dueDate && (
          <p className="mt-2 text-xs text-brand-black/50">
            Due {formatDueDate(dueDate)}
          </p>
        )}
      </div>
    </li>
  );
}
