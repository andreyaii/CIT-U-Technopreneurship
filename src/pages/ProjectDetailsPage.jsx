import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Loader2, SearchX } from "lucide-react";
import {
  getProjectByGroupCode,
  getProjectMembers,
  getProjectRequirementsOverview,
  getProjectOverallProgress,
} from "../services/projectService";
import ProjectDetails from "../components/ProjectDetails";

export default function ProjectDetailsPage() {
  const { groupCode } = useParams();

  const [project, setProject] = useState(null);
  const [members, setMembers] = useState([]);
  const [requirementsOverview, setRequirementsOverview] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let isCurrent = true;

    async function loadDetails() {
      setIsLoading(true);
      setNotFound(false);

      const projectData = await getProjectByGroupCode(groupCode);
      if (!projectData) {
        if (isCurrent) {
          setNotFound(true);
          setIsLoading(false);
        }
        return;
      }

      const [memberList, overview, progress] = await Promise.all([
        getProjectMembers(groupCode),
        getProjectRequirementsOverview(groupCode),
        getProjectOverallProgress(groupCode),
      ]);

      if (!isCurrent) return;
      setProject({ ...projectData, progress });
      setMembers(memberList);
      setRequirementsOverview(overview);
      setIsLoading(false);
    }

    loadDetails();
    return () => {
      isCurrent = false;
    };
  }, [groupCode]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
      <Link
        to="/projects"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-black/60 hover:text-brand-black transition-colors w-fit"
      >
        <ArrowLeft className="w-4 h-4" strokeWidth={2.25} />
        Back to All Projects
      </Link>

      {isLoading ? (
        <div className="flex items-center justify-center py-24 text-brand-black/40 gap-2">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading project details...</span>
        </div>
      ) : notFound ? (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-3">
          <div className="w-12 h-12 rounded-full bg-surface-muted flex items-center justify-center">
            <SearchX className="w-5 h-5 text-brand-black/40" />
          </div>
          <p className="text-sm text-brand-black/50">
            No project found for group code &ldquo;{groupCode}&rdquo;.
          </p>
        </div>
      ) : (
        <ProjectDetails
          project={project}
          members={members}
          requirementsOverview={requirementsOverview}
        />
      )}
    </div>
  );
}
