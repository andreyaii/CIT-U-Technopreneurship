# Technopreneurship Project Tracker (Frontend Prototype)

A student-facing tracker for ES038 Technopreneurship projects, and deliverable tracker, built with
React + Vite + Tailwind CSS + React Router + Lucide React.

This is the **frontend-only** prototype described in the project brief:
mock data stands in for a Google Sheet for now, behind a service layer
that is designed to be swapped later without touching the UI.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually `http://localhost:5173`).

To build for production:

```bash
npm run build
```

## Test logins

Every student in the roster uses PIN **1234** (mock data — real PINs will
be assigned later). A few to try:

| Student Number | Name                      | What you'll see                          |
|-----------------|---------------------------|-------------------------------------------|
| `22-5657-518`   | Patrick Cabiling          | All requirements Not Started (0%)         |
| `22-2730-457`   | Walter Canencia           | SRS & SDD Completed, rest Not Started (50%)|
| `19-3026-410`   | Shane Adrian Opinion      | All requirements Completed (100%)         |
| `22-3329-130`   | John Joseph Laborada      | Group 02 (MediQueue), all Not Started     |

Logging in with any student number + PIN `1234` will always work; the
dashboard automatically scopes to whoever is logged in.

## Project structure

```
src/
├── components/        Reusable UI pieces (Navbar, ProjectCard, RequirementTracker, ...)
├── pages/              Route-level pages (Login, Dashboard, Projects, ProjectDetailsPage)
├── context/
│   └── AuthContext.jsx     Holds the logged-in student's identity (session-scoped)
├── data/
│   └── mockData.js         Raw mock data — the ONLY file with hardcoded records
├── services/
│   └── projectService.js   Data-access layer — pages call this, never mockData.js directly
├── App.jsx             Routes + providers
└── main.jsx
```

## Routes

| Route                     | Access    | Purpose                                   |
|---------------------------|-----------|--------------------------------------------|
| `/login`                  | Public    | Student Number + 4-digit PIN login         |
| `/dashboard`               | Protected | Logged-in student's own info & tracker     |
| `/projects`                | Protected | Browse all Technopreneurship projects      |
| `/projects/:groupCode`     | Protected | Public project details + team tracker      |

"Protected" routes redirect to `/login` if no student is authenticated.

## How privacy is enforced

- `AuthContext` stores only the authenticated student's `studentNo`.
- The Dashboard **always** fetches data using `student.studentNo` from
  context — never from a URL parameter or a "currently viewed" project.
- `getProjectRequirementsOverview()` (used on the public Project Details
  page) returns team-level **averages only** — it never exposes any one
  student's individual status.
- `authenticateStudent()` never returns the student's PIN back to the app.

## Connecting this to Google Sheets later

Nothing in `pages/` or `components/` should need to change. Only
`src/services/projectService.js` does — replace each function's mock
implementation with a `fetch()` call to your Google Apps Script Web App
endpoint, keeping the same function names and return shapes:

```
React UI  →  projectService.js  →  Google Apps Script Web App  →  Google Sheet
```

For example:

```js
export async function getStudentByStudentNo(studentNo) {
  const res = await fetch(`${API_URL}?action=getStudentByStudentNo&studentNo=${studentNo}`);
  return res.json();
}
```

`src/data/mockData.js` can be deleted once the real API is wired up.

## Notes / things to decide with your instructor later

- PINs are currently mock (`1234` for everyone) since the brief said real
  PINs haven't been assigned yet.
- Requirement due dates are placeholders (Sept–Oct 2026) — replace with
  real dates once available.
- Project titles/descriptions (AgriConnect, MediQueue, EcoTrack,
  CampusEats) are placeholder concepts since the brief didn't include
  real project names — swap these for your class's actual project titles.
