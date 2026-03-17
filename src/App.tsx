import { useState } from "react";
import type { Task } from "./types/task";
import { Column } from "./components/column";

export default function App()
{
  const [tasks, setTasks] = useState<Task[]>([
    { id: "1", title: "Do homework", status: "todo", created_at: new Date() },
    { id: "2", title: "Study TypeScript", status: "todo", created_at: new Date() },
    { id: "3", title: "Clean room", status: "done", created_at: new Date() }
  ]);

  const [newTitle, setNewTitle] = useState("");


  //** The backend for the four columns are here */
  let todoTasks = tasks.filter((task) => task.status === "todo");
  let inProgressTasks = tasks.filter((task) => task.status === "in_progress");
  let inReviewTasks = tasks.filter((task) => task.status === "in_review");
  let doneTasks = tasks.filter((task) => task.status === "done");


  function deleteTask(id: string)
  {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }

  function addTask()
  {
    if (newTitle.trim() === "")
    {
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTitle,
      status: "todo",
      created_at: new Date()
    };

    setTasks([...tasks, newTask]);
    setNewTitle("");
  }



  return (
    <div style={{ padding: 20 }}>
      
      <h1 style={{ fontFamily: "'CustomHeaderFont1', sans-serif" }}>
        Task Board
      </h1>

      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          value={newTitle}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTask} style={{ marginLeft: 8 }}>
          Add
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start"
        }}
      >


       {/* The frontend four columns are here */}

        <Column title="To Do" tasks={todoTasks} onDelete={deleteTask} />
        <Column title="In Progress" tasks={inProgressTasks} onDelete={deleteTask} />
        <Column title="In Review" tasks={inReviewTasks} onDelete={deleteTask} />
        <Column title="Done" tasks={doneTasks} onDelete={deleteTask} />


      </div>
    </div>
  );
}