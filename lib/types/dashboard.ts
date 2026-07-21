export interface DashboardStats {
  success: boolean;
  totalTasks: number;
  todoCount: number;
  doingCount: number;
  doneCount: number;
  completionRate: number;
  overdueCount: number;
}
