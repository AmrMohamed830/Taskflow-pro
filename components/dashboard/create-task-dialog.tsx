"use client";

import React, { useState } from "react";
import { X, Calendar, User as UserIcon, Tag as TagIcon } from "lucide-react";
import type { TaskStatus, TaskPriority } from "@/lib/types/tasks";
import { useForm } from "react-hook-form";

interface CreateTaskDialogProps {
  isOpen: boolean;
  onClose: () => void;
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

const MOCK_USERS = [
  { _id: "1", name: "Alex Admin" },
  { _id: "2", name: "Sarah Connor" },
  { _id: "3", name: "John Smith" },
  { _id: "4", name: "Emily Chen" },
  { _id: "5", name: "Mike Johnson" },
];

export const CreateTaskDialog = ({
  isOpen,
  onClose,
}: CreateTaskDialogProps) => {
  // Form states
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors: formErrors },
  } = useForm<CreateTaskData>();
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

  const onSubmit = (data: CreateTaskData) => {
    console.log(data);
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
              Create New Task
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new task to your workspace
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
                ${errors.title ? "border-red-500/50 focus:ring-red-500/20" : "border-border"}`}
            />
            {errors.title && (
              <span className="text-xs font-semibold text-red-500">
                {errors.title}
              </span>
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
              <select
                {...register("status")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all cursor-pointer"
              >
                <option value="todo" className="bg-popover text-foreground">
                  To Do
                </option>
                <option value="doing" className="bg-popover text-foreground">
                  In Progress
                </option>
                <option value="done" className="bg-popover text-foreground">
                  Done
                </option>
              </select>
            </div>

            {/* Priority */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Priority
              </label>
              <select
                {...register("priority")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all cursor-pointer"
              >
                <option value="low" className="bg-popover text-foreground">
                  Low
                </option>
                <option value="medium" className="bg-popover text-foreground">
                  Medium
                </option>
                <option value="high" className="bg-popover text-foreground">
                  High
                </option>
              </select>
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
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                <UserIcon className="h-3.5 w-3.5 opacity-75" /> Assign To
              </label>
              <select
                {...register("assignedTo")}
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-secondary/20 text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-brand/50 transition-all cursor-pointer"
              >
                <option value="" className="bg-popover text-foreground">
                  Unassigned
                </option>
                {MOCK_USERS.map((user) => (
                  <option
                    key={user._id}
                    value={user._id}
                    className="bg-popover text-foreground"
                  >
                    {user.name}
                  </option>
                ))}
              </select>
            </div>
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
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-brand text-black shadow-lg shadow-brand/10 hover:opacity-90 transition-all flex items-center gap-2 cursor-pointer"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
