import { useState } from "react";
import type { Task } from "./types/task";
import { Column } from "./components/column.tsx";

export default function App()
{
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Do homework", status: "todo", created_at: new Date() },
    { id: "2", title: "Study TypeScript", status: "todo", created_at: new Date() },
    { id: "3", title: "Clean room", status: "done", created_at: new Date() }
  ]);

  function deleteTask(id: string)
  {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doneTasks = tasks.filter((task) => task.status === "done");
  const inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  const inReviewTasks = tasks.filter((task) => task.status === "in_review");

  return (
    <div style={{ padding: 20 }}>
      <h1>Task Board</h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start"
        }}
      >
        <Column title="To Do" tasks={todoTasks} onDelete={deleteTask} />
        <Column title="In Progress" tasks={inProgressTasks} onDelete={deleteTask} />
        <Column title="In Review" tasks={inReviewTasks} onDelete={deleteTask} />
        <Column title="Done" tasks={doneTasks} onDelete={deleteTask} />

      </div>
    </div>
  );
}