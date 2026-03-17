import { TaskCard } from "./taskCard.tsx";

type Task = {
  id: string;
  title: string;
  status: "todo" | "done";
};

type ColumnProps = {
  title: string;
  tasks: Task[];
};

export function Column({ title, tasks }: ColumnProps)
{
  return (
    <div
      style={{
        border: "1px solid black",
        padding: 12,
        marginBottom: 12
      }}
    >
      <h2>{title}</h2>

      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}