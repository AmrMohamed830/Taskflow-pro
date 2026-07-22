"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { X, Calendar, Tag as TagIcon, ChevronDown, Check } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createTaskSchema,
  type CreateTaskFormData,
} from "@/lib/validations/task";
import { useCreateTask } from "@/lib/hooks/useCreateTask";
import { useUsers } from "@/lib/hooks/useUsers";
import type { User } from "@/lib/types/users";
import type { Task } from "@/lib/types/tasks";
import { useUpdateTask } from "@/lib/hooks/useUpdateTask";
import { useAuth } from "@/lib/store/auth";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
}

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

const getInitials = (name: string) => {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

interface Option {
  value: string;
  label: string;
  avatar?: string;
  sublabel?: string;
}

const CustomSelect = ({
  value,
  onChange,
  options,
  placeholder = "Select option",
  isLoading = false,
}: {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  isLoading?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  const renderAvatar = (avatar: string, label: string) => {
    const isImage =
      avatar &&
      (avatar.startsWith("http") ||
        avatar.startsWith("/") ||
        avatar.includes("."));
    if (isImage) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={avatar}
          alt={label}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent && !parent.querySelector(".initials-fallback")) {
              const span = document.createElement("span");
              span.className = "initials-fallback";
              span.innerText = getInitials(label);
              parent.appendChild(span);
            }
          }}
        />
      );
    }
    return <span>{avatar ? avatar : getInitials(label)}</span>;
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <button
        type="button"
        onClick={() => !isLoading && setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl border border-border bg-secondary/20 hover:bg-secondary/30 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all text-left cursor-pointer select-none"
      >
        <span className="flex items-center gap-2 truncate text-sm">
          {isLoading ? (
            <span className="text-muted-foreground">Loading...</span>
          ) : selectedOption ? (
            <>
              {selectedOption.avatar !== undefined && (
                <div className="w-5 h-5 rounded-full overflow-hidden bg-brand/10 border border-brand/20 flex items-center justify-center text-[9px] font-bold text-brand uppercase shrink-0">
                  {renderAvatar(selectedOption.avatar, selectedOption.label)}
                </div>
              )}
              <span className="truncate">{selectedOption.label}</span>
            </>
          ) : (
            <span className="text-muted-foreground/50">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`h-4 w-4 opacity-50 transition-transform duration-200 shrink-0 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="max-h-60 overflow-y-auto py-1 scrollbar-thin">
            {options.length === 0 ? (
              <div className="px-4 py-2.5 text-xs text-muted-foreground text-center">
                No options available
              </div>
            ) : (
              options.map((option) => {
                const isSelected = option.value === value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold transition-colors hover:bg-secondary/40 text-left cursor-pointer
                      ${isSelected ? "bg-brand/10 text-brand" : "text-foreground"}
                    `}
                  >
                    <span className="flex items-center gap-2.5 truncate">
                      {option.avatar !== undefined && (
                        <div className="w-6 h-6 rounded-full overflow-hidden bg-brand/10 border border-brand/20 flex items-center justify-center text-[10px] font-bold text-brand uppercase shrink-0">
                          {renderAvatar(option.avatar, option.label)}
                        </div>
                      )}
                      <span className="flex flex-col truncate">
                        <span className="truncate">{option.label}</span>
                        {option.sublabel && (
                          <span className="text-[10px] text-muted-foreground font-normal truncate">
                            {option.sublabel}
                          </span>
                        )}
                      </span>
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-brand shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export const CreateTaskDialog = ({
  isOpen,
  onClose,
  task,
}: CreateTaskDialogProps) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === "admin";

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors: formErrors },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      status: "todo",
      priority: "medium",
      tags: [],
    },
  });

  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const { data: usersResponse, isLoading } = useUsers();

  const isSubmitting =
    createTaskMutation.isPending || updateTaskMutation.isPending;

  const statusValue = watch("status");
  const priorityValue = watch("priority");
  const assignedToValue = watch("assignedTo") ?? "";

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "doing", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  useEffect(() => {
    if (!isOpen) return;

    if (task) {
      reset({
        title: task.title,
        description: task.description || "",
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        assignedTo:
          typeof task.assignedTo === "string"
            ? task.assignedTo
            : task.assignedTo?._id || "",
        tags: task.tags || [],
      });
      setSelectedTags(task.tags || []);
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
        assignedTo: "",
        tags: [],
      });
      setSelectedTags([]);
    }
  }, [task, isOpen, reset]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const assignedToOptions = useMemo(() => {
    const usersList = (usersResponse?.data ?? []) as User[];
    return usersList.map((user: User) => ({
      value: user._id || "",
      label: user.name,
      sublabel: user.email,
      avatar: user.avatar || "",
    }));
  }, [usersResponse?.data]);

  if (!isOpen) return null;

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) => {
      const updatedTags = prev.includes(tag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag];

      setValue("tags", updatedTags);

      return updatedTags;
    });
  };

  const onSubmit = (data: CreateTaskFormData) => {
    if (task) {
      updateTaskMutation.mutate(
        {
          id: task._id,
          data,
        },
        {
          onSuccess: () => {
            reset();
            setSelectedTags([]);
            onClose();
          },
        },
      );

      return;
    }

    createTaskMutation.mutate(data, {
      onSuccess: () => {
        reset();
        setSelectedTags([]);
        onClose();
      },
    });
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in-95 duration-200 flex flex-col gap-6 max-h-[90vh] overflow-y-auto z-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {task ? "Edit Task" : "Create New Task"}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              {task
                ? "Update task information."
                : "Create a new task for your team."}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-secondary/40 text-muted-foreground hover:bg-secondary/60 hover:text-foreground transition-all cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              {...register("title")}
              placeholder="e.g. Implement auth page"
              className={`w-full px-4 py-2.5 rounded-xl border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50
                ${formErrors.title ? "border-red-500/50 focus:ring-red-500/20" : "border-border"}`}
            />
            {formErrors.title && (
              <p className="text-sm text-red-500 mt-1">
                {formErrors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Description
            </label>
            <textarea
              {...register("description")}
              placeholder="What needs to be done..."
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all placeholder:text-muted-foreground/50 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Status */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Status
              </label>
              <input type="hidden" {...register("status")} />
              <CustomSelect
                value={statusValue}
                onChange={(val) =>
                  setValue("status", val as "todo" | "doing" | "done", {
                    shouldValidate: true,
                  })
                }
                options={statusOptions}
              />
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <input type="hidden" {...register("priority")} />
              <CustomSelect
                value={priorityValue}
                onChange={(val) =>
                  setValue("priority", val as "low" | "medium" | "high", {
                    shouldValidate: true,
                  })
                }
                options={priorityOptions}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Due Date */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 opacity-75" /> Due Date
              </label>
              <input
                type="date"
                {...register("dueDate")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all cursor-pointer scheme-dark"
              />
            </div>

            {/* Assign To */}
            {isAdmin && (
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  Assigned To
                </label>
                <input type="hidden" {...register("assignedTo")} />
                <CustomSelect
                  value={assignedToValue}
                  onChange={(val) =>
                    setValue("assignedTo", val, { shouldValidate: true })
                  }
                  options={assignedToOptions}
                  placeholder="Select a user"
                  isLoading={isLoading}
                />

                {formErrors.assignedTo && (
                  <p className="text-sm text-red-500">
                    {formErrors.assignedTo.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-col gap-2.5">
            <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
              <TagIcon className="h-3.5 w-3.5 opacity-75" /> Tags
            </label>
            <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto p-1.5 rounded-xl border border-border/40 bg-secondary/5">
              {ALL_TAGS.map((tag) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleToggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-bold border transition-all whitespace-nowrap cursor-pointer
                      ${
                        isSelected
                          ? "bg-brand/10 border-brand text-brand shadow-[0_0_8px_rgba(0,208,145,0.08)]"
                          : "bg-secondary/20 border-border/50 text-muted-foreground hover:border-muted-foreground/30"
                      }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-4 pt-4 border-t border-border/50">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-foreground border border-border hover:bg-secondary transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-black shadow-lg shadow-brand/10 hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 cursor-pointer"
            >
              {isSubmitting
                ? task
                  ? "Updating..."
                  : "Creating..."
                : task
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
