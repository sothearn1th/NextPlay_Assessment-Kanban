import { Column } from "./components/column.tsx";

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
    <div style={{ padding: 20 }}>
      <h1>Task Board</h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          alignItems: "flex-start"
        }}
      >
        <Column title="To Do" tasks={todoTasks} />
        <Column title="Done" tasks={doneTasks} />
      </div>
    </div>
  );
}