"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ListTodo,
  Clock,
  CircleCheck,
  TrendingUp,
  Users,
  CircleAlert,
  Zap,
  Calendar,
  ArrowRight,
  Target,
  ShieldAlert,
  Plus,
  RefreshCw,
  UserCheck,
  CheckCircle2,
  AlertTriangle,
  Layers,
} from "lucide-react";

import { useDashboardStats } from "@/lib/hooks/useDashboardStats";
import { useTasks } from "@/lib/hooks/useTasks";
import { useUsers } from "@/lib/hooks/useUsers";
import { useAuth } from "@/lib/store/auth";
import { CreateTaskDialog } from "@/components/dashboard/create-task-dialog";
import { TaskDetailsDialog } from "@/components/dashboard/TaskDetailsDialog";
import type { Task, TaskPriority, TaskStatus } from "@/lib/types/tasks";
import type { User } from "@/lib/types/users";

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuth();
  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStats();

  const {
    data: tasksResponse,
    isLoading: isTasksLoading,
    refetch: refetchTasks,
  } = useTasks();

  const {
    data: usersResponse,
    isLoading: isUsersLoading,
    refetch: refetchUsers,
  } = useUsers();

  // Dialog States
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  const handleRefresh = () => {
    refetchStats();
    refetchTasks();
    refetchUsers();
  };

  // Derive Team statistics from users API
  const teamMetrics = useMemo(() => {
    const userList = (usersResponse?.data || []) as User[];
    const totalUsers = usersResponse?.total || userList.length || 0;
    const adminCount = userList.filter((u: User) => u.role === "admin").length;
    const regularUserCount = userList.filter((u: User) => u.role === "user" || !u.role).length;
    return {
      totalUsers,
      adminCount: adminCount || 1,
      regularUserCount: regularUserCount || Math.max(0, totalUsers - 1),
    };
  }, [usersResponse]);

  // Derive Recent Tasks
  const recentTasks = useMemo(() => {
    const tasksList = tasksResponse?.tasks || [];
    return [...tasksList]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);
  }, [tasksResponse]);

  // Derive Upcoming / Pending Deadlines
  const upcomingDeadlines = useMemo(() => {
    const tasksList = tasksResponse?.tasks || [];
    return [...tasksList]
      .filter((t) => t.dueDate && t.status !== "done")
      .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
      .slice(0, 5);
  }, [tasksResponse]);

  // Time of day greeting
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  }, []);

  const isLoading = isStatsLoading || isTasksLoading || isUsersLoading;

  if (isLoading && !stats && !tasksResponse) {
    return <DashboardSkeleton />;
  }

  if (statsError) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center text-center gap-4 p-8 max-w-md rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive">
          <ShieldAlert className="h-10 w-10 animate-bounce" />
          <div>
            <h3 className="text-lg font-bold">Failed to load dashboard data</h3>
            <p className="text-sm text-muted-foreground mt-1">
              There was an issue connecting to the server. Please check your internet connection or backend service.
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg bg-destructive text-destructive-foreground hover:opacity-90 transition-all cursor-pointer"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const overdueCount = stats?.overdueCount ?? 0;
  const todoCount = stats?.todoCount ?? 0;
  const doingCount = stats?.doingCount ?? 0;
  const doneCount = stats?.doneCount ?? 0;
  const totalTasks = stats?.totalTasks ?? 0;
  const completionRate = stats?.completionRate ?? 0;

  return (
    <div className="flex flex-col gap-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/40 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {greeting}, {user?.name || "User"}
            </h1>
            {user?.role && (
              <span className="text-[11px] font-semibold uppercase px-2.5 py-0.5 rounded-full bg-brand/10 text-brand border border-brand/20">
                {user.role}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Here is an up-to-date overview of team productivity, deadlines, and project progress.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRefresh}
            title="Refresh Data"
            className="p-2.5 rounded-xl border border-border bg-card hover:bg-secondary/80 text-muted-foreground hover:text-foreground transition-all cursor-pointer"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          </button>
          {user?.role === "admin" && (
            <button
              onClick={() => setIsCreateTaskOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand text-black font-semibold text-sm shadow-md hover:opacity-90 transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              Create Task
            </button>
          )}
        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        {/* Overdue Alert Banner (Full Width) */}
        {overdueCount > 0 && (
          <div className="md:col-span-2 lg:col-span-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-6 py-4 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm transition-all shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2.5 rounded-xl bg-red-500/20 text-red-500 shrink-0">
                  <AlertTriangle className="h-5 w-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground text-base">
                    {overdueCount} {overdueCount === 1 ? "task is" : "tasks are"} overdue!
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Some tasks have passed their deadline. Please review and update their status.
                  </p>
                </div>
              </div>
              <button
                onClick={() => router.push("/dashboard/kanban")}
                className="whitespace-nowrap px-4 py-2 text-xs font-bold border border-red-500/40 text-red-600 dark:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                View Kanban Board
              </button>
            </div>
          </div>
        )}

        {/* Stat Cards */}
        <StatCard
          title="To Do"
          value={todoCount.toString()}
          description={`${totalTasks > 0 ? Math.round((todoCount / totalTasks) * 100) : 0}% of total tasks`}
          icon={<ListTodo className="h-5 w-5 text-amber-500" />}
          iconBg="bg-amber-500/10 border border-amber-500/20"
        />

        <StatCard
          title="In Progress"
          value={doingCount.toString()}
          description={`${totalTasks > 0 ? Math.round((doingCount / totalTasks) * 100) : 0}% of active workload`}
          icon={<Clock className="h-5 w-5 text-blue-500" />}
          iconBg="bg-blue-500/10 border border-blue-500/20"
        />

        <StatCard
          title="Completed"
          value={doneCount.toString()}
          description={`${doneCount} finished tasks`}
          icon={<CircleCheck className="h-5 w-5 text-emerald-500" />}
          iconBg="bg-emerald-500/10 border border-emerald-500/20"
        />

        {/* Completion Rate with visual progress bar */}
        <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between gap-4 shadow-sm hover:border-border/80 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-muted-foreground">Completion Rate</span>
            <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <TrendingUp className="h-5 w-5 text-purple-500" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <span className="text-3xl font-extrabold text-card-foreground">{completionRate}%</span>
              <span className="text-xs text-muted-foreground font-medium">{doneCount}/{totalTasks} tasks</span>
            </div>
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden mt-3">
              <div
                className="bg-purple-500 h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Mid-size Metric Cards */}
        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm hover:border-border/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground">Team Members</div>
              <div className="text-3xl font-extrabold text-card-foreground mt-2">
                {teamMetrics.totalUsers}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border/50 mt-4">
            <span className="flex items-center gap-1 font-medium text-foreground">
              <UserCheck className="h-3.5 w-3.5 text-blue-500" />
              {teamMetrics.adminCount} Admin
            </span>
            <span>•</span>
            <span className="font-medium text-foreground">{teamMetrics.regularUserCount} Team Users</span>
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-xl border border-border bg-card shadow-sm hover:border-border/80 transition-all flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold text-muted-foreground">Overdue Attention</div>
              <div className="text-3xl font-extrabold text-red-500 mt-2">
                {overdueCount}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
              <CircleAlert className="h-6 w-6 text-red-500" />
            </div>
          </div>
          <div className="text-xs text-muted-foreground pt-4 border-t border-border/50 mt-4">
            {overdueCount > 0 ? (
              <span className="text-red-500 font-semibold flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5" /> Action required to update status
              </span>
            ) : (
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5" /> All tasks are on schedule!
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions & Deadlines */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col justify-between gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-foreground text-lg">
              <div className="p-2 rounded-lg bg-brand/10 text-brand">
                <Zap className="h-5 w-5" />
              </div>
              Quick Actions
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Shortcuts for key management tasks
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <QuickActionButton
              icon={<Target className="h-4 w-4 text-brand" />}
              label="Open Kanban Board"
              onClick={() => router.push("/dashboard/kanban")}
            />
            {user?.role === "admin" && (
              <QuickActionButton
                icon={<Plus className="h-4 w-4 text-blue-500" />}
                label="Create New Task"
                onClick={() => setIsCreateTaskOpen(true)}
              />
            )}
            {user?.role === "admin" && (
              <QuickActionButton
                icon={<Users className="h-4 w-4 text-emerald-500" />}
                label="Manage Users"
                onClick={() => router.push("/dashboard/users")}
              />
            )}
          </div>
        </div>

        {/* Upcoming Deadlines (Dynamic Backend Data) */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2.5 font-bold text-foreground text-lg">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-500">
                  <Calendar className="h-5 w-5" />
                </div>
                Upcoming Deadlines
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Pending tasks due soon
              </p>
            </div>
            <Link
              href="/dashboard/kanban"
              className="text-xs font-semibold text-brand flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand/10 transition-all group"
            >
              View all{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {upcomingDeadlines.length > 0 ? (
              upcomingDeadlines.map((task) => (
                <DeadlineItem
                  key={task._id}
                  task={task}
                  onClick={() => setSelectedTaskId(task._id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center rounded-xl bg-secondary/20 border border-dashed border-border/60">
                <CheckCircle2 className="h-8 w-8 text-emerald-500 mb-2 opacity-80" />
                <p className="text-sm font-semibold text-foreground">No upcoming pending deadlines</p>
                <p className="text-xs text-muted-foreground mt-0.5">All pending tasks have no due date or are done.</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Tasks (Dynamic Backend Data) */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-6 rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/50 pb-4">
            <div>
              <h3 className="font-bold text-lg text-foreground flex items-center gap-2">
                <Layers className="h-5 w-5 text-brand" />
                Recent Tasks Activity
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Latest updates and created tasks from backend
              </p>
            </div>
            <Link
              href="/dashboard/kanban"
              className="text-xs font-semibold text-brand flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-brand/10 transition-all group"
            >
              View all tasks{" "}
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            {recentTasks.length > 0 ? (
              recentTasks.map((task) => (
                <RecentTaskRow
                  key={task._id}
                  task={task}
                  onClick={() => setSelectedTaskId(task._id)}
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center p-10 text-center rounded-xl bg-secondary/10 border border-dashed border-border">
                <ListTodo className="h-10 w-10 text-muted-foreground mb-3" />
                <h4 className="text-base font-bold text-foreground">No tasks found</h4>
                <p className="text-xs text-muted-foreground mt-1 max-w-sm">
                  Start by creating your first task to see updates and activity here.
                </p>
                <button
                  onClick={() => setIsCreateTaskOpen(true)}
                  className="mt-4 flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg bg-brand text-black shadow-sm hover:opacity-90 transition-all cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  Create First Task
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <CreateTaskDialog
        isOpen={isCreateTaskOpen}
        onClose={() => setIsCreateTaskOpen(false)}
      />

      <TaskDetailsDialog
        isOpen={!!selectedTaskId}
        taskId={selectedTaskId}
        onClose={() => setSelectedTaskId(null)}
      />
    </div>
  );
}

// --- Helper Components ---

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
};

const StatCard = ({ title, value, description, icon, iconBg }: StatCardProps) => (
  <div className="p-6 rounded-xl border border-border bg-card flex flex-col justify-between gap-4 shadow-sm hover:border-border/80 transition-all">
    <div className="flex items-center justify-between">
      <span className="text-sm font-semibold text-muted-foreground">{title}</span>
      <div className={`p-2 rounded-lg ${iconBg}`}>{icon}</div>
    </div>
    <div>
      <div className="text-3xl font-extrabold text-card-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

type QuickActionButtonProps = {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
};

const QuickActionButton = ({ icon, label, onClick }: QuickActionButtonProps) => (
  <button
    onClick={onClick}
    className="flex items-center justify-between w-full p-3.5 rounded-xl border border-border bg-secondary/30 hover:bg-secondary/60 transition-all text-sm font-semibold text-foreground group cursor-pointer"
  >
    <div className="flex items-center gap-3">
      <div className="p-1.5 rounded-lg bg-background border border-border/40 shadow-xs">
        {icon}
      </div>
      {label}
    </div>
    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
  </button>
);

const getInitials = (name?: string) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const formatDate = (dateStr?: string) => {
  if (!dateStr) return "No date";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
};

const checkIsOverdue = (dateStr?: string) => {
  if (!dateStr) return false;
  const due = new Date(dateStr);
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return due < now;
};

const DeadlineItem = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const isOverdue = checkIsOverdue(task.dueDate);
  const assigneeName = task.assignedTo?.name || "Unassigned";

  return (
    <div
      onClick={onClick}
      className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-secondary/20 hover:bg-secondary/40 border border-border/50 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            isOverdue
              ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
              : "bg-amber-500"
          }`}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-brand transition-colors">
            {task.title}
          </p>
          <p
            className={`text-xs font-medium ${
              isOverdue ? "text-red-500 font-semibold" : "text-muted-foreground"
            }`}
          >
            {isOverdue ? "Overdue: " : "Due: "}
            {formatDate(task.dueDate)}
          </p>
        </div>
      </div>

      <div
        title={assigneeName}
        className="h-8 w-8 rounded-full bg-brand/10 text-brand border border-brand/20 flex items-center justify-center text-xs font-bold shrink-0"
      >
        {getInitials(assigneeName)}
      </div>
    </div>
  );
};

const RecentTaskRow = ({ task, onClick }: { task: Task; onClick: () => void }) => {
  const assigneeName = task.assignedTo?.name || "Unassigned";

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case "done":
        return { label: "Done", className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" };
      case "doing":
        return { label: "In Progress", className: "bg-blue-500/10 text-blue-500 border-blue-500/20" };
      default:
        return { label: "To Do", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
    }
  };

  const getPriorityBadge = (priority: TaskPriority) => {
    switch (priority) {
      case "high":
        return { label: "High", className: "bg-red-500/10 text-red-500 border-red-500/20" };
      case "medium":
        return { label: "Medium", className: "bg-amber-500/10 text-amber-500 border-amber-500/20" };
      default:
        return { label: "Low", className: "bg-slate-500/10 text-slate-400 border-slate-500/20" };
    }
  };

  const statusBadge = getStatusBadge(task.status);
  const priorityBadge = getPriorityBadge(task.priority);

  return (
    <div
      onClick={onClick}
      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-secondary/10 hover:bg-secondary/30 border border-border/50 transition-all cursor-pointer group"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div
          className={`h-2.5 w-2.5 rounded-full shrink-0 ${
            task.status === "done"
              ? "bg-emerald-500"
              : task.status === "doing"
              ? "bg-blue-500"
              : "bg-amber-500"
          }`}
        />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground truncate group-hover:text-brand transition-colors">
            {task.title}
          </p>
          <div className="flex items-center flex-wrap gap-2 mt-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${statusBadge.className}`}
            >
              {statusBadge.label}
            </span>
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${priorityBadge.className}`}
            >
              {priorityBadge.label}
            </span>
            {task.tags?.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-medium"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 justify-end shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
        {task.dueDate && (
          <span className="text-xs text-muted-foreground font-medium hidden md:inline">
            Due {formatDate(task.dueDate)}
          </span>
        )}
        <div
          title={`Assigned to ${assigneeName}`}
          className="h-8 w-8 rounded-full bg-brand/10 text-brand border border-brand/20 flex items-center justify-center text-xs font-bold"
        >
          {getInitials(assigneeName)}
        </div>
      </div>
    </div>
  );
};

const DashboardSkeleton = () => (
  <div className="flex flex-col gap-8 pb-12 animate-pulse">
    <div className="flex justify-between items-center border-b border-border/40 pb-6">
      <div className="space-y-2">
        <div className="h-8 w-64 bg-muted rounded-lg" />
        <div className="h-4 w-96 bg-muted/60 rounded-md" />
      </div>
      <div className="h-10 w-32 bg-muted rounded-xl" />
    </div>

    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-card rounded-xl border border-border p-6 space-y-4">
          <div className="flex justify-between">
            <div className="h-4 w-20 bg-muted rounded" />
            <div className="h-8 w-8 bg-muted rounded-lg" />
          </div>
          <div className="h-8 w-16 bg-muted rounded" />
        </div>
      ))}

      <div className="md:col-span-2 lg:col-span-2 h-36 bg-card rounded-xl border border-border p-6" />
      <div className="md:col-span-2 lg:col-span-2 h-36 bg-card rounded-xl border border-border p-6" />
      <div className="md:col-span-2 lg:col-span-2 h-64 bg-card rounded-xl border border-border p-6" />
      <div className="md:col-span-2 lg:col-span-2 h-64 bg-card rounded-xl border border-border p-6" />
      <div className="md:col-span-2 lg:col-span-4 h-72 bg-card rounded-xl border border-border p-6" />
    </div>
  </div>
);
