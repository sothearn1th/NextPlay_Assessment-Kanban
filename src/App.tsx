// imports
// Not important //
import { useEffect, useMemo, useState } from "react";
import { mySupabase } from "./lib/supabaseClient";
import type { Task, TaskStatus } from "./types/task";
import { DndContext, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { Column } from "./components/column";


type LoadState = "idle" | "loading" | "ready" | "error";

const COLUMNS: Array<{ key: TaskStatus; title: string }> = [
  { key: "todo", title: "To Do" },
  { key: "in_progress", title: "In Progress" },
  { key: "in_review", title: "In Review" },
  { key: "done", title: "Done" },
];



 /////////////>>>>>>>>>>>>>> HERE <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<////////////
export default function App()
{
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [newTitle, setNewTitle] = useState<string>("");
  const [creating, setCreating] = useState<boolean>(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  );

  const tasksByStatus = useMemo(() =>
  {
    const map: Record<TaskStatus, Task[]> = {
      todo: [],
      in_progress: [],
      in_review: [],
      done: [],
    };

    for (const t of tasks)
    {
      map[t.status].push(t);
    }

    // Keep stable ordering (created_at)
    for (const key of Object.keys(map) as TaskStatus[])
    {
      map[key].sort((a, b) => a.created_at.localeCompare(b.created_at));
    }

    return map;
  }, [tasks]);

  useEffect(() =>
  {
    let cancelled = false;

    async function bootstrap()
    {
      try
      {
        setState("loading");
        setError(null);

        const sessionRes = await mySupabase.auth.getSession();
        let session = sessionRes.data.session;

        if (!session)
        {
          const anonRes = await mySupabase.auth.signInAnonymously();
          if (anonRes.error) throw anonRes.error;
          session = anonRes.data.session;
        }

        const uid = session?.user?.id ?? null;
        if (!uid) throw new Error("Could not resolve user id from session.");

        if (cancelled) return;
        setUserId(uid);

        const { data, error: fetchError } = await mySupabase
          .from("tasks")
          .select("*")
          .order("created_at", { ascending: true });

        if (fetchError) throw fetchError;

        if (cancelled) return;
        setTasks((data ?? []) as Task[]);
        setState("ready");
      }
      catch (e: any)
      {
        if (cancelled) return;
        setState("error");
        setError(e?.message ?? "Unknown error");
      }
    }

    bootstrap();

    return () =>
    {
      cancelled = true;
    };
  }, []);

  async function createTask()
  {
    if (!userId) return;

    const title = newTitle.trim();
    if (title.length === 0) return;

    try
    {
      setCreating(true);
      setError(null);

      const { data, error: insertError } = await mySupabase
        .from("tasks")
        .insert([{ title, status: "todo", user_id: userId }])
        .select("*")
        .single();

      if (insertError) throw insertError;

      setTasks(prev => [...prev, data as Task]);
      setNewTitle("");
    }
    catch (e: any)
    {
      setError(e?.message ?? "Failed to create task");
    }
    finally
    {
      setCreating(false);
    }
  }

  async function deleteTask(taskId: string)
  {
    try
    {
      setError(null);

      const { error: delError } = await mySupabase
        .from("tasks")
        .delete()
        .eq("id", taskId);

      if (delError) throw delError;

      setTasks(prev => prev.filter(t => t.id !== taskId));
    }
    catch (e: any)
    {
      setError(e?.message ?? "Failed to delete task");
    }
  }

  async function updateTaskStatus(taskId: string, nextStatus: TaskStatus)
  {
    // optimistic update
    const prevTasks = tasks;
    setTasks(prev => prev.map(t => (t.id === taskId ? { ...t, status: nextStatus } : t)));

    const { error: upError } = await mySupabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", taskId);

    if (upError)
    {
      // rollback
      setTasks(prevTasks);
      throw upError;
    }
  }

  async function onDragEnd(event: DragEndEvent)
  {
    const { active, over } = event;

    if (!over)
    {
      return;
    }

    const taskId = String(active.id);
    const overId = String(over.id);

    const task = tasks.find((t) => t.id === taskId);
    if (!task)
    {
      return;
    }

    let nextStatus: TaskStatus | null = null;

    // Case 1: dropped directly on a column
    if (
      overId === "todo" ||
      overId === "in_progress" ||
      overId === "in_review" ||
      overId === "done"
    )
    {
      nextStatus = overId;
    }
    else
    {
      // Case 2: dropped on another task card
      const overTask = tasks.find((t) => t.id === overId);

      if (!overTask)
      {
        return;
      }

      nextStatus = overTask.status;
    }

    if (task.status === nextStatus)
    {
      return;
    }

    try
    {
      setError(null);
      await updateTaskStatus(taskId, nextStatus);
    }
    catch (e: any)
    {
      setError(e?.message ?? "Failed to move task");
    }
  }

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.h1}>NP Taskboard</h1>
          <div style={styles.sub}>
            {userId ? (
              <span>Guest: <code>{userId}</code></span>
            ) : (
              <span>Guest: …</span>
            )}
          </div>
        </div>

        <div style={styles.newTask}>
          <input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Add a task…"
            style={styles.input}
            disabled={state !== "ready" || creating}
            onKeyDown={(e) =>
            {
              if (e.key === "Enter")
              {
                createTask();
              }
            }}
          />
          <button
            onClick={createTask}
            disabled={state !== "ready" || creating || newTitle.trim().length === 0}
            style={styles.button}
          >
            {creating ? "Adding…" : "Add"}
          </button>
        </div>
      </header>

      {state === "loading" && (
        <p style={styles.info}>Loading… signing you in and fetching your tasks.</p>
      )}

      {state === "error" && (
        <div style={styles.errorBox}>
          <b>Error:</b> {error ?? "Something went wrong"}
        </div>
      )}

      {state === "ready" && (
        <>
          {error && <div style={styles.errorBox}><b>Error:</b> {error}</div>}

          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <main style={styles.board}>
              {COLUMNS.map(col => (
                <Column
                  key={col.key}
                  status={col.key}
                  title={col.title}
                  tasksInColumn={tasksByStatus[col.key]}
                  onDelete={deleteTask}
                />
              ))}
            </main>
          </DndContext>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    padding: 20,
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    background: "#0b0f19",
    minHeight: "100vh",
    color: "#e8eefc",
  },
  header: {
    display: "flex",
    gap: 16,
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  h1: { margin: 0, fontSize: 22, letterSpacing: 0.2 },
  sub: { marginTop: 6, opacity: 0.8, fontSize: 12.5 },
  newTask: { display: "flex", gap: 8, alignItems: "center" },
  input: {
    width: 320,
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.12)",
    outline: "none",
    background: "rgba(255,255,255,0.06)",
    color: "#e8eefc",
  },
  button: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.16)",
    background: "rgba(255,255,255,0.10)",
    color: "#e8eefc",
    cursor: "pointer",
  },
  info: { opacity: 0.8 },
  errorBox: {
    background: "rgba(220, 38, 38, 0.15)",
    border: "1px solid rgba(220, 38, 38, 0.35)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(220px, 1fr))",
    gap: 12,
    alignItems: "start",
  },
};