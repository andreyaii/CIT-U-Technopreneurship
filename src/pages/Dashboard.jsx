import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  IdCard,
  Users2,
  Hash,
  BookOpen,
  ArrowUpRight,
  TrendingUp,
  Loader2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import {
  getProjectByGroupCode,
  getProjectMembers,
  getStudentRequirements,
  getStudentOverallProgress,
} from "../services/projectService";
import ProgressCard from "../components/ProgressCard";
import RequirementTracker from "../components/RequirementTracker";
import CourseDeliverables from "../components/CourseDeliverables";
import StatusPill from "../components/StatusPill";

// A small, reusable "fact" tile for the student info card
function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-lg bg-surface-muted flex items-center justify-center shrink-0">
        <Icon className="w-4 h-4 text-brand-black/60" strokeWidth={2.25} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-brand-black/45">{label}</p>
        <p className="text-sm font-semibold text-brand-black truncate">{value}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  // IMPORTANT: everything on this page is scoped to `student.studentNo`
  // from AuthContext — never to a URL param or a globally-selected project.
  const { student } = useAuth();

  const [project, setProject] = useState(null);
  const [memberCount, setMemberCount] = useState(0);
  const [requirements, setRequirements] = useState([]);
  const [overallProgress, setOverallProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!student) return;

    let isCurrent = true; // guards against setting state after unmount

    async function loadDashboardData() {
      setIsLoading(true);
      const [projectData, members, reqs, progress] = await Promise.all([
        getProjectByGroupCode(student.groupCode),
        getProjectMembers(student.groupCode),
        getStudentRequirements(student.studentNo),
        getStudentOverallProgress(student.studentNo),
      ]);

      if (!isCurrent) return;
      setProject(projectData);
      setMemberCount(members.length);
      setRequirements(reqs);
      setOverallProgress(progress);
      setIsLoading(false);
    }

    loadDashboardData();
    return () => {
      isCurrent = false;
    };
  }, [student]);

  if (!student) return null;

  const firstName = student.name.split(",")[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-display font-bold">
          Welcome, {firstName}
        </h1>
        <p className="mt-1 text-sm text-brand-black/55">
          Here's where your Technopreneurship project stands right now.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-brand-black/40 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading your dashboard...</span>
        </div>
      ) : (
        <>
          {/* Student information */}
          <section className="rounded-2xl border border-surface-border bg-white p-6 shadow-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-black/45 mb-5">
              Student Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <InfoTile icon={IdCard} label="Full Name" value={student.name} />
              <InfoTile icon={Hash} label="Student Number" value={student.studentNo} />
              <InfoTile icon={BookOpen} label="Section" value={student.section} />
              <InfoTile icon={Users2} label="Group Code" value={student.groupCode} />
            </div>
          </section>

          {/* My project + overall progress */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div className="lg:col-span-2 rounded-2xl border border-surface-border bg-white p-6 shadow-card flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold uppercase tracking-wide text-brand-black/45">
                  My Technopreneurship Project
                </h2>
                {project && <StatusPill status={project.status} size="sm" />}
              </div>

              {project ? (
                <>
                  <h3 className="text-xl font-display font-bold">{project.title}</h3>
                  <p className="mt-2 text-sm text-brand-black/60 leading-relaxed">
                    {project.description}
                  </p>

                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-brand-black/60">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1 font-mono">
                      <Hash className="w-3 h-3" />
                      {student.groupCode}
                    </span>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-muted px-2.5 py-1">
                      <Users2 className="w-3 h-3" />
                      {memberCount} members
                    </span>
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      to={`/projects/${student.groupCode}`}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand-black hover:gap-2.5 transition-all"
                    >
                      View full project details
                      <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-brand-black/50">
                  No project has been assigned to your group yet.
                </p>
              )}
            </div>

            <ProgressCard
              label="My Overall Progress"
              value={overallProgress}
              icon={TrendingUp}
              hint="Average across your 4 requirements"
            />
          </section>

          {/* Course Deliverables spreadsheet converter card */}
          <section>
            <CourseDeliverables />
          </section>

          {/* Requirement tracker - private to this student */}
          <section>
            <RequirementTracker
              requirements={requirements}
              title="My Requirement Tracker"
            />
          </section>
        </>
      )}
    </div>
  );
}
