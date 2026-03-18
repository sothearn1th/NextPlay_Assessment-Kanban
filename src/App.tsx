import { useState } from "react";
import type { Task } from "./types/task";
import { Column } from "./components/column";

export default function App()
{
  const [tasks, setTasks] = useState<Task[]>([]);

  const [textBox, setNewTitle] = useState("");



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


  function addTask(newTaskTitle: string)
  {
    if (newTaskTitle.trim() === "") return;
    else
    {
      const newTask: Task = {
        id: crypto.randomUUID(),
        title: newTaskTitle,
        status: "todo",
        created_at: new Date(Date.now())
      };
      setTasks([...tasks, newTask]);
      setNewTitle("");
    }
  }



  return (
    <div style={{ padding: 20 }}>

      
      <h1 style={{ fontFamily: "'CustomHeaderFont1', sans-serif" }}>
        Task Board
      </h1>


      <div 
        style={{ marginBottom: 25 }}>
        

        <input
          type="text"
          value={textBox}
          onChange={(event) => setNewTitle(event.target.value)}
          placeholder="Enter a task"
        />
        
        <button onClick={() => addTask(textBox)} style={{ marginLeft: 8 }}>
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