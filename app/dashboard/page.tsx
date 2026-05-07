"use client";

import React from "react";
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
  Target
} from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
  return (
    <div className="flex flex-col gap-8 pb-10">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back, Alex Admin</h1>
        <p className="text-muted-foreground mt-1">Heres an overview of all team tasks and progress</p>
      </div>

      {/* Main Grid Layout */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
        
        {/* Row 1: Overdue Alert (Full Width) */}
        <div className="md:col-span-2 lg:col-span-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-9 rounded-xl border border-red-900 bg-destructive/5">
            <div className="flex items-center gap-4">
              <div className="p-2.5 rounded-lg bg-destructive/5 text-red-600">
                <CircleAlert className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">7 overdue tasks</h3>
                <p className="text-sm text-muted-foreground">Please review and update the status of overdue tasks</p>
              </div>
            </div>
            <button className="whitespace-nowrap px-4 py-2 text-sm font-medium border border-red-900 text-red-600 hover:bg-destructive/10 rounded-md transition-colors">
              View Tasks
            </button>
          </div>
        </div>

        {/* Row 2: Stat Cards (4 columns) */}
        <StatCard 
          title="To Do" 
          value="4" 
          description="Tasks waiting to start" 
          icon={<ListTodo className="h-4 w-4 text-orange-500" />} 
          iconBg="bg-orange-500/10"
        />
        <StatCard 
          title="In Progress" 
          value="3" 
          description="Tasks being worked on" 
          icon={<Clock className="h-4 w-4 text-blue-500" />} 
          iconBg="bg-blue-500/10"
        />
        <StatCard 
          title="Completed" 
          value="3" 
          description="Tasks finished" 
          icon={<CircleCheck className="h-4 w-4 text-emerald-500" />} 
          iconBg="bg-emerald-500/10"
        />
        <StatCard 
          title="Completion Rate" 
          value="30%" 
          description="Overall progress" 
          icon={<TrendingUp className="h-4 w-4 text-purple-500" />} 
          iconBg="bg-purple-500/10"
        />

        {/* Row 3: Mid-size Cards (2 columns each) */}
        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">Team Members</div>
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Users className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <div className="text-3xl font-bold text-card-foreground">5</div>
          <p className="text-xs text-muted-foreground mt-1">1 admin, 4 users</p>
        </div>

        <div className="md:col-span-2 lg:col-span-2 p-6 rounded-xl border border-border bg-card">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-muted-foreground">Overdue Tasks</div>
            <div className="p-2 rounded-lg bg-destructive/5">
              <CircleAlert className="h-4 w-4 text-red-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-red-600">7</div>
          <p className="text-xs text-muted-foreground mt-1">Need attention</p>
        </div>

        {/* Row 4: Quick Actions & Deadlines (2 columns each) */}
        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <div>
            <div className="flex items-center gap-2 font-semibold text-foreground">
              <Zap className="h-5 w-5 text-brand" />
              Quick Actions
            </div>
            <p className="text-sm text-muted-foreground mt-1">Get started with common tasks</p>
          </div>
          <div className="flex flex-col gap-3">
            <QuickActionButton icon={<Target className="h-4 w-4 text-brand" />} label="Open Kanban Board" />
            <QuickActionButton icon={<ListTodo className="h-4 w-4 text-blue-500" />} label="Create New Task" />
            <QuickActionButton icon={<Users className="h-4 w-4 text-orange-500" />} label="Manage Users" />
          </div>
        </div>

        <div className="md:col-span-2 lg:col-span-2 flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 font-semibold text-foreground">
                <Calendar className="h-5 w-5 text-orange-500" />
                Upcoming Deadlines
              </div>
              <p className="text-sm text-muted-foreground mt-1">Tasks due soon</p>
            </div>
            <Link href="#" className="text-xs font-medium text-brand flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-brand hover:text-black transition-all group">
              View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <DeadlineItem title="Database migration script" date="Apr 2, 2026" initial="J" />
            <DeadlineItem title="Mobile responsiveness audit" date="Apr 3, 2026" initial="S" />
            <DeadlineItem title="User authentication flow" date="Apr 5, 2026" initial="J" />
            <DeadlineItem title="Performance optimization" date="Apr 6, 2026" initial="E" />
            <DeadlineItem title="API rate limiting" date="Apr 8, 2026" initial="J" />
          </div>
        </div>

        {/* Row 5: Recent Tasks (Full Width) */}
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-6 rounded-xl border border-border bg-card p-6">
          <div className="flex items-center justify-between border-b border-border pb-4">
            <div>
              <h3 className="font-semibold text-foreground">Recent Tasks</h3>
              <p className="text-sm text-muted-foreground">Your latest task activity</p>
            </div>
            <Link href="#" className="text-xs font-medium text-brand flex items-center gap-1.5 px-3 py-1.5 rounded-md hover:bg-brand hover:text-black transition-all group">
              View all <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
          <div className="flex flex-col gap-3">
            <RecentTaskItem 
              title="Database migration script" 
              tags={["Todo", "backend", "database"]} 
              initial="J" 
              statusColor="bg-orange-500" 
            />
            <RecentTaskItem 
              title="Performance optimization" 
              tags={["In Progress", "frontend", "performance"]} 
              initial="E" 
              statusColor="bg-blue-500" 
            />
            <RecentTaskItem 
              title="Email notification system" 
              tags={["Todo", "backend", "notifications"]} 
              initial="M" 
              statusColor="bg-orange-500" 
            />
            <RecentTaskItem 
              title="Mobile responsiveness audit" 
              tags={["In Progress", "frontend", "mobile"]} 
              initial="S" 
              statusColor="bg-blue-500" 
            />
            <RecentTaskItem 
              title="API rate limiting" 
              tags={["Todo", "backend", "security"]} 
              initial="J" 
              statusColor="bg-orange-500" 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- Sub-components ---

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
};

const StatCard = ({ title, value, description, icon, iconBg }: StatCardProps) => (
  <div className="p-6 rounded-xl border border-border bg-card flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="text-sm font-medium text-muted-foreground">{title}</div>
      <div className={`p-2 rounded-lg ${iconBg}`}>
        {icon}
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-card-foreground">{value}</div>
      <p className="text-xs text-muted-foreground mt-1">{description}</p>
    </div>
  </div>
);

type QuickActionButtonProps = {
  icon: React.ReactNode;
  label: string;
};

const QuickActionButton = ({ icon, label }: QuickActionButtonProps) => (
  <button className="flex items-center justify-between w-full p-2.5 rounded-lg border border-border bg-secondary/30 hover:bg-secondary/50 transition-colors text-sm text-foreground">
    <div className="flex items-center gap-3">
      {icon}
      {label}
    </div>
    <ArrowRight className="h-4 w-4 text-muted-foreground" />
  </button>
);

interface DeadlineItemProps {
  title: string;
  date: string;
  initial: string;
}

const DeadlineItem = ({ title, date, initial }: DeadlineItemProps) => (
  <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border/50">
    <div className="h-2 w-2 rounded-full bg-red-600 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate">{title}</p>
      <p className="text-xs text-red-600">Overdue: {date}</p>
    </div>
    <div className="h-7 w-7 rounded-full bg-secondary-brand text-brand  flex items-center justify-center text-[11px] font-bold ">
      {initial}
    </div>
  </div>
);

interface RecentTaskItemProps {
  title: string;
  tags: string[];
  initial: string;
  statusColor: string;
}

const RecentTaskItem = ({ title, tags, initial, statusColor }: RecentTaskItemProps) => (
  <div className="flex items-center gap-4 p-4 rounded-lg bg-secondary/10 border border-border/50 hover:bg-secondary/20 transition-colors group">
    <div className={`h-2 w-2 rounded-full ${statusColor} shrink-0`}></div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">{title}</p>
      <div className="flex flex-wrap gap-2 mt-1">
        {tags.map((tag: string) => (
          <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground capitalize">
            {tag}
          </span>
        ))}
      </div>
    </div>
    <div className="h-9 w-9 rounded-full bg-secondary-brand text-brand  flex items-center justify-center text-sm font-bold ">
      {initial}
    </div>
  </div>
);

export default DashboardPage;