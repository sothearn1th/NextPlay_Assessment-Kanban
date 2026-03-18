import type { Task } from "../types/task";
import { TaskCard } from "./taskCard.tsx";
import { useDroppable } from "@dnd-kit/core";


type ColumnProps = {
  title: string;
  status: Task["status"]; 
  tasks: Task[];
  onDelete: (id: string) => void; 
};



export function Column({ title, status, tasks, onDelete }: ColumnProps)
{
  const { setNodeRef, isOver } = useDroppable({
    id: status
  });
  return (

    <div
      ref = {setNodeRef}
      style={{
        border: "1px solid #333", // Darker border
        borderRadius: "12px",     // rounded edges
        padding: 12,
        width: 250,
        minHeight: 500,
        backgroundColor: isOver? "#595858": "#2f2f2f", // This is a standard dark grey
        color: "white"              // Optional: adds white text so it's readable
      }}
    >
    
      <h2 style={{ fontFamily: "'CustomHeaderFont1', sans-serif" }}>
        {title}
      </h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
        />
      ))}

    </div>
  );
}

/*

export function Column({ title, tasks, onDelete }: ColumnProps)
{
  return (
    <div

      style={{
        border: "1px solid black",
        padding: 12,
        width: 250,
        minHeight: 200
      }}
    >
      <h2>{title}</h2>

      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDelete}
        />
      ))}

    </div>
  );

}
    */