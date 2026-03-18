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

    return (

        <div
        ref={setNodeRef}
        style={{

            fontFamily: "'CustomBodyFont1', sans-serif", // Custom font for the card content
            border: "1px solid gray",
            borderRadius: "12px",     // rounded edges
            backgroundColor: "#3f3f3f", // A slightly lighter dark grey for the card background
            padding: 10,
            marginBottom: 8,
            transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        }}
        {...listeners}
        {...attributes}
        >
        
        <p>{task.title}</p>


        <p style={{ fontSize: 12, fontWeight: "bold", color: "gray" }}>
            {task.created_at.toLocaleString()}
        </p>


        <button onClick={() => onDelete(task.id)}>Delete Task</button>


        </div>



  );
}