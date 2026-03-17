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
        borderRadius: "12px",     // rounded edges
        backgroundColor: "#3f3f3f", // A slightly lighter dark grey for the card background
        padding: 10,
        marginBottom: 8
      }}
    >

    
      <p>{task.title}</p>
      <p style={{font: "status-bar", fontSize: 12, fontWeight: "bold", color: "gray" }}>
        {task.created_at.toLocaleString()}
      </p>
      <button onClick={() => onDelete(task.id)}>Delete Task</button>
    </div>



  );
}