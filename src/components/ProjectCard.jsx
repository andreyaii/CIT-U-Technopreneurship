import { useNavigate } from "react-router-dom";
import { Users, Hash, ArrowUpRight } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StatusPill from "./StatusPill";

/**
 * ProjectCard
 * Public-facing summary of a project for the "View All Projects" grid.
 * Deliberately shows ONLY team-level info — no individual student data.
 */
export default function ProjectCard({ project }) {
  const navigate = useNavigate();
  const { groupCode, title, description, memberCount, progress, status } = project;

  return (
    <button
      onClick={() => navigate(`/projects/${groupCode}`)}
      className="group text-left w-full rounded-2xl border border-surface-border bg-white p-5 shadow-card hover:shadow-card-hover hover:border-brand-black/20 transition-all duration-200 flex flex-col gap-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-display font-semibold text-brand-black truncate">
            {title}
          </h3>
          <p className="mt-1 text-sm text-brand-black/60 line-clamp-2">
            {description}
          </p>
        </div>
        <span className="shrink-0 w-8 h-8 rounded-full bg-surface-muted flex items-center justify-center group-hover:bg-brand-yellow transition-colors">
          <ArrowUpRight className="w-4 h-4 text-brand-black" strokeWidth={2.5} />
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-xs text-brand-black/60">
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1 font-mono">
          <Hash className="w-3 h-3" />
          {groupCode}
        </span>
        <span className="inline-flex items-center gap-1 rounded-full bg-surface-muted px-2.5 py-1">
          <Users className="w-3 h-3" />
          {memberCount} members
        </span>
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-medium text-brand-black/50">Overall progress</span>
          <span className="text-xs font-semibold text-brand-black">{progress}%</span>
        </div>
        <ProgressBar value={progress} size="sm" />
      </div>

      <div className="pt-1">
        <StatusPill status={status} size="sm" />
      </div>
    </button>
  );
}
