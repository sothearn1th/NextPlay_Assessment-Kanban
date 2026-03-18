import type { Task } from "../types/task";
import { useDraggable } from "@dnd-kit/core";


type TaskCardProps = {
  task: Task;
  onDelete: (id: string) => void;
};

export function TaskCard({ task, onDelete }: TaskCardProps)
{
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: task.id 
    });

    const theStyle: React.CSSProperties = {
        fontFamily: "'CustomBodyFont1', sans-serif",
        border: "1px solid gray",
        borderRadius: "12px",
        backgroundColor: "#3f3f3f",
        padding: 10,
        marginBottom: 8,
        cursor: "grab",
        transform: transform
        ? `translate(${transform.x}px, ${transform.y}px)`
        : undefined
  };

    return (
    <div
      ref={setNodeRef}
      style={theStyle}
      {...listeners}
      {...attributes}
    >
      <p>{task.title}</p>

      <p>{task.created_at.toLocaleString()}</p>
      <button 
      style={{ borderRadius: "8px", border: "1px solid #333", padding: 5, cursor: "pointer" }}
      onClick={() => onDelete(task.id)}
    >
      Delete
    </button>
    </div>

  );
}