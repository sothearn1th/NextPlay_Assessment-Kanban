import { TaskCard } from "./components/taskCard.tsx";

type Task = {
  id: string;
  title: string;
  status: "todo" | "done";
};

export default function App()
{
  const tasks: Task[] = [
    { id: "1", title: "Do homework", status: "todo" },
    { id: "2", title: "Study TypeScript", status: "todo" },
    { id: "3", title: "Clean room", status: "done" }
  ];

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const doneTasks = tasks.filter((task) => task.status === "done");

  return (
    <div>
      <h1>Task Board</h1>

      <h2>To Do</h2>
      {todoTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}

      <h2>Done</h2>
      {doneTasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}