import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Task } from "../types/task";
import type { TaskStatus } from "../types/task";
import { TaskCard } from "./taskCard";

type TaskBoardColumnProps = {
  status: TaskStatus;
  tasks: Task[];
};


