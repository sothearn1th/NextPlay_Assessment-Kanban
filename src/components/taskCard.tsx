import type { Task } from "../types/task";

type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
};

export function TaskCard({ task, onDelete }: TaskCardProps)
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
      <p style={{ fontSize: 12, color: "gray" }}>
        {task.created_at.toLocaleString()}
      </p>
      <button onClick={() => onDelete(task.id)}>Delete Task</button>
    </div>
  );
}