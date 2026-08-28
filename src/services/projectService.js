/**
 * projectService.js
 * ------------------------------------------------------------------
 * Data-access layer. Pages and components ONLY talk to this file —
 * never to src/data/mockData.js directly.
 *
 * Today every function reads from mockData.js. Later, each function
 * body can be swapped to call a Google Apps Script Web App endpoint
 * (e.g. fetch(`${API_URL}?action=getStudentByStudentNo&studentNo=...`))
 * without changing a single import in the React components.
 *
 *   React UI  ->  projectService.js  ->  [mockData.js today | Apps Script later]  ->  Google Sheet
 *
 * All functions are written as async (return Promises) even though the
 * mock versions resolve instantly — this keeps the calling code identical
 * once real network calls are introduced.
 * ------------------------------------------------------------------
 */

import {
  students,
  projects,
  studentRequirements,
  requirementDefs,
} from "../data/mockData";

// Small helper to simulate the shape of a future network call.
const resolveAsync = (value) => Promise.resolve(value);

/**
 * Look up a single student by their student number.
 * Returns undefined if no match is found.
 */
export async function getStudentByStudentNo(studentNo) {
  const student = students.find((s) => s.studentNo === studentNo);
  return resolveAsync(student ? { ...student } : undefined);
}

/**
 * Mock authentication: matches Student Number + 4-digit PIN.
 * Never exposes the PIN field back to the caller.
 * In the future this check will happen server-side (Apps Script),
 * which is the "secure" version of this same function signature.
 */
export async function authenticateStudent(studentNo, pin) {
  const match = students.find(
    (s) => s.studentNo === studentNo.trim() && s.pin === pin.trim()
  );
  if (!match) return resolveAsync(null);
  const { pin: _omit, ...safeStudent } = match;
  return resolveAsync(safeStudent);
}

/**
 * All requirement rows belonging to ONE student.
 * This is the only place private, per-student progress is read from —
 * dashboards must always call this with the currently authenticated
 * student's number, never with someone else's.
 */
export async function getStudentRequirements(studentNo) {
  const rows = studentRequirements.filter((r) => r.studentNo === studentNo);
  // keep them in canonical SDLC order regardless of storage order
  const ordered = requirementDefs.map((def) =>
    rows.find((r) => r.requirement === def.key)
  );
  return resolveAsync(ordered);
}

/**
 * A single student's overall completion percentage,
 * averaged across their four requirements.
 */
export async function getStudentOverallProgress(studentNo) {
  const rows = await getStudentRequirements(studentNo);
  if (!rows.length) return resolveAsync(0);
  const avg = rows.reduce((sum, r) => sum + r.progress, 0) / rows.length;
  return resolveAsync(Math.round(avg));
}

/**
 * Every student that shares a given groupCode (i.e. project team).
 * Only returns public info (name + studentNo) — no requirement data.
 */
export async function getProjectMembers(groupCode) {
  const members = students
    .filter((s) => s.groupCode === groupCode)
    .map(({ studentNo, name }) => ({ studentNo, name }));
  return resolveAsync(members);
}

/**
 * A project's overall progress, derived (not stored) by averaging
 * every member's individual overall progress.
 */
export async function getProjectOverallProgress(groupCode) {
  const members = await getProjectMembers(groupCode);
  if (!members.length) return resolveAsync(0);
  const scores = await Promise.all(
    members.map((m) => getStudentOverallProgress(m.studentNo))
  );
  const avg = scores.reduce((a, b) => a + b, 0) / scores.length;
  return resolveAsync(Math.round(avg));
}

/**
 * Aggregate, team-level view of each requirement (used on the public
 * Project Details page — never exposes any one student's status).
 * For each requirement, reports the average progress across the team
 * and a rolled-up status label.
 */
export async function getProjectRequirementsOverview(groupCode) {
  const members = await getProjectMembers(groupCode);
  const allRows = await Promise.all(
    members.map((m) => getStudentRequirements(m.studentNo))
  );

  return resolveAsync(
    requirementDefs.map((def, i) => {
      const values = allRows.map((rows) => rows[i]?.progress ?? 0);
      const avgProgress = values.length
        ? Math.round(values.reduce((a, b) => a + b, 0) / values.length)
        : 0;

      let status = "Not Started";
      if (avgProgress === 100) status = "Completed";
      else if (avgProgress > 0) status = "In Progress";

      return {
        key: def.key,
        label: def.label,
        dueDate: def.dueDate,
        progress: avgProgress,
        status,
      };
    })
  );
}

/**
 * A single project's base info (title/description/status), by groupCode.
 */
export async function getProjectByGroupCode(groupCode) {
  const project = projects.find((p) => p.groupCode === groupCode);
  return resolveAsync(project ? { ...project } : undefined);
}

/**
 * Every project, enriched with computed member count + overall progress,
 * for the "View All Projects" grid. Only public data is included.
 */
export async function getAllProjects() {
  const enriched = await Promise.all(
    projects.map(async (project) => {
      const members = await getProjectMembers(project.groupCode);
      const progress = await getProjectOverallProgress(project.groupCode);
      return {
        ...project,
        memberCount: members.length,
        progress,
      };
    })
  );
  return resolveAsync(enriched);
}
