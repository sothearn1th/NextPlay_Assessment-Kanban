export type TaskStatus = "todo" | "in_progress" | "in_review" | "done";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  created_at: string;
};