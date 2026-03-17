type Task = {
  id: string;
  title: string;
  status: "todo" | "done";
};

type TaskCardProps = {
  task: Task;
};

export function TaskCard({ task }: TaskCardProps)
{
  return (
    <div
      style={{
        border: "1px solid gray",
        padding: 10,
        marginBottom: 8
      }}
    >
      <p>{task.title}</p>
    </div>
  );
}