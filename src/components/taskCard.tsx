import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Task } from "../types/task.ts";

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps)
{
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 10,
        marginBottom: 8
      }}
    >
      <p>{task.title}</p>
    </div>
  );
}