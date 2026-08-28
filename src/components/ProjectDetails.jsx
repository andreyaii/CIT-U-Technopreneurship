import { Hash, Users, TrendingUp } from "lucide-react";
import ProgressCard from "./ProgressCard";
import RequirementTracker from "./RequirementTracker";
import StatusPill from "./StatusPill";

/**
 * ProjectDetails
 * Full public details body for a single project: header info, member
 * roster, and a TEAM-LEVEL requirement tracker (averaged across members —
 * never any one student's private status).
 */
export default function ProjectDetails({ project, members, requirementsOverview }) {
  const { title, description, groupCode, status, progress } = project;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="rounded-2xl border border-surface-border bg-white p-6 sm:p-8 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 text-xs font-mono text-brand-black/60">
                <Hash className="w-3 h-3" />
                {groupCode}
              </span>
              <StatusPill status={status} size="sm" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold">{title}</h1>
            <p className="mt-2 text-sm sm:text-base text-brand-black/60 max-w-2xl">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <ProgressCard label="Overall Project Progress" value={progress} icon={TrendingUp} />
        <div className="rounded-2xl border border-surface-border bg-white p-5 shadow-card flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-brand-black/45">
              Project Members
            </span>
            <div className="w-8 h-8 rounded-lg bg-brand-yellow-soft flex items-center justify-center">
              <Users className="w-4 h-4 text-brand-black" strokeWidth={2.5} />
            </div>
          </div>
          <span className="text-4xl font-display font-bold leading-none">
            {members.length}
          </span>
          <ul className="flex flex-col divide-y divide-surface-border -mx-1">
            {members.map((m) => (
              <li key={m.studentNo} className="flex items-center justify-between px-1 py-2 text-sm">
                <span className="font-medium text-brand-black/80 truncate">{m.name}</span>
                <span className="text-xs text-brand-black/40 font-mono shrink-0 ml-3">
                  {m.studentNo}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Team-level requirement tracker */}
      <RequirementTracker
        requirements={requirementsOverview}
        title="Team Requirement Tracker"
      />
    </div>
  );
}
