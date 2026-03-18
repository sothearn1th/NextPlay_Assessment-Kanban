import { useEffect, useState } from "react";
import type { Task } from "./types/task";
import { Column } from "./components/column";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";

import { mySupabase } from "./lib/supabaseClient.ts"


export default function App()
{

  //States
  const [tasks, setTasks] = useState<Task[]>([]);  /// later will query from the database here for inital data

  const [textBox, setNewTitle] = useState("");

  const [isLoading, setLoading] = useState(false);

  const [error, setError] = useState("");
  
  //const {data: {user}} = await mySupabase.auth.signInAnonymously(); //handshake with the database

  //TODO: Use useEffect and fetch the tasks from the database of the user.
  /*
  useEffect(() => 
  {
      async function fetchTasks()
      {
        
      }
  }, [])};
  */
  
  


  function handleDragEnd(event: DragEndEvent)
  {
    /// drag event.active == being dragged and drag eveet.over dropped event
    const { active: taskCardBeingDropped, over: droppableArea } = event;

    if (!droppableArea)
    {
      return;
    }

    const newTasksArr = tasks.map((currTask) =>
    {
      if (currTask.id === taskCardBeingDropped.id) 
      {
        return { ...currTask, status: droppableArea.id as Task["status"] }; // ...
      }
      return currTask;
    })
    
    setTasks(newTasksArr);
  }




  function deleteTask(id: string)
  {
    const newTasks = tasks.filter((task) => task.id !== id);
    setTasks(newTasks);
  }



  /*
  TODO: rewire to adding data to the database
  */
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

      
      <h1 style={{ fontFamily: "'CustomHeaderFont1', sans-serif", fontSize: 72 }}>
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

      <DndContext onDragEnd={handleDragEnd}>
        <div
          style={{
            display: "flex",
            gap: 20,
            alignItems: "flex-start"
          }}
        >
                 {/* The frontend four columns are here */}


          <Column
            title="To Do"
            status="todo"
            tasksInColumn={tasks.filter((task) => task.status === "todo")}
            onDelete={deleteTask}
          />
          <Column
            title="In Progress"
            status="in_progress"
            tasksInColumn={tasks.filter((task) => task.status === "in_progress")}
            onDelete={deleteTask}
          />
          <Column
            title="In Review"
            status="in_review"
            tasksInColumn={tasks.filter((task) => task.status === "in_review")  }
            onDelete={deleteTask}
          />
          <Column
            title="Done"
            status="done"
            tasksInColumn={tasks.filter((task) => task.status === "done") }
            onDelete={deleteTask}
          />
        </div>
      </DndContext>


      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start"
        }}
      >






      </div>
    </div>
  );
}