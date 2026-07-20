"use client";

import React, { useState } from "react";
import {
  X,
  Calendar,
  User as UserIcon,
  Tag as TagIcon,
  Clock,
  MessageSquare,
  AlertCircle,
  Send,
} from "lucide-react";
import { useTask } from "@/lib/hooks/useTask";
import { useAuth } from "@/lib/store/auth";
import { useTaskComments } from "@/lib/hooks/useTaskComments";
import type { TaskComment } from "@/lib/types/tasks";
import { useAddComment } from "@/lib/hooks/useAddComment";

interface TaskDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  taskId: string | null;
}

export const TaskDetailsDialog = ({
  isOpen,
  onClose,
  taskId,
}: TaskDetailsDialogProps) => {
  const { data, isLoading, error } = useTask(taskId ?? "");
  const task = data?.task;
  const { user: currentUser } = useAuth();
  const addCommentMutation = useAddComment();
  const { data: commentsResponse, isLoading: commentsLoading } =
    useTaskComments(taskId ?? "");
  const [commentText, setCommentText] = useState("");
  const [localComments, setLocalComments] = useState<
    Array<{ id: string; name: string; text: string; time: string }>
  >([]);

  if (!isOpen) return null;

  const handleSendComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    if (!taskId) return;

    addCommentMutation.mutate(
      {
        taskId,
        data: {
          text: commentText.trim(),
        },
      },
      {
        onSuccess: () => {
          setCommentText("");
        },
      },
    );
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "done":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-emerald-500 text-black">
            Done
          </span>
        );
      case "doing":
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-[#00c985] text-black">
            In Progress
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-xs font-semibold rounded-md bg-orange-500 text-black">
            To Do
          </span>
        );
    }
  };

  const isOverdue = (dueDateStr?: string) => {
    if (!dueDateStr) return false;
    const due = new Date(dueDateStr);
    const now = new Date();
    return due < now && task?.status !== "done";
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "No date";
    const date = new Date(dateStr);
    return isNaN(date.getTime())
      ? dateStr
      : date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
  };

  const allComments = [
    ...(commentsResponse?.comments?.map((comment: TaskComment) => ({
      id: comment._id,
      name: comment.userName,
      text: comment.text,
      time: formatDate(comment.createdAt),
    })) || []),

    ...localComments,
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop - semi-transparent so Kanban board remains visible */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-[2px] transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card - Near Black / Dark Charcoal Background */}
      <div className="relative w-full max-w-2xl bg-[#11141a] border border-[#232836] rounded-2xl shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col text-white">
        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-3">
          <h2 className="text-xl font-bold text-white leading-snug">
            {task?.title || "Task Details"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="px-6 pb-6 overflow-y-auto flex-1 space-y-4 scrollbar-thin">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-400">
              <div className="w-6 h-6 border-2 border-[#00c985] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm font-medium">Loading task details...</p>
            </div>
          ) : error || !task ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-zinc-400">
              <AlertCircle className="w-8 h-8 text-red-500" />
              <p className="text-sm font-medium text-white">
                Failed to load task details.
              </p>
            </div>
          ) : (
            <>
              {/* Badges Row: Status + Tags */}
              <div className="flex flex-wrap items-center gap-2 pb-1">
                {getStatusBadge(task.status)}
                {task.tags &&
                  task.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 rounded-md text-xs font-medium bg-[#181d28] border border-[#2d3445] text-zinc-300 flex items-center gap-1.5"
                    >
                      <TagIcon className="w-3 h-3 opacity-60" />
                      {tag}
                    </span>
                  ))}
              </div>

              {/* Description */}
              {task.description && (
                <div className="space-y-1 pt-1">
                  <h4 className="text-sm font-bold text-white">Description</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed whitespace-pre-wrap">
                    {task.description}
                  </p>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-[#232836] my-3" />

              {/* Metadata Grid (Assigned To & Created in col 1, Due Date in col 2) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6">
                {/* Assigned To */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <UserIcon className="w-3.5 h-3.5" />
                    Assigned To
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#00c985]/20 text-[#00c985] font-bold flex items-center justify-center text-xs shrink-0">
                      {task.assignedTo?.name
                        ? task.assignedTo.name.charAt(0).toUpperCase()
                        : "?"}
                    </div>
                    <span className="text-sm font-bold text-white truncate">
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                  </div>
                </div>

                {/* Due Date */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Calendar className="w-3.5 h-3.5" />
                    Due Date
                  </div>
                  <div className="text-sm font-bold text-white">
                    {task.dueDate ? (
                      isOverdue(task.dueDate) ? (
                        <span className="text-red-500 flex items-center gap-1.5">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          {formatDate(task.dueDate)}
                          <span className="text-xs font-normal text-red-500/80">
                            (Overdue)
                          </span>
                        </span>
                      ) : (
                        formatDate(task.dueDate)
                      )
                    ) : (
                      "No due date"
                    )}
                  </div>
                </div>

                {/* Created */}
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-zinc-400 font-medium mb-1">
                    <Clock className="w-3.5 h-3.5" />
                    Created
                  </div>
                  <div className="text-sm font-bold text-white">
                    {formatDate(task.createdAt)}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#232836] my-3" />

              {/* Comments Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-white">
                  <MessageSquare className="w-4 h-4" />
                  Comments ({allComments.length})
                </div>

                {/* Comment List */}
                {allComments.length > 0 && (
                  <div className="space-y-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                    {allComments.map((comment, idx) => (
                      <div
                        key={comment.id || idx}
                        className="flex items-start gap-3"
                      >
                        <div className="w-7 h-7 rounded-full bg-[#1e2432] border border-[#2d3445] text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {comment.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-white">
                              {comment.name}
                            </span>
                            <span className="text-[11px] text-zinc-400 font-normal">
                              {comment.time}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* New Comment Input Box */}
                <form
                  onSubmit={handleSendComment}
                  className="flex items-start gap-3 pt-1"
                >
                  <div className="w-8 h-8 rounded-full bg-[#00c985]/20 text-[#00c985] font-bold border border-[#00c985]/40 flex items-center justify-center text-xs shrink-0 mt-1">
                    {currentUser?.name
                      ? currentUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="flex-1 flex flex-col items-end gap-3">
                    <textarea
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      rows={2}
                      className="w-full p-3 text-xs bg-[#11141a] border-2 border-[#00c985] focus:border-[#00c985] rounded-xl text-white placeholder:text-zinc-500 resize-none outline-none transition-all"
                    />
                    <button
                      type="submit"
                      disabled={!commentText.trim()}
                      className="flex items-center gap-2 px-4 py-2 bg-[#00c985] text-black font-bold text-xs rounded-lg hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
