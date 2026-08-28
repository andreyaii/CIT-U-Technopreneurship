import { useState } from "react";
import {
  BookOpen,
  FileText,
  HelpCircle,
  Presentation,
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  Calendar,
  Layers,
  Sparkles,
} from "lucide-react";
import { mockDeliverables } from "../data/mockDeliverables";

/**
 * Returns an appropriate icon based on deliverable type
 */
function getDeliverableIcon(type) {
  switch (type) {
    case "quiz":
      return HelpCircle;
    case "pitch":
      return Sparkles;
    case "presentation":
      return Presentation;
    case "report":
      return Layers;
    case "document":
    default:
      return FileText;
  }
}

/**
 * Visual pill badge for deliverable status
 * - Completed / Submitted / Graded: Green badge with checkmark
 * - Missing: Red badge with X
 * - Pending: Amber / Soft Red badge
 */
function StatusBadge({ status }) {
  const normalized = (status || "").toLowerCase();

  if (["submitted", "graded", "completed"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
        <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" strokeWidth={2.5} />
        {status}
      </span>
    );
  }

  if (["missing", "overdue"].includes(normalized)) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <XCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" strokeWidth={2.5} />
        {status}
      </span>
    );
  }

  // Pending / Not Started fallback
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
      <AlertCircle className="w-3.5 h-3.5 shrink-0 text-amber-600" strokeWidth={2.5} />
      {status || "Pending"}
    </span>
  );
}

/**
 * CourseDeliverables Component
 *
 * A modern card widget for student dashboards that converts spreadsheet
 * tracking rows into an interactive, cleanly styled table with internal scroll.
 *
 * @param {Object} props
 * @param {Array} [props.deliverables] - Optional array of deliverable objects.
 * @param {string} [props.title] - Optional custom title (defaults to "Course Deliverables").
 * @param {string} [props.className] - Optional container CSS class overrides.
 */
export default function CourseDeliverables({
  deliverables = mockDeliverables,
  title = "Course Deliverables",
  className = "",
}) {
  const [activeFilter, setActiveFilter] = useState("all");

  const completedCount = deliverables.filter(
    (d) => d.isSubmitted || ["submitted", "graded", "completed"].includes((d.status || "").toLowerCase())
  ).length;

  const missingCount = deliverables.filter(
    (d) => ["missing", "overdue"].includes((d.status || "").toLowerCase())
  ).length;

  const filteredDeliverables = deliverables.filter((item) => {
    const isDone = item.isSubmitted || ["submitted", "graded", "completed"].includes((item.status || "").toLowerCase());
    const isMissing = ["missing", "overdue"].includes((item.status || "").toLowerCase());

    if (activeFilter === "completed") return isDone;
    if (activeFilter === "missing") return isMissing;
    if (activeFilter === "pending") return !isDone && !isMissing;
    return true;
  });

  return (
    <div
      className={`rounded-2xl border border-surface-border bg-white shadow-card overflow-hidden flex flex-col ${className}`}
    >
      {/* Card Header */}
      <div className="p-5 sm:p-6 border-b border-surface-border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-brand-yellow-soft flex items-center justify-center shrink-0 border border-brand-yellow/30 shadow-sm">
            <BookOpen className="w-5 h-5 text-brand-black" strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2.5">
              <h3 className="text-lg font-display font-bold text-brand-black">
                {title}
              </h3>
              <span className="inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-md bg-surface-muted text-brand-black/60 border border-surface-border">
                {deliverables.length} Total
              </span>
            </div>
            <p className="text-xs text-brand-black/50 mt-0.5">
              Track your assignments, quizzes, and project milestones
            </p>
          </div>
        </div>

        {/* Quick Summary Pill & Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setActiveFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === "all"
                ? "bg-brand-black text-white shadow-sm"
                : "bg-surface-muted text-brand-black/60 hover:text-brand-black hover:bg-surface-border/50"
            }`}
          >
            All ({deliverables.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeFilter === "completed"
                ? "bg-emerald-700 text-white shadow-sm"
                : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200/60"
            }`}
          >
            Done ({completedCount})
          </button>
          {missingCount > 0 && (
            <button
              type="button"
              onClick={() => setActiveFilter("missing")}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeFilter === "missing"
                  ? "bg-rose-700 text-white shadow-sm"
                  : "bg-rose-50 text-rose-700 hover:bg-rose-100/80 border border-rose-200/60"
              }`}
            >
              Missing ({missingCount})
            </button>
          )}
        </div>
      </div>

      {/* Internal Scroll Container for Table/List */}
      <div className="overflow-x-auto overflow-y-auto max-h-[420px] scrollbar-thin">
        <table className="w-full text-left border-collapse min-w-[620px]">
          {/* Sticky Header */}
          <thead className="sticky top-0 z-10 bg-surface-muted/95 backdrop-blur border-b border-surface-border text-[11px] font-bold uppercase tracking-wider text-brand-black/50">
            <tr>
              <th scope="col" className="py-3 px-5 sm:px-6">
                Deliverable
              </th>
              <th scope="col" className="py-3 px-4 w-36">
                Status
              </th>
              <th scope="col" className="py-3 px-5 sm:px-6 w-48 text-right sm:text-left">
                Submitted Date
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-surface-border text-sm">
            {filteredDeliverables.length > 0 ? (
              filteredDeliverables.map((item) => {
                const IconComponent = getDeliverableIcon(item.type);
                const isCompleted =
                  item.isSubmitted ||
                  ["submitted", "graded", "completed"].includes(
                    (item.status || "").toLowerCase()
                  );

                return (
                  <tr
                    key={item.id}
                    className="hover:bg-surface-muted/60 transition-colors group"
                  >
                    {/* Deliverable Column */}
                    <td className="py-4 px-5 sm:px-6">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 rounded-lg bg-surface-muted border border-surface-border flex items-center justify-center shrink-0 mt-0.5 group-hover:border-brand-black/20 group-hover:bg-white transition-all shadow-2xs">
                          <IconComponent
                            className="w-4 h-4 text-brand-black/70 group-hover:text-brand-black transition-colors"
                            strokeWidth={2.2}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-brand-black text-sm sm:text-base leading-snug group-hover:text-brand-black">
                            {item.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="inline-flex items-center gap-1 text-xs text-brand-black/55 font-medium">
                              <Calendar className="w-3 h-3 text-brand-black/40" />
                              Due {item.dueDate}
                            </span>
                            {item.category && (
                              <>
                                <span className="text-brand-black/25">•</span>
                                <span className="text-[11px] font-medium text-brand-black/50 bg-surface-muted px-1.5 py-0.5 rounded border border-surface-border">
                                  {item.category}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Status Column */}
                    <td className="py-4 px-4 align-middle">
                      <StatusBadge status={item.status} />
                    </td>

                    {/* Submitted Date Column */}
                    <td className="py-4 px-5 sm:px-6 align-middle text-right sm:text-left">
                      {isCompleted ? (
                        <div className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-brand-black">
                          <Clock
                            className="w-3.5 h-3.5 text-emerald-600 shrink-0"
                            strokeWidth={2.2}
                          />
                          <span>{item.submittedDate || "Submitted"}</span>
                        </div>
                      ) : (
                        <span className="italic text-rose-500/80 text-xs sm:text-sm font-normal">
                          Not yet submitted
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={3}
                  className="py-12 text-center text-sm text-brand-black/40"
                >
                  No deliverables match the selected filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Card Footer / Progress Bar Summary */}
      <div className="px-5 sm:px-6 py-3.5 bg-surface-muted/40 border-t border-surface-border flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-brand-black/60">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-brand-black">
            {completedCount} of {deliverables.length}
          </span>
          <span>deliverables completed</span>
        </div>
        <div className="w-full sm:w-48 bg-surface-border h-2 rounded-full overflow-hidden">
          <div
            className="bg-brand-black h-full rounded-full transition-all duration-500"
            style={{
              width: `${
                deliverables.length
                  ? Math.round((completedCount / deliverables.length) * 100)
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}
