"use client";
import React, { useState } from "react";
import {
  Plus,
  Filter,
  MoreHorizontal,
  Calendar,
  GripVertical,
  MessageSquare,
  Edit2,
  UserPlus,
  ArrowRight,
  Trash2,
  CheckCircle2,
  Clock,
  ListTodo,
  Tag as TagIcon,
} from "lucide-react";
import { useTasks } from "@/lib/hooks/useTasks";
import type { TaskStatus, Task as APITask } from "@/lib/types/tasks";
import { useUpdateTaskStatus } from "@/lib/hooks/useUpdateTaskStatus";
import { useDeleteTask } from "@/lib/hooks/useDeleteTask";
import { CreateTaskDialog } from "./create-task-dialog";
// --- Types ---

interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  tags: string[];
  dueDate?: string;
  commentsCount?: number;
  assigneeInitial: string;
  priority?: "high" | "medium" | "low";
}

interface Column {
  id: TaskStatus;
  title: string;
  icon: React.ReactNode;
  color: string;
}

const COLUMNS: Column[] = [
  {
    id: "todo",
    title: "To Do",
    icon: <ListTodo className="h-4 w-4" />,
    color: "text-orange-500",
  },
  {
    id: "doing",
    title: "In Progress",
    icon: <Clock className="h-4 w-4" />,
    color: "text-blue-500",
  },
  {
    id: "done",
    title: "Done",
    icon: <CheckCircle2 className="h-4 w-4" />,
    color: "text-emerald-500",
  },
];

const ALL_TAGS = [
  "backend",
  "charts",
  "database",
  "design",
  "documentation",
  "frontend",
  "high-priority",
  "mobile",
  "notifications",
  "performance",
  "quality",
  "security",
  "testing",
];

// --- Main Component ---

export const Kanban = () => {
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { data, isLoading, error } = useTasks();

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.log(error);
    return <div>Something went wrong.</div>;
  }

  const apiTasks: APITask[] = data?.tasks ?? [];

  const tasks: Task[] = apiTasks.map((t) => ({
    id: t._id,
    title: t.title,
    description: t.description,
    status: t.status,
    tags: t.tags || [],
    dueDate: t.dueDate
      ? (() => {
          const date = new Date(t.dueDate);
          return isNaN(date.getTime())
            ? t.dueDate
            : date.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              });
        })()
      : undefined,
    commentsCount: t.comments?.length || 0,
    assigneeInitial: t.assignedTo?.name
      ? t.assignedTo.name.charAt(0).toUpperCase()
      : "?",
    priority: t.priority,
  }));

  const toggleTag = (tag: string) => {
    setActiveTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
    );
  };

  const filteredTasks = tasks.filter(
    (task) =>
      activeTags.length === 0 ||
      task.tags.some((tag) => activeTags.includes(tag)),
  );

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Kanban Board
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize all team tasks
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-brand text-black font-semibold rounded-lg hover:opacity-90 transition-opacity w-full sm:w-auto cursor-pointer"
        >
          <Plus className="h-5 w-5" />
          New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 py-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap">
          <Filter className="h-4 w-4" />
          Filter:
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {ALL_TAGS.map((tag) => (
            <button
              key={tag}
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all whitespace-nowrap flex items-center gap-2
                ${
                  activeTags.includes(tag)
                    ? "bg-brand/10 border-brand text-brand shadow-[0_0_10px_rgba(0,208,145,0.1)]"
                    : "bg-secondary/20 border-border/50 text-muted-foreground hover:border-muted-foreground/30"
                }`}
            >
              <TagIcon className="h-3 w-3 opacity-60" />
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Board Layout */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-2 min-[1200px]:grid-cols-3 gap-6 w-full min-w-0">
        {COLUMNS.map((column) => (
          <div key={column.id} className="flex flex-col gap-6 min-w-0">
            <KanbanColumn
              column={column}
              tasks={filteredTasks.filter((t) => t.status === column.id)}
            />
          </div>
        ))}
      </div>

      <CreateTaskDialog
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

// --- Sub-components ---

const KanbanColumn = ({ column, tasks }: { column: Column; tasks: Task[] }) => {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 px-1">
        <div
          className={`h-2.5 w-2.5 rounded-full ${column.color.replace("text-", "bg-")}`}
        />
        <h3 className="font-bold text-base text-foreground">{column.title}</h3>
        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-secondary/50 text-muted-foreground ml-1">
          {tasks.length}
        </span>
      </div>

      <div className="flex flex-col gap-4 min-h-[500px]">
        {tasks.length > 0 ? (
          tasks.map((task) => <KanbanTask key={task.id} task={task} />)
        ) : (
          <div className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-border/40 rounded-2xl bg-secondary/5 transition-colors">
            <p className="text-sm font-medium text-muted-foreground/60">
              No tasks
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

const KanbanTask = ({ task }: { task: Task }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { mutate } = useUpdateTaskStatus();
  const { mutate: deleteTask, isPending: isDeleting } = useDeleteTask();
  return (
    <div
      className={`group relative p-5 rounded-2xl border bg-card/40 backdrop-blur-sm hover:border-brand/40 transition-all cursor-grab active:cursor-grabbing w-full min-w-0 overflow-hidden
      ${task.priority === "high" ? "border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.05)]" : "border-border"}`}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground/40 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          <h4 className="text-[15px] font-bold text-foreground leading-tight truncate">
            {task.title}
          </h4>
        </div>
        <div className="relative">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className={`p-1.5 rounded-lg transition-all
              ${isMenuOpen ? "bg-brand text-black" : "bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground"}`}
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>

          {isMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsMenuOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-52 rounded-xl border border-border bg-popover shadow-2xl z-20 py-1.5 overflow-hidden animate-in fade-in zoom-in-95 duration-100">
                <MenuOption
                  icon={<Edit2 className="h-4 w-4" />}
                  label="Edit Task"
                  onClick={() => setIsMenuOpen(false)}
                />
                <MenuOption
                  icon={<UserPlus className="h-4 w-4" />}
                  label="Assign To"
                  hasSubmenu
                  onClick={() => {}}
                />
                <div className="h-px bg-border my-1.5" />
                {task.status !== "done" && (
                  <MenuOption
                    icon={<ArrowRight className="h-4 w-4" />}
                    label={`Move to ${task.status === "todo" ? "In Progress" : "Done"}`}
                    onClick={() => {
                      mutate({
                        id: task.id,
                        data: {
                          status: task.status === "todo" ? "doing" : "done",
                        },
                      });

                      setIsMenuOpen(false);
                    }}
                  />
                )}
                <div className="h-px bg-border my-1.5" />
                <MenuOption
                  icon={<Trash2 className="h-4 w-4" />}
                  label="Delete Task"
                  variant="danger"
                  onClick={() => {
                    setIsDeleteModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                />
              </div>
            </>
          )}
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-muted-foreground/80 line-clamp-2 mb-5 leading-relaxed font-medium">
        {task.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className={`text-[10px] px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider
              ${tag === "high-priority" ? "bg-red-500 text-white" : "bg-secondary/60 text-muted-foreground"}`}
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto">
        <div className="flex items-center gap-4">
          {task.dueDate && (
            <div
              className={`flex items-center gap-1.5 text-[12px] font-bold ${task.priority === "high" ? "text-red-500" : "text-muted-foreground/60"}`}
            >
              <Calendar className="h-3.5 w-3.5" />
              {task.dueDate}
            </div>
          )}
          {task.commentsCount !== undefined && (
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-muted-foreground/60">
              <MessageSquare className="h-3.5 w-3.5" />
              {task.commentsCount}
            </div>
          )}
        </div>
        <div className="h-7 w-7 rounded-full bg-secondary-brand/20 border border-brand/20 text-brand flex items-center justify-center text-[11px] font-black shadow-sm shadow-brand/5">
          {task.assigneeInitial}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => !isDeleting && setIsDeleteModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card shadow-2xl p-6 animate-in fade-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-foreground mb-2">
              Delete Task
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Are you sure you want to delete{" "}
              <span className="font-bold text-foreground">{task.title}</span>?
              This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                disabled={isDeleting}
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground border border-border hover:bg-secondary disabled:opacity-50 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={() => {
                  deleteTask(task.id);
                }}
                className="px-6 py-2.5 rounded-xl text-sm font-bold bg-red-600 text-white shadow-lg shadow-red-600/20 hover:bg-red-700 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
              >
                {isDeleting ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const MenuOption = ({
  icon,
  label,
  variant = "default",
  hasSubmenu = false,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  variant?: "default" | "danger";
  hasSubmenu?: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-between w-full px-4 py-2.5 text-[13px] font-semibold transition-colors
      ${variant === "danger" ? "text-red-500 hover:bg-red-500/10" : "text-foreground hover:bg-secondary/80"}`}
  >
    <div className="flex items-center gap-3">
      <span
        className={
          variant === "danger"
            ? "text-red-500"
            : "text-muted-foreground/70 group-hover:text-foreground transition-colors"
        }
      >
        {icon}
      </span>
      {label}
    </div>
    {hasSubmenu && (
      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50" />
    )}
  </button>
);

export default Kanban;
