/**
 * mockDeliverables.js
 * ------------------------------------------------------------------
 * Mock data representing course deliverables converted from spreadsheet
 * tracking data into structured JavaScript objects.
 * ------------------------------------------------------------------
 */

export const mockDeliverables = [
  {
    id: "deliv-01",
    title: "Technopreneurship Guidelines & Syllabus Acknowledgement",
    category: "Orientation",
    type: "document",
    dueDate: "Aug 25, 2026",
    isSubmitted: true,
    submittedDate: "Aug 24, 2026",
    status: "Graded",
    grade: "100 / 100",
  },
  {
    id: "deliv-02",
    title: "Quiz 1: Lean Startup & Value Proposition",
    category: "Assessment",
    type: "quiz",
    dueDate: "Sep 02, 2026",
    isSubmitted: true,
    submittedDate: "Sep 01, 2026",
    status: "Submitted",
    grade: "In Review",
  },
  {
    id: "deliv-03",
    title: "Elevator Pitch & Problem Definition Deck",
    category: "Milestone",
    type: "pitch",
    dueDate: "Sep 15, 2026",
    isSubmitted: true,
    submittedDate: "Sep 14, 2026",
    status: "Graded",
    grade: "96 / 100",
  },
  {
    id: "deliv-04",
    title: "Customer Discovery & Market Validation Report",
    category: "Research",
    type: "report",
    dueDate: "Sep 28, 2026",
    isSubmitted: false,
    submittedDate: null,
    status: "Missing",
    grade: null,
  },
  {
    id: "deliv-05",
    title: "Midterm MVP Prototype Demonstration",
    category: "Milestone",
    type: "presentation",
    dueDate: "Oct 12, 2026",
    isSubmitted: false,
    submittedDate: null,
    status: "Pending",
    grade: null,
  },
  {
    id: "deliv-06",
    title: "Business Model Canvas (BMC) & Revenue Streams",
    category: "Strategy",
    type: "document",
    dueDate: "Oct 26, 2026",
    isSubmitted: false,
    submittedDate: null,
    status: "Pending",
    grade: null,
  },
  {
    id: "deliv-07",
    title: "Final Venture Pitch & Investor Deck",
    category: "Final Defense",
    type: "pitch",
    dueDate: "Nov 15, 2026",
    isSubmitted: false,
    submittedDate: null,
    status: "Pending",
    grade: null,
  },
];
