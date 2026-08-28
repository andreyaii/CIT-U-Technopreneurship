/**
 * Type definitions for Course Deliverables
 */

export type DeliverableStatus =
  | "Submitted"
  | "Graded"
  | "Completed"
  | "Missing"
  | "Pending"
  | "Not Started";

export type DeliverableType =
  | "document"
  | "quiz"
  | "pitch"
  | "report"
  | "presentation";

export interface Deliverable {
  id: string | number;
  title: string;
  dueDate: string;
  isSubmitted: boolean;
  submittedDate: string | null;
  status: DeliverableStatus | string;
  category?: string;
  type?: DeliverableType | string;
  grade?: string | null;
}
