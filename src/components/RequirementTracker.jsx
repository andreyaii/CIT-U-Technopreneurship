import RequirementItem from "./RequirementItem";
import { ListChecks } from "lucide-react";

/**
 * RequirementTracker
 * Renders the four Technopreneurship deliverables as a connected,
 * ordered pipeline (ReqInventory -> SRS -> SDD -> SPMP) since that
 * order is a real SDLC sequence, not an arbitrary list.
 *
 * `requirements` should be an array shaped like:
 *   { key, label, status, progress, dueDate }
 */
export default function RequirementTracker({ requirements = [], title = "Requirement Tracker" }) {
  if (!requirements.length) {
    return (
      <div className="rounded-2xl border border-surface-border bg-white p-6 text-sm text-brand-black/50">
        No requirement data available yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-surface-border bg-white p-5 sm:p-6 shadow-card">
      <div className="flex items-center gap-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-brand-yellow-soft flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-brand-black" strokeWidth={2.5} />
        </div>
        <h3 className="text-base font-semibold">{title}</h3>
      </div>

      <ol>
        {requirements.map((req, i) => (
          <RequirementItem
            key={req.key || req.requirement || i}
            requirement={req}
            step={i + 1}
            isLast={i === requirements.length - 1}
          />
        ))}
      </ol>
    </div>
  );
}
